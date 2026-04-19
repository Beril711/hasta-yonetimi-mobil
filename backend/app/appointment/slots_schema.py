from pydantic import BaseModel
from datetime import datetime

class AvailableSlotDTO(BaseModel):
    slot_date: datetime
    is_available: bool
