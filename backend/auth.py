from typing import Any

from fastapi import Depends, HTTPException, Request, status
from supabase import Client

from backend.database import get_supabase_client


async def get_user_context_without_chamber(
    request: Request,
    supabase: Client = Depends(get_supabase_client),
) -> dict[str, Any]:
    auth_header = request.headers.get("Authorization", "")

    scheme, _, token = auth_header.partition(" ")

    if scheme.lower() != "bearer" or not token.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    try:
        # Supabase validates the access token against the Auth server.
        auth_response = supabase.auth.get_user(token.strip())
        user = auth_response.user
    except HTTPException:
        raise
    except Exception:
        # Do not expose raw Supabase/Auth errors to the client.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    try:
        profile_response = (
            supabase.table("profiles")
            .select("chamber_id, role")
            .eq("id", user.id)
            .limit(1)
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to load user profile",
        )

    if not profile_response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found",
        )

    profile = profile_response.data[0]

    return {
        "uid": user.id,
        "email": user.email,
        "chamber_id": profile.get("chamber_id"),
        "role": profile.get("role"),
    }


async def get_chamber_context(
    user_ctx: dict[str, Any] = Depends(get_user_context_without_chamber),
) -> dict[str, Any]:
    chamber_id = user_ctx.get("chamber_id")
    role = user_ctx.get("role")

    if not chamber_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not assigned to a chamber",
        )

    if role not in {"Senior", "Associate", "Intern"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User has an invalid or missing chamber role",
        )

    return user_ctx