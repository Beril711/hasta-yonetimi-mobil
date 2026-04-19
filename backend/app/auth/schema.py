from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional

class RegisterDTO(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class LoginDTO(BaseModel):
    email: EmailStr
    password: str

class TokenDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponseDTO(BaseModel):
    id: UUID
    full_name: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True

class UpdateProfileDTO(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
