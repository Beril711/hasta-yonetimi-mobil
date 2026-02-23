from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.base_model import BaseModel
import uuid

class SymptomQuery(BaseModel):
    __tablename__ = "symptom_queries"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )
    symptom_text: Mapped[str] = mapped_column(Text, nullable=False)
    suggested_department: Mapped[str] = mapped_column(String(255), nullable=True)
    ai_response: Mapped[str] = mapped_column(Text, nullable=True)