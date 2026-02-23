from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import TypeVar, Generic, Type
from app.core.base_model import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id):
        result = await self.db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self):
        result = await self.db.execute(select(self.model))
        return result.scalars().all()

    async def create(self, obj):
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update(self, id, data: dict):
        await self.db.execute(
            update(self.model)
            .where(self.model.id == id)
            .values(**data)
        )
        await self.db.commit()
        return await self.get_by_id(id)

    async def delete(self, id):
        await self.db.execute(
            delete(self.model).where(self.model.id == id)
        )
        await self.db.commit()