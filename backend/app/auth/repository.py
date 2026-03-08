from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.base.base_repo import BaseRepository
from app.auth.model import User

class AuthRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str):
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
