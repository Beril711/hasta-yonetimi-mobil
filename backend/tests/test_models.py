import pytest
from app.auth.model import User
from app.appointment.model import Appointment
from app.symptom.model import SymptomQuery
from app.hospital.model import Hospital
from app.notification.model import Notification
from app.device.model import DeviceToken

def test_user_model_tablename():
    assert User.__tablename__ == "users"

def test_appointment_model_tablename():
    assert Appointment.__tablename__ == "appointments"

def test_symptom_model_tablename():
    assert SymptomQuery.__tablename__ == "symptom_queries"

def test_hospital_model_tablename():
    assert Hospital.__tablename__ == "hospitals"

def test_notification_model_tablename():
    assert Notification.__tablename__ == "notifications"

def test_device_token_model_tablename():
    assert DeviceToken.__tablename__ == "device_tokens"