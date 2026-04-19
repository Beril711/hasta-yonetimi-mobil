from fastapi import APIRouter, Depends
from app.hospital.schema import HospitalSearchDTO, HospitalDTO
from app.hospital.service import HospitalService
from app.base.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

def get_hospital_service() -> HospitalService:
    return HospitalService()

@router.get("/search", response_model=List[HospitalDTO])
async def search_hospitals(
    latitude: float,
    longitude: float,
    department: str = None,
    radius: int = 5000,
    service: HospitalService = Depends(get_hospital_service),
    current_user=Depends(get_current_user)
):
    dto = HospitalSearchDTO(
        latitude=latitude,
        longitude=longitude,
        department=department,
        radius=radius
    )
    return await service.search(dto)
