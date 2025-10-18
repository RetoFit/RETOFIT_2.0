# services/gamification-service/app/db/models.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Schemas de Pydantic (ahora son nuestros modelos principales) ---

class ProcessActivityRequest(BaseModel):
    user_id: int
    points: int

class LogroResponse(BaseModel):
    nombre: str
    descripcion: Optional[str]
    fecha_obtencion: datetime

    class Config:
        from_attributes = True

class AchievementProgressResponse(BaseModel):
    id: str
    nombre: str
    descripcion: str
    meta: float
    progreso_actual: float
    porcentaje_completado: float
    obtenido: bool
    fecha_obtenido: Optional[datetime]
    tipo_regla: str