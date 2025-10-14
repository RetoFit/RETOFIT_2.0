import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pymongo.uri_parser import parse_uri

load_dotenv()

MONGO_DATABASE_URL = os.getenv('MONGO_DATABASE_URL')

# Extraer el nombre de la base de datos de la URL
try:
    parsed_uri = parse_uri(MONGO_DATABASE_URL)
    MONGO_DB_NAME = parsed_uri['database']
    if not MONGO_DB_NAME:
        raise ValueError
except Exception:
    raise ValueError("La URL de MongoDB debe incluir un nombre de base de datos (ej. .../miBaseDeDatos)")


class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

async def get_database():
    # Usamos el nombre de la base de datos extraído
    return db.client[MONGO_DB_NAME]

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(MONGO_DATABASE_URL)

async def close_mongo_connection():
    db.client.close()