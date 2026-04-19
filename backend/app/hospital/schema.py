from pydantic import BaseModel
from typing import Optional

class HospitalSearchDTO(BaseModel):
    latitude: float
    longitude: float
    department: Optional[str] = None
    radius: Optional[int] = 5000

class HospitalDTO(BaseModel):
    place_id: str
    name: str
    address: str
    latitude: float
    longitude: float
    rating: Optional[float] = None
    distance: Optional[str] = None
