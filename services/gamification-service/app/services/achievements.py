# services/gamification-service/app/services/achievements.py
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

async def check_and_award_achievements(db: AsyncIOMotorDatabase, user_id: int):
    """
    Verifica y otorga logros a un usuario basado en su progreso total.
    """
    definitions_cursor = db["logros_definiciones"].find()
    definitions = await definitions_cursor.to_list(length=100)
    
    user_achievements_cursor = db["logros"].find({"id_usuario": user_id})
    user_achievements = await user_achievements_cursor.to_list(length=100)
    achieved_names = {logro["nombre"] for logro in user_achievements}

    for definition in definitions:
        if definition["nombre"] in achieved_names:
            continue

        achievement_earned = False
        
        if definition["regla_tipo"] == "SUMA_DISTANCIA":
            pipeline = [
                {"$match": {"id_usuario": user_id}},
                {"$group": {"_id": "$id_usuario", "total": {"$sum": "$distancia_km"}}}
            ]
            result = await db["actividades"].aggregate(pipeline).to_list(length=1)
            total_distance = result[0]["total"] if result else 0
            if total_distance >= definition["regla_valor"]:
                achievement_earned = True

        elif definition["regla_tipo"] == "CONTEO_ACTIVIDADES":
            total_activities = await db["actividades"].count_documents({"id_usuario": user_id})
            if total_activities >= definition["regla_valor"]:
                achievement_earned = True
        
        if achievement_earned:
            await db["logros"].insert_one({
                "nombre": definition["nombre"],
                "descripcion": definition["descripcion"],
                "id_usuario": user_id,
                "fecha_obtencion": datetime.utcnow()
            })