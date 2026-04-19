from fastapi import HTTPException, status
from app.appointment.repository import AppointmentRepository
from app.appointment.manager import AppointmentManager
from app.appointment.schema import CreateAppointmentDTO
from app.appointment.slots_schema import AvailableSlotDTO
from app.appointment.model import Appointment
from datetime import datetime, timedelta

class AppointmentService:
    def __init__(self, repository: AppointmentRepository):
        self.repository = repository
        self.manager = AppointmentManager()

    async def create(self, dto: CreateAppointmentDTO, user_id) -> Appointment:
        existing = await self.repository.get_by_user(user_id)
        if self.manager.check_conflict(existing, dto.appointment_date):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu saatte zaten bir randevunuz var"
            )
        appointment = Appointment(
            user_id=user_id,
            hospital_name=dto.hospital_name,
            department=dto.department,
            doctor_name=dto.doctor_name,
            appointment_date=dto.appointment_date,
            status="active"
        )
        await self.repository.create(appointment)
        return appointment

    async def get_my_appointments(self, user_id):
        return await self.repository.get_by_user(user_id)

    async def cancel(self, appointment_id, user_id):
        appointment = await self.repository.get_by_id(appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Randevu bulunamadı"
            )
        if str(appointment.user_id) != str(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu randevuyu iptal etme yetkiniz yok"
            )
        appointment.status = "cancelled"
        await self.repository.update(appointment)
        return appointment

    async def get_available_slots(self, date_str: str) -> list:
        date = datetime.fromisoformat(date_str)
        existing = await self.repository.get_slots_by_date(date)
        existing_times = {a.appointment_date.hour for a in existing}

        slots = []
        for hour in range(9, 18):
            slot_date = date.replace(hour=hour, minute=0, second=0, microsecond=0)
            slots.append(AvailableSlotDTO(
                slot_date=slot_date,
                is_available=hour not in existing_times
            ))

        return slots
