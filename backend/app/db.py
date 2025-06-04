import os
import motor.motor_asyncio

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "chatdb")

_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
_db = _client[DB_NAME]

async def get_messages_collection():
    return _db["messages"]
