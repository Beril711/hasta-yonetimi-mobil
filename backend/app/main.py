from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError, HTTPException as FastAPIHTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.auth.router import router as auth_router
from app.symptom.router import router as symptom_router
from app.hospital.router import router as hospital_router
from app.appointment.router import router as appointment_router
from app.notification.router import router as notification_router
from app.base.exception_handler import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)

app = FastAPI(
    title="Hasta Yönetimi API",
    description="Hasta yönetim sistemi backend API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(FastAPIHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(auth_router)
app.include_router(symptom_router)
app.include_router(hospital_router)
app.include_router(appointment_router)
app.include_router(notification_router)

@app.get("/")
async def root():
    return {"message": "Hasta Yönetimi API çalışıyor 🚀"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
