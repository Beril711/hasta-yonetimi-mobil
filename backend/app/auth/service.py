from fastapi import HTTPException, status
from app.auth.repository import AuthRepository
from app.auth.schema import RegisterDTO, LoginDTO, TokenDTO
from app.auth.model import User
from app.base.security import hash_password, verify_password, create_access_token

class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository = repository

    async def register(self, dto: RegisterDTO) -> TokenDTO:
        existing_user = await self.repository.get_by_email(dto.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu e-posta adresi zaten kayıtlı"
            )
        user = User(
            full_name=dto.full_name,
            email=dto.email,
            password=hash_password(dto.password)
        )
        await self.repository.create(user)
        access_token = create_access_token({"sub": str(user.id)})
        return TokenDTO(access_token=access_token)

    async def login(self, dto: LoginDTO) -> TokenDTO:
        user = await self.repository.get_by_email(dto.email)
        if not user or not verify_password(dto.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="E-posta veya şifre hatalı"
            )
        access_token = create_access_token({"sub": str(user.id)})
        return TokenDTO(access_token=access_token)
