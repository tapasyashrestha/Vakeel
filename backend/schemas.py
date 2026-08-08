from pydantic import BaseModel, EmailStr
from typing import Optional

class ChamberCreate(BaseModel):
    name: str
    bar_number: Optional[str] = None

class ChamberResponse(BaseModel):
    status: str
    chamber_id: str
    role: str

class InviteCreate(BaseModel):
    role: str  # Senior, Associate, Intern
    email: EmailStr
    expires_in_hours: Optional[int] = 24

class InviteResponse(BaseModel):
    invite_id: str
    invite_link: str

class InviteAcceptResponse(BaseModel):
    status: str
    chamber_id: str
    role: str
