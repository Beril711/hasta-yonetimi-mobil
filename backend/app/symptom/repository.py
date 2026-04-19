from sqlalchemy.ext.asyncio import AsyncSession
from app.base.base_repo import BaseRepository
from app.symptom.model import SymptomQuery

class SymptomRepository(BaseRepository[SymptomQuery]):
    def __init__(self, db: AsyncSession):
        super().__init__(SymptomQuery, db)

    async def get_by_user(self, user_id):
        return await self.get_many(
            filters=[SymptomQuery.user_id == user_id],
            order_by=SymptomQuery.created_at.desc()
        )
