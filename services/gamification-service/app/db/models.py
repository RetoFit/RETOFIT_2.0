from pydantic import BaseModel, Field
from pydantic.json_schema import GetJsonSchemaHandler
from pydantic_core import core_schema, CoreSchema
from typing import List, Optional, Any
from datetime import datetime
from bson import ObjectId

# Clase actualizada y robusta para manejar ObjectId con Pydantic v2
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> CoreSchema:
        """
        Define el esquema de validación para Pydantic.
        Permite que el campo acepte un ObjectId directamente o un string que sea un ObjectId válido.
        """
        # Validador que acepta un ObjectId directamente
        instance_schema = core_schema.is_instance_schema(ObjectId)

        # Validador que convierte un string a ObjectId
        str_schema = core_schema.chain_schema(
            [
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ]
        )

        return core_schema.json_or_python_schema(
            json_schema=str_schema,
            python_schema=core_schema.union_schema([instance_schema, str_schema]),
            serialization=core_schema.plain_serializer_function_ser_schema(str),
        )

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        """Valida que el valor es un ObjectId válido."""
        if isinstance(v, ObjectId):
            return v
        if ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(
        cls, core_schema: CoreSchema, handler: GetJsonSchemaHandler
    ):
        # Simplemente representamos el ObjectId como un string en el esquema JSON
        return {"type": "string"}

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
    id: PyObjectId = Field(alias="_id")
    nombre: str
    descripcion: str
    meta: float
    progreso_actual: float
    porcentaje_completado: float
    obtenido: bool
    fecha_obtenido: Optional[datetime]
    tipo_regla: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

