from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.symptom.router import router as symptom_router

app = FastAPI(
    title="Hasta Yönetimi API",
    description="Hasta yönetim sistemi backend API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(symptom_router)

@app.get("/")
async def root():
    return {"message": "Hasta Yönetimi API çalışıyor 🚀"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}