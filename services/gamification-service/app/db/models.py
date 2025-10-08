# app/db/models.py

from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .session import Base
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Modelos mínimos para mantener las relaciones y poder hacer consultas
class User(Base):
    __tablename__ = 'usuario'
    id_usuario = Column(Integer, primary_key=True)
    nombre = Column(String)
    puntos = relationship("Puntos", back_populates="propietario")
    logros = relationship("Logro", back_populates="propietario")
    actividades = relationship("Actividad", back_populates="propietario")

class Actividad(Base):
    __tablename__ = 'actividades'
    id_actividad = Column(Integer, primary_key=True)
    distancia_km = Column(Float, nullable=True)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)
    propietario = relationship("User", back_populates="actividades")

# Modelos principales de este servicio
class Puntos(Base):
    __tablename__ = 'puntos'
    id_puntos = Column(Integer, primary_key=True)
    cantidad = Column(Integer, nullable=False)
    fecha_obtencion = Column(DateTime(timezone=True), server_default=func.now())
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)
    propietario = relationship("User", back_populates="puntos")

class Logro(Base):
    __tablename__ = 'logros'
    id_logro = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    fecha_obtencion = Column(DateTime(timezone=True), server_default=func.now())
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)
    propietario = relationship("User", back_populates="logros")

class LogroDefinicion(Base):
    __tablename__ = 'logros_definiciones'
    id_definicion = Column(Integer, primary_key=True)
    nombre = Column(String, unique=True, nullable=False)
    descripcion = Column(String, nullable=False)
    regla_tipo = Column(String, nullable=False)
    regla_valor = Column(Float, nullable=False)

# --- Schemas de Pydantic ---

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
    id: int
    nombre: str
    descripcion: str
    meta: float
    progreso_actual: float
    porcentaje_completado: float
    obtenido: bool
    fecha_obtenido: Optional[datetime]
    tipo_regla: str