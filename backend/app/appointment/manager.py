from datetime import datetime, timezone

class AppointmentManager:
    def check_conflict(self, existing_appointments: list, new_date: datetime) -> bool:
        if new_date.tzinfo is None:
            new_date = new_date.replace(tzinfo=timezone.utc)

        for appointment in existing_appointments:
            if appointment.status == "cancelled":
                continue
            apt_date = appointment.appointment_date
            if apt_date.tzinfo is None:
                apt_date = apt_date.replace(tzinfo=timezone.utc)
            diff = abs((apt_date - new_date).total_seconds())
            if diff < 3600:
                return True
        return False