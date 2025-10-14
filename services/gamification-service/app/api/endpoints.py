import httpx
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime
from bson import ObjectId

from app.db.session import get_database
from app.db.models import (
    ProcessActivityRequest, LogroResponse, AchievementProgressResponse
)
from app.services.achievements import check_and_award_achievements

router = APIRouter()

# URL del servicio de usuarios (idealmente, debería estar en un .env)
USER_SERVICE_URL = "http://127.0.0.1:8004"


@router.post("/process-activity")
async def process_activity(request: ProcessActivityRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Endpoint interno. Añade puntos y dispara la verificación de logros.
    """
    await db["puntos"].insert_one({
        "cantidad": request.points,
        "id_usuario": request.user_id,
        "fecha_obtencion": datetime.now()
    })

    await check_and_award_achievements(db=db, user_id=request.user_id)

    return {"status": "success", "message": "Activity processed"}


@router.get("/users/{user_id}/achievements-progress", response_model=List[AchievementProgressResponse])
async def get_user_achievements_progress(user_id: int, db: AsyncIOMotorDatabase = Depends(get_database)):
    all_definitions_cursor = db["logros_definiciones"].find()
    user_achievements_cursor = db["logros"].find({"id_usuario": user_id})

    all_definitions = await all_definitions_cursor.to_list(length=100)
    user_achievements = await user_achievements_cursor.to_list(length=100)
    
    obtained_names = {ach["nombre"] for ach in user_achievements}
    
    # Simulación de datos de actividades
    total_distance = 10 
    total_activities = 5

    progress_list = []
    for definition in all_definitions:
        current_progress = 0
        if definition["regla_tipo"] == "SUMA_DISTANCIA":
            current_progress = total_distance
        elif definition["regla_tipo"] == "CONTEO_ACTIVIDADES":
            current_progress = total_activities
        
        percentage = min(100, (current_progress / definition["regla_valor"]) * 100) if definition["regla_valor"] > 0 else 0
        is_obtained = definition["nombre"] in obtained_names
        
        obtained_date = None
        if is_obtained:
            for ua in user_achievements:
                if ua["nombre"] == definition["nombre"]:
                    obtained_date = ua["fecha_obtencion"]
                    break

        # La línea problemática ha sido eliminada.
        # Ya no hacemos: definition["_id"] = str(definition["_id"])

        progress_list.append({
            "_id": definition["_id"], # Pasamos el ObjectId directamente
            "nombre": definition["nombre"], "descripcion": definition["descripcion"],
            "meta": definition["regla_valor"], "progreso_actual": current_progress,
            "porcentaje_completado": percentage, "obtenido": is_obtained,
            "fecha_obtenido": obtained_date, "tipo_regla": definition["regla_tipo"]
        })
    return progress_list


@router.get("/users/ranking")
async def get_users_ranking(limit: int = 10, db: AsyncIOMotorDatabase = Depends(get_database)):
    pipeline = [
        {"$group": {"_id": "$id_usuario", "puntos_totales": {"$sum": "$cantidad"}}},
        {"$sort": {"puntos_totales": -1}},
        {"$limit": limit}
    ]
    ranking_cursor = db["puntos"].aggregate(pipeline)
    ranking_data = await ranking_cursor.to_list(length=limit)

    user_ids = [user["_id"] for user in ranking_data]
    user_info = {}

    try:
        async with httpx.AsyncClient() as client:
            for user_id in user_ids:
                response = await client.get(f"{USER_SERVICE_URL}/users/profile/{user_id}")
                if response.status_code == 200:
                    user_info[user_id] = response.json().get("username", f"User_{user_id}")
    except httpx.RequestError as e:
        print(f"No se pudo conectar con user-service: {e}")
        for user_id in user_ids:
            user_info[user_id] = f"User_{user_id}"

    final_ranking = [
        {"position": i + 1, "id": user["_id"], "username": user_info.get(user["_id"], f"User_{user['_id']}"), "puntos_totales": user["puntos_totales"]}
        for i, user in enumerate(ranking_data)
    ]
    return final_ranking


@router.post("/initialize-achievements")
async def initialize_default_achievements(db: AsyncIOMotorDatabase = Depends(get_database)):
    count = await db["logros_definiciones"].count_documents({})
    if count > 0:
        raise HTTPException(status_code=400, detail="Las definiciones de logros ya existen")
    
    default_achievements = [
        {"nombre": "Primer Paso", "descripcion": "Completa tu primera actividad", "regla_tipo": "CONTEO_ACTIVIDADES", "regla_valor": 1},
        {"nombre": "Caminante", "descripcion": "Acumula 5km", "regla_tipo": "SUMA_DISTANCIA", "regla_valor": 5.0},
    ]
    
    await db["logros_definiciones"].insert_many(default_achievements)
    return {"message": f"Se crearon {len(default_achievements)} definiciones de logros"}
