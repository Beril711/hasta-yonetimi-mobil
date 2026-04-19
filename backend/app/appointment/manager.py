from datetime import datetime

class AppointmentManager:
    def check_conflict(self, existing_appointments: list, new_date: datetime) -> bool:
        for appointment in existing_appointments:
            if appointment.status == "cancelled":
                continue
            diff = abs((appointment.appointment_date - new_date).total_seconds())
            if diff < 3600:
                return True
        return False
