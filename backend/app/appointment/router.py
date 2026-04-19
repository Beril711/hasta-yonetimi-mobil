from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.appointment.schema import CreateAppointmentDTO, AppointmentDTO
from app.appointment.slots_schema import AvailableSlotDTO
from app.appointment.service import AppointmentService
from app.appointment.repository import AppointmentRepository
from app.base.dependencies import get_current_user
from typing import List
from datetime import datetime, timedelta

router = APIRouter(prefix="/appointments", tags=["Appointments"])

def get_appointment_service(db: AsyncSession = Depends(get_db)) -> AppointmentService:
    return AppointmentService(AppointmentRepository(db))

@router.post("", response_model=AppointmentDTO)
async def create_appointment(
    dto: CreateAppointmentDTO,
    service: AppointmentService = Depends(get_appointment_service),
    current_user=Depends(get_current_user)
):
    return await service.create(dto, current_user.id)

@router.get("", response_model=List[AppointmentDTO])
async def get_appointments(
    service: AppointmentService = Depends(get_appointment_service),
    current_user=Depends(get_current_user)
):
    return await service.get_my_appointments(current_user.id)

@router.patch("/{appointment_id}/cancel", response_model=AppointmentDTO)
async def cancel_appointment(
    appointment_id: str,
    service: AppointmentService = Depends(get_appointment_service),
    current_user=Depends(get_current_user)
):
    return await service.cancel(appointment_id, current_user.id)

@router.get("/available-slots", response_model=List[AvailableSlotDTO])
async def get_available_slots(
    date: str,
    service: AppointmentService = Depends(get_appointment_service),
    current_user=Depends(get_current_user)
):
    return await service.get_available_slots(date)
