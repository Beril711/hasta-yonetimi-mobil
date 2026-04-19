from sqlalchemy.ext.asyncio import AsyncSession
from app.base.base_repo import BaseRepository
from app.notification.model import Notification

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, db: AsyncSession):
        super().__init__(Notification, db)

    async def get_by_user(self, user_id):
        return await self.get_many(
            filters=[Notification.user_id == user_id],
            order_by=Notification.created_at.desc()
        )

    async def get_unread_count(self, user_id):
        notifications = await self.get_many(
            filters=[
                Notification.user_id == user_id,
                Notification.is_read == False
            ]
        )
        return len(notifications)
