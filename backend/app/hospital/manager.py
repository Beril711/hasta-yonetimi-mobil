import httpx

class HospitalManager:
    BASE_URL = "https://overpass-api.de/api/interpreter"

    async def search_nearby(self, latitude: float, longitude: float, department: str = None, radius: int = 5000) -> list:
        query = f"""
[out:json];
node["amenity"="hospital"](around:{radius},{latitude},{longitude});
out body;
"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.BASE_URL,
                    data={"data": query},
                    timeout=15.0
                )
                if not response.content:
                    return []
                data = response.json()
        except Exception:
            return []

        hospitals = []
        for element in data.get("elements", []):
            tags = element.get("tags", {})
            name = tags.get("name", "İsimsiz Hastane")

            if department:
                name_lower = name.lower()
                dept_lower = department.lower()
                if dept_lower not in name_lower and "hastane" not in name_lower:
                    continue

            hospitals.append({
                "place_id": str(element.get("id", "")),
                "name": name,
                "address": tags.get("addr:full", tags.get("addr:street", "Adres bilgisi yok")),
                "latitude": element.get("lat", 0),
                "longitude": element.get("lon", 0),
                "rating": None,
                "distance": None
            })

        return hospitals[:10]
