from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.symptom.schema import SymptomInputDTO, SymptomResultDTO
from app.symptom.service import SymptomService
from app.symptom.repository import SymptomRepository
from app.base.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/symptoms", tags=["Symptoms"])

def get_symptom_service(db: AsyncSession = Depends(get_db)) -> SymptomService:
    return SymptomService(SymptomRepository(db))

@router.post("/analyze", response_model=SymptomResultDTO)
async def analyze(
    dto: SymptomInputDTO,
    service: SymptomService = Depends(get_symptom_service),
    current_user=Depends(get_current_user)
):
    return await service.analyze(dto, current_user.id)

@router.get("/history", response_model=List[SymptomResultDTO])
async def get_history(
    service: SymptomService = Depends(get_symptom_service),
    current_user=Depends(get_current_user)
):
    return await service.get_history(current_user.id)
