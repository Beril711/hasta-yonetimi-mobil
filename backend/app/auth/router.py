from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.auth.schema import RegisterDTO, LoginDTO, TokenDTO, UserResponseDTO
from app.auth.service import AuthService
from app.auth.repository import AuthRepository
from app.base.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(AuthRepository(db))

@router.post("/register", response_model=TokenDTO)
async def register(
    dto: RegisterDTO,
    service: AuthService = Depends(get_auth_service)
):
    return await service.register(dto)

@router.post("/login", response_model=TokenDTO)
async def login(
    dto: LoginDTO,
    service: AuthService = Depends(get_auth_service)
):
    return await service.login(dto)

@router.get("/me", response_model=UserResponseDTO)
async def get_me(current_user=Depends(get_current_user)):
    return current_user
