from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class NotificationDTO(BaseModel):
    id: UUID
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
