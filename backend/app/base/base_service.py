from app.base.base_repo import BaseRepository

class BaseService:
    def __init__(self, repository: BaseRepository):
        self.repository = repository

    async def get_by_id(self, id):
        return await self.repository.get_by_id(id)

    async def get_all(self):
        return await self.repository.get_all()

    async def delete(self, id):
        return await self.repository.delete(id)
