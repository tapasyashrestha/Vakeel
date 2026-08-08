import os
import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from backend.database import get_supabase_client
from backend.auth import get_chamber_context, get_user_context_without_chamber
from backend.schemas import InviteCreate, InviteResponse, InviteAcceptResponse

router = APIRouter()

@router.post("/invites", response_model=InviteResponse)
async def create_invite(
    invite_data: InviteCreate,
    caller: dict = Depends(get_chamber_context),
    supabase: Client = Depends(get_supabase_client)
):
    caller_role = caller.get("role")
    caller_chamber_id = caller.get("chamber_id")
    
    # Enforce role checks: only Senior or Associate can create invites
    # Case-insensitive checks, mapping to capitalized standard forms
    normalized_caller_role = (caller_role or "").strip().capitalize()
    if normalized_caller_role not in ["Senior", "Associate"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Senior or Associate advocates can generate invites"
        )
        
    # Validate target role
    target_role = invite_data.role.strip().capitalize()
    if target_role not in ["Senior", "Associate", "Intern"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role specified in invite"
        )
        
    invite_id = str(uuid.uuid4())
    now_dt = datetime.now(timezone.utc)
    expires_at = (now_dt + timedelta(hours=invite_data.expires_in_hours)).isoformat()
    email_lower = invite_data.email.lower().strip()
    
    try:
        # Step 1. Mark matching expired unused invites as used to prevent unique constraint violation
        supabase.table("invites")\
            .update({"used": True})\
            .eq("chamber_id", caller_chamber_id)\
            .eq("email", email_lower)\
            .eq("used", False)\
            .lt("expires_at", now_dt.isoformat())\
            .execute()
    except Exception as e:
        # If cleanup fail, we still try to insert
        pass

    try:
        # Step 2. Insert new invite
        supabase.table("invites").insert({
            "id": invite_id,
            "chamber_id": caller_chamber_id,
            "role": target_role,
            "email": email_lower,
            "expires_at": expires_at,
            "used": False,
            "created_by": caller["uid"]
        }).execute()
    except Exception as e:
        error_msg = str(e)
        if "invites_unused_email_chamber_uniq_idx" in error_msg or "duplicate key value" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An active invitation for this email address already exists in this chamber"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate invite: {error_msg}"
        )
        
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    invite_link = f"{frontend_url}/?invite={invite_id}"
    
    return InviteResponse(
        invite_id=invite_id,
        invite_link=invite_link
    )

@router.post("/invites/{invite_id}/accept", response_model=InviteAcceptResponse)
async def accept_invite(
    invite_id: str,
    decoded_token: dict = Depends(get_user_context_without_chamber),
    supabase: Client = Depends(get_supabase_client)
):
    uid = decoded_token["uid"]
    email = decoded_token.get("email")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email is required to accept an invite"
        )
        
    if decoded_token.get("chamber_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already belongs to a chamber"
        )
        
    try:
        res = supabase.rpc(
            "accept_invite_transaction",
            {
                "p_invite_id": invite_id,
                "p_user_id": uid,
                "p_email": email.lower().strip()
            }
        ).execute()
        
        if not res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to accept invite: empty database response"
            )
            
        data = res.data
        return InviteAcceptResponse(
            status=data.get("status", "success"),
            chamber_id=data.get("chamber_id"),
            role=data.get("role")
        )
    except Exception as e:
        error_msg = str(e)
        if "already_belongs_to_chamber" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already belongs to a chamber"
            )
        elif "profile_not_found" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        elif "invite_not_found" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invite not found or invalid"
            )
        elif "invite_already_used" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This invite has already been used"
            )
        elif "invite_expired" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This invite has expired"
            )
        elif "invite_email_mismatch" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This invite is locked to a different email address"
            )
        elif "invite_chamber_not_found" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The chamber associated with this invite was not found"
            )
        elif "profile_update_failed" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error: Profile update failed"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database execution failed: {error_msg}"
            )
