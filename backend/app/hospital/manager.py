import httpx
import math

class HospitalManager:
    BASE_URL = "https://nominatim.openstreetmap.org/search"

    def _haversine(self, lat1, lon1, lat2, lon2):
        R = 6371000
        to_rad = math.radians
        d_lat = to_rad(lat2 - lat1)
        d_lon = to_rad(lon2 - lon1)
        a = math.sin(d_lat / 2) ** 2 + math.cos(to_rad(lat1)) * math.cos(to_rad(lat2)) * math.sin(d_lon / 2) ** 2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    async def search_nearby(self, latitude: float, longitude: float, department: str = None, radius: int = 5000) -> list:
        keyword = "hastane"

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.BASE_URL,
                    params={
                        "q": f"{keyword}",
                        "format": "json",
                        "limit": 30,
                        "viewbox": f"{longitude - 0.1},{latitude + 0.1},{longitude + 0.1},{latitude - 0.1}",
                        "bounded": 1,
                        "addressdetails": 1,
                        "accept-language": "tr",
                    },
                    headers={
                        "User-Agent": "MedHub/1.0 (hasta-yonetimi-projesi)"
                    },
                    timeout=15.0
                )
                if not response.content:
                    return []
                data = response.json()
        except Exception:
            return []

        hospitals = []
        for place in data:
            name = place.get("display_name", "").split(",")[0]
            lat = float(place.get("lat", 0))
            lon = float(place.get("lon", 0))
            distance = self._haversine(latitude, longitude, lat, lon)

            if distance > radius:
                continue

            address_parts = place.get("display_name", "").split(",")
            address = ", ".join(address_parts[1:4]).strip() if len(address_parts) > 1 else "Adres bilgisi yok"

            hospitals.append({
                "place_id": str(place.get("place_id", "")),
                "name": name,
                "address": address,
                "latitude": lat,
                "longitude": lon,
                "rating": None,
                "distance": f"{int(distance)} m" if distance < 1000 else f"{distance/1000:.1f} km"
            })

        hospitals.sort(key=lambda h: float(h["distance"].replace(" km", "").replace(" m", "")))
        return hospitals[:10]