import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Header, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Initialize Firebase Admin SDK
# If running in emulator environment, it will automatically use emulator host settings
if os.environ.get("FIREBASE_AUTH_EMULATOR_HOST") or os.environ.get("FIRESTORE_EMULATOR_HOST"):
    if not firebase_admin._apps:
        firebase_admin.initialize_app(options={"projectId": "vakeel-7aaf8"})
else:
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") or os.path.join(os.path.dirname(__file__), "firebase-service-account.json")
    if not firebase_admin._apps:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            try:
                # Fallback with explicit project ID so token verification works
                firebase_admin.initialize_app(options={"projectId": "vakeel-7aaf8"})
                print("Firebase Admin SDK initialized with projectId fallback options.")
            except Exception as e:
                # In development fallback mode, we attempt default initialization
                print(f"Warning: Firebase Admin SDK failed to initialize: {e}")
                print("Running in LOCAL OFFLINE / DEVELOPMENT FALLBACK MODE.")

app = FastAPI(title="Vakeel Multi-Tenant Isolation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetch client
try:
    db = firestore.client()
except Exception as e:
    db = None
    print(f"Firestore Client could not be created: {e}")

# Pydantic Schemas
class ChamberCreate(BaseModel):
    name: str
    bar_number: Optional[str] = None

class InviteCreate(BaseModel):
    role: str  # senior, associate, intern
    email: EmailStr
    expires_in_hours: Optional[int] = 24

# Helper for authentication extraction
async def get_chamber_context(request: Request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )
    token = auth_header.replace("Bearer ", "")
    
    try:
        decoded = auth.verify_id_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )
        
    chamber_id = decoded.get("chamber_id")
    role = decoded.get("role")
    
    if not chamber_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not assigned to a chamber (missing chamber_id claim)"
        )
        
    return {
        "chamber_id": chamber_id,
        "role": role,
        "uid": decoded["uid"],
        "email": decoded.get("email")
    }

