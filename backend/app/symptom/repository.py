from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.base.base_repo import BaseRepository
from app.symptom.model import SymptomQuery

class SymptomRepository(BaseRepository[SymptomQuery]):
    def __init__(self, db: AsyncSession):
        super().__init__(SymptomQuery, db)

    async def get_by_user(self, user_id):
        result = await self.db.execute(
            select(SymptomQuery)
            .where(SymptomQuery.user_id == user_id)
            .order_by(SymptomQuery.created_at.desc())
        )
        return result.scalars().all()
