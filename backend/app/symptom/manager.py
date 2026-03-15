import httpx
from app.database import settings

class SymptomManager:
    async def analyze(self, symptoms: str) -> dict:
        prompt = f"""Bir hastanın şikayetleri: "{symptoms}"

Lütfen aşağıdaki formatta yanıt ver:
BÖLÜM: [önerilen tıbbi bölüm adı, sadece bölüm adı]
AÇIKLAMA: [kısa açıklama, 2-3 cümle]

Sadece bu formatı kullan, başka hiçbir şey ekleme."""

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "meta-llama/llama-3.3-70b-instruct:free",
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=30.0
            )
            data = response.json()

        if "choices" not in data:
            return {
                "suggested_department": "Genel Dahiliye",
                "ai_response": str(data.get("error", "AI yanıt veremedi"))
            }

        text = data["choices"][0]["message"]["content"].strip()

        department = ""
        explanation = ""

        for line in text.split("\n"):
            if line.startswith("BÖLÜM:"):
                department = line.replace("BÖLÜM:", "").strip()
            elif line.startswith("AÇIKLAMA:"):
                explanation = line.replace("AÇIKLAMA:", "").strip()

        return {
            "suggested_department": department or "Genel Dahiliye",
            "ai_response": explanation or text
        }
