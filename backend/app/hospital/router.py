from fastapi import APIRouter, Depends
from app.hospital.schema import HospitalSearchDTO, HospitalDTO
from app.hospital.service import HospitalService
from app.base.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

DEPARTMENTS = [
    "Kardiyoloji", "Nöroloji", "Dahiliye", "Ortopedi",
    "Göz Hastalıkları", "Kulak Burun Boğaz", "Dermatoloji",
    "Üroloji", "Kadın Hastalıkları", "Psikiyatri",
    "Göğüs Hastalıkları", "Endokrinoloji", "Aile Hekimliği",
    "Genel Cerrahi", "Çocuk Hastalıkları", "Fizik Tedavi"
]

DOCTORS = {
    "Kardiyoloji": ["Dr. Ahmet Yılmaz", "Dr. Elif Kaya", "Dr. Mehmet Demir"],
    "Nöroloji": ["Dr. Ayşe Çelik", "Dr. Can Öztürk", "Dr. Zeynep Aksoy"],
    "Dahiliye": ["Dr. Ali Şahin", "Dr. Fatma Koç", "Dr. Hasan Yıldız"],
    "Ortopedi": ["Dr. Murat Arslan", "Dr. Selin Güneş", "Dr. Emre Aydın"],
    "Göz Hastalıkları": ["Dr. Burak Özkan", "Dr. Derya Tekin", "Dr. Serkan Uçar"],
    "Kulak Burun Boğaz": ["Dr. Deniz Kara", "Dr. Pınar Erdoğan", "Dr. Oğuz Çetin"],
    "Dermatoloji": ["Dr. Esra Yalçın", "Dr. Tolga Şimşek", "Dr. Gül Akın"],
    "Üroloji": ["Dr. Kemal Tunç", "Dr. Volkan Sezer", "Dr. Barış Korkmaz"],
    "Kadın Hastalıkları": ["Dr. Sibel Doğan", "Dr. Melis Acar", "Dr. Hülya Kaplan"],
    "Psikiyatri": ["Dr. Canan Erdem", "Dr. Ozan Kılıç", "Dr. Neslihan Yılmaz"],
    "Göğüs Hastalıkları": ["Dr. İbrahim Çakır", "Dr. Sevgi Polat", "Dr. Ufuk Bayram"],
    "Endokrinoloji": ["Dr. Leyla Güler", "Dr. Taner Özer", "Dr. Aslı Kurt"],
    "Aile Hekimliği": ["Dr. Yusuf Aydoğan", "Dr. Merve Şen", "Dr. Kadir Aslan"],
    "Genel Cerrahi": ["Dr. Onur Başar", "Dr. Dilek Yıldırım", "Dr. Cem Atalay"],
    "Çocuk Hastalıkları": ["Dr. Berna Özdemir", "Dr. Uğur Tan", "Dr. Nilgün Çevik"],
    "Fizik Tedavi": ["Dr. Selim Karaca", "Dr. Ebru Sönmez", "Dr. Hayri Duman"]
}

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

@router.get("/departments")
async def get_departments(current_user=Depends(get_current_user)):
    return DEPARTMENTS

@router.get("/doctors")
async def get_doctors(department: str = None, current_user=Depends(get_current_user)):
    if department and department in DOCTORS:
        return DOCTORS[department]
    return DOCTORS