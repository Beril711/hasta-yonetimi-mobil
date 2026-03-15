from app.symptom.repository import SymptomRepository
from app.symptom.manager import SymptomManager
from app.symptom.schema import SymptomInputDTO
from app.symptom.model import SymptomQuery

class SymptomService:
    def __init__(self, repository: SymptomRepository):
        self.repository = repository
        self.manager = SymptomManager()

    async def analyze(self, dto: SymptomInputDTO, user_id) -> SymptomQuery:
        result = await self.manager.analyze(dto.symptoms)
        query = SymptomQuery(
            user_id=user_id,
            symptom_text=dto.symptoms,
            suggested_department=result["suggested_department"],
            ai_response=result["ai_response"]
        )
        await self.repository.create(query)
        return query

    async def get_history(self, user_id):
        return await self.repository.get_by_user(user_id)
