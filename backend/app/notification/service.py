from fastapi import HTTPException, status
from app.notification.repository import NotificationRepository
from app.notification.model import Notification

class NotificationService:
    def __init__(self, repository: NotificationRepository):
        self.repository = repository

    async def get_my_notifications(self, user_id):
        return await self.repository.get_by_user(user_id)

    async def mark_as_read(self, notification_id, user_id):
        notification = await self.repository.get_by_id(notification_id)
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bildirim bulunamadı"
            )
        if str(notification.user_id) != str(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu bildirimi okuma yetkiniz yok"
            )
        notification.is_read = True
        await self.repository.update(notification)
        return notification

    async def get_unread_count(self, user_id):
        count = await self.repository.get_unread_count(user_id)
        return {"unread_count": count}

    async def create_notification(self, user_id, title: str, message: str):
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            is_read=False
        )
        await self.repository.create(notification)
        return notification
