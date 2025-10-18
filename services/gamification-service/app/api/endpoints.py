# services/gamification-service/app/api/endpoints.py

from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime

from app.db.session import get_database
from app.db.models import ProcessActivityRequest, AchievementProgressResponse
from app.services.achievements import check_and_award_achievements

router = APIRouter()

@router.post("/process-activity")
async def process_activity(request: ProcessActivityRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Endpoint interno. Añade puntos y dispara la verificación de logros.
    """
    await db["puntos"].insert_one({
        "cantidad": request.points,
        "id_usuario": request.user_id,
        "fecha_obtencion": datetime.utcnow()
    })
    await check_and_award_achievements(db=db, user_id=request.user_id)
    return {"status": "success", "message": "Activity processed"}

# --- FUNCIÓN CORREGIDA ---
@router.get("/users/{user_id}/achievements-progress", response_model=List[AchievementProgressResponse])
async def get_user_achievements_progress(user_id: int, db: AsyncIOMotorDatabase = Depends(get_database)):
    definitions_cursor = db["logros_definiciones"].find()
    user_achievements_cursor = db["logros"].find({"id_usuario": user_id})
    
    all_definitions = await definitions_cursor.to_list(length=100)
    user_achievements = await user_achievements_cursor.to_list(length=100)
    
    obtained_map = {ach["nombre"]: ach["fecha_obtencion"] for ach in user_achievements}

    # Calcula el progreso total (distancia y conteo de actividades)
    pipeline_dist = [
        {"$match": {"id_usuario": user_id}},
        {"$group": {"_id": "$id_usuario", "total": {"$sum": "$distancia_km"}}}
    ]
    total_dist_result = await db["actividades"].aggregate(pipeline_dist).to_list(length=1)
    total_distance = total_dist_result[0]["total"] if total_dist_result else 0
    total_activities = await db["actividades"].count_documents({"id_usuario": user_id})

    progress_list = []
    for definition in all_definitions:
        current_progress = 0
        if definition["regla_tipo"] == "SUMA_DISTANCIA":
            current_progress = total_distance
        elif definition["regla_tipo"] == "CONTEO_ACTIVIDADES":
            current_progress = total_activities
        
        meta = definition["regla_valor"]
        percentage = min(100, (current_progress / meta) * 100 if meta > 0 else 0)
        is_obtained = definition["nombre"] in obtained_map

        progress_list.append({
            "id": str(definition["_id"]), # MongoDB usa _id
            "nombre": definition["nombre"],
            "descripcion": definition["descripcion"],
            "meta": meta,
            "progreso_actual": current_progress,
            "porcentaje_completado": percentage,
            "obtenido": is_obtained,
            "fecha_obtenido": obtained_map.get(definition["nombre"]),
            "tipo_regla": definition["regla_tipo"]
        })
        
    return progress_list

# --- ENDPOINT DE RANKING SIMPLIFICADO ---
@router.get("/users/ranking")
async def get_users_ranking(limit: int = 10, db: AsyncIOMotorDatabase = Depends(get_database)):
    pipeline = [
        {"$group": {"_id": "$id_usuario", "puntos_totales": {"$sum": "$cantidad"}}},
        {"$sort": {"puntos_totales": -1}},
        {"$limit": limit},
        {"$project": {"user_id": "$_id", "puntos_totales": 1, "_id": 0}}
    ]
    
    ranking_cursor = db["puntos"].aggregate(pipeline)
    ranking_data = await ranking_cursor.to_list(length=limit)

    # Nota: Este ranking ahora solo devuelve user_id. El frontend tendría que
    # buscar los nombres de usuario si fuera necesario.
    return [{"position": i + 1, **data} for i, data in enumerate(ranking_data)]


@router.post("/initialize-achievements")
async def initialize_default_achievements(db: AsyncIOMotorDatabase = Depends(get_database)):
    if await db["logros_definiciones"].count_documents({}) > 0:
        return {"message": "Las definiciones de logros ya existen"}

    default_achievements = [
        {"nombre": "Primer Paso", "descripcion": "Completa tu primera actividad", "regla_tipo": "CONTEO_ACTIVIDADES", "regla_valor": 1},
        {"nombre": "Caminante", "descripcion": "Acumula 5km", "regla_tipo": "SUMA_DISTANCIA", "regla_valor": 5.0},
    ]
    
    result = await db["logros_definiciones"].insert_many(default_achievements)
    return {"message": f"Se crearon {len(result.inserted_ids)} definiciones de logros"}