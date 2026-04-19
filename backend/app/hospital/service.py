from app.hospital.manager import HospitalManager
from app.hospital.schema import HospitalSearchDTO

class HospitalService:
    def __init__(self):
        self.manager = HospitalManager()

    async def search(self, dto: HospitalSearchDTO) -> list:
        return await self.manager.search_nearby(
            latitude=dto.latitude,
            longitude=dto.longitude,
            department=dto.department,
            radius=dto.radius
        )
