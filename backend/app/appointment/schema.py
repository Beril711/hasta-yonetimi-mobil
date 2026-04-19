from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class CreateAppointmentDTO(BaseModel):
    hospital_name: str
    department: str
    doctor_name: str
    appointment_date: datetime

class AppointmentDTO(BaseModel):
    id: UUID
    hospital_name: str
    department: str
    doctor_name: str
    appointment_date: datetime
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
