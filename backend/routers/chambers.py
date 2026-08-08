from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from backend.database import get_supabase_client
from backend.auth import get_user_context_without_chamber
from backend.schemas import ChamberCreate, ChamberResponse

router = APIRouter()

@router.post("/chambers", response_model=ChamberResponse)
async def create_chamber(
    chamber_data: ChamberCreate,
    decoded_token: dict = Depends(get_user_context_without_chamber),
    supabase: Client = Depends(get_supabase_client)
):
    uid = decoded_token["uid"]
    
    # Pre-check context before hitting RPC to save DB load
    if decoded_token.get("chamber_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already belongs to a chamber"
        )
        
    try:
        res = supabase.rpc(
            "create_chamber_transaction",
            {
                "p_chamber_name": chamber_data.name,
                "p_bar_number": chamber_data.bar_number or "",
                "p_user_id": uid
            }
        ).execute()
        
        # Check if returned response is empty or has data
        if not res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create chamber: empty response from database"
            )
            
        data = res.data
        return ChamberResponse(
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
