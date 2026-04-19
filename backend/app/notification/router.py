from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.notification.schema import NotificationDTO
from app.notification.service import NotificationService
from app.notification.repository import NotificationRepository
from app.base.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

def get_notification_service(db: AsyncSession = Depends(get_db)) -> NotificationService:
    return NotificationService(NotificationRepository(db))

@router.get("", response_model=List[NotificationDTO])
async def get_notifications(
    service: NotificationService = Depends(get_notification_service),
    current_user=Depends(get_current_user)
):
    return await service.get_my_notifications(current_user.id)

@router.get("/unread-count")
async def get_unread_count(
    service: NotificationService = Depends(get_notification_service),
    current_user=Depends(get_current_user)
):
    return await service.get_unread_count(current_user.id)

@router.patch("/{notification_id}/read", response_model=NotificationDTO)
async def mark_as_read(
    notification_id: str,
    service: NotificationService = Depends(get_notification_service),
    current_user=Depends(get_current_user)
):
    return await service.mark_as_read(notification_id, current_user.id)