async def get_user_context_without_chamber(request: Request):
    """Dependency for users who might not have a chamber yet (onboarding/accepting invites)."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )
    token = auth_header.replace("Bearer ", "")
    
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )

@app.post("/chambers")
async def create_chamber(chamber_data: ChamberCreate, decoded_token: dict = Depends(get_user_context_without_chamber)):
    if not db:
        raise HTTPException(
            status_code=503, 
            detail="Firestore client not available. Please verify credentials/configuration."
        )
        
    uid = decoded_token["uid"]
    email = decoded_token.get("email")
    
    # 1. Generate new chamber_id (UUID)
    chamber_id = str(uuid.uuid4())
    
    # 2. Check if user is already in a chamber (prevent re-creation)
    if decoded_token.get("chamber_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already belongs to a chamber"
        )
        
    try:
        # 3. Create chamber document in Firestore
        chamber_ref = db.collection("chambers").document(chamber_id)
        chamber_ref.set({
            "id": chamber_id,
            "name": chamber_data.name,
            "bar_number": chamber_data.bar_number,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "creatorId": uid
        })
        
        # 4. Create membership document
        member_ref = chamber_ref.collection("members").document(uid)
        member_ref.set({
            "uid": uid,
            "email": email,
            "role": "senior",
            "joinedAt": firestore.SERVER_TIMESTAMP
        })
    except Exception as db_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"Firestore access failed: {str(db_err)}. "
                "If you are running locally against a live Firebase project, please place your Firebase "
                "Service Account key JSON file in the 'backend' folder as 'firebase-service-account.json'."
            )
        )
    
    # 5. Set custom claims via Firebase Admin Auth
    try:
        auth.set_custom_user_claims(uid, {
            "chamber_id": chamber_id,
            "role": "senior"
        })
    except Exception as e:
        # Clean up database on failure
        try:
            chamber_ref.delete()
        except:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"Failed to set user custom claims: {str(e)}. "
                "This action requires service account credentials. Please place your Firebase "
                "Service Account key JSON file in the 'backend' folder as 'firebase-service-account.json'."
            )
        )
        
    return {
        "status": "success",
        "chamber_id": chamber_id,
        "role": "senior"
    }

@app.post("/invites")
async def create_invite(invite_data: InviteCreate, caller: dict = Depends(get_chamber_context)):
    if not db:
        raise HTTPException(status_code=503, detail="Firestore client not available")
        
    caller_role = caller["role"]
    caller_chamber_id = caller["chamber_id"]
    
    # Enforce role checks: only senior or associate can create invites
    if caller_role not in ["senior", "associate"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Senior or Associate advocates can generate invites"
        )
        
    # Validate target role
    if invite_data.role not in ["senior", "associate", "intern"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role specified in invite"
        )
        
    invite_id = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(hours=invite_data.expires_in_hours)
    
    # Create top-level invite document
    invite_ref = db.collection("invites").document(invite_id)
    invite_ref.set({
        "id": invite_id,
        "chamber_id": caller_chamber_id,
        "role": invite_data.role,
        "email": invite_data.email.lower(),
        "expires_at": expires_at.isoformat(),
        "used": False,
        "created_by": caller["uid"],
        "createdAt": firestore.SERVER_TIMESTAMP
    })
    
    return {
        "invite_id": invite_id,
        "invite_link": f"http://localhost:5174/?invite={invite_id}"
    }

@app.post("/invites/{invite_id}/accept")
async def accept_invite(invite_id: str, decoded_token: dict = Depends(get_user_context_without_chamber)):
    if not db:
        raise HTTPException(
            status_code=503, 
            detail="Firestore client not available. Please verify credentials/configuration."
        )
        
    uid = decoded_token["uid"]
    email = decoded_token.get("email", "").lower()
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email is required to accept an invite"
        )
        
    # Read the invite
    try:
        invite_ref = db.collection("invites").document(invite_id)
        invite_doc = invite_ref.get()
    except Exception as db_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"Firestore access failed: {str(db_err)}. "
                "Please place your Firebase Service Account key JSON file in the 'backend' folder "
                "as 'firebase-service-account.json'."
            )
        )
    
    if not invite_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found or invalid"
        )
        
    invite = invite_doc.to_dict()
    
    if invite.get("used"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This invite has already been used"
        )
        
    # Validate expiration
    expires_at_str = invite.get("expires_at")
    if expires_at_str:
        expires_at = datetime.fromisoformat(expires_at_str)
        if datetime.now(timezone.utc) > expires_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This invite has expired"
            )
            
    # Validate email lock (if present)
    invite_email = invite.get("email")
    if invite_email and invite_email != email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This invite is locked to a different email address"
        )
        
    chamber_id = invite["chamber_id"]
    target_role = invite["role"]
    
    # Check if user is already in a chamber
    if decoded_token.get("chamber_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already belongs to a chamber"
        )
        
    try:
        # Add member to chamber subcollection
        db.collection("chambers").document(chamber_id).collection("members").document(uid).set({
            "uid": uid,
            "email": email,
            "role": target_role,
            "joinedAt": firestore.SERVER_TIMESTAMP
        })
    except Exception as db_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"Firestore access failed: {str(db_err)}. "
                "Please place your Firebase Service Account key JSON file in the 'backend' folder "
                "as 'firebase-service-account.json'."
            )
        )
    
    # Set custom claims
    try:
        auth.set_custom_user_claims(uid, {
            "chamber_id": chamber_id,
            "role": target_role
        })
    except Exception as e:
        # Clean up database member record on failure
        try:
            db.collection("chambers").document(chamber_id).collection("members").document(uid).delete()
        except:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"Failed to set user custom claims: {str(e)}. "
                "Please place your Firebase Service Account key JSON file in the 'backend' folder "
                "as 'firebase-service-account.json'."
            )
        )
        
    # Mark invite as used
    try:
        invite_ref.update({"used": True})
    except:
        pass
    
    return {
        "status": "success",
        "chamber_id": chamber_id,
        "role": target_role
    }
