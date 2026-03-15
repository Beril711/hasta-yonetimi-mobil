from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class SymptomInputDTO(BaseModel):
    symptoms: str

class SymptomResultDTO(BaseModel):
    id: UUID
    symptom_text: str
    suggested_department: str
    ai_response: str
    created_at: datetime

    class Config:
        from_attributes = True
