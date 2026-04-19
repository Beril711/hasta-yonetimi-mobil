from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.base.base_repo import BaseRepository
from app.appointment.model import Appointment
from datetime import datetime

class AppointmentRepository(BaseRepository[Appointment]):
    def __init__(self, db: AsyncSession):
        super().__init__(Appointment, db)

    async def get_by_user(self, user_id):
        return await self.get_many(
            filters=[Appointment.user_id == user_id],
            order_by=Appointment.appointment_date.desc()
        )

    async def get_slots_by_date(self, date: datetime):
        return await self.get_many(
            filters=[
                Appointment.appointment_date >= date.replace(hour=0, minute=0, second=0),
                Appointment.appointment_date <= date.replace(hour=23, minute=59, second=59),
                Appointment.status != "cancelled"
            ]
        )
