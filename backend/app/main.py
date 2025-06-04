from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2AuthorizationCodeBearer
from pydantic import BaseModel
from typing import List
import motor.motor_asyncio
import os
import google.oauth2.id_token
import google.auth.transport.requests

from .db import get_messages_collection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

class Message(BaseModel):
    user: str
    content: str

@app.get("/messages", response_model=List[Message])
async def get_messages(collection=Depends(get_messages_collection)):
    messages = []
    async for m in collection.find():
        messages.append(Message(user=m["user"], content=m["content"]))
    return messages

@app.post("/messages")
async def post_message(msg: Message, collection=Depends(get_messages_collection)):
    await collection.insert_one(msg.dict())
    return {"status": "ok"}

@app.post("/verify")
async def verify_token(token: str):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google client id not configured")
    try:
        request = google.auth.transport.requests.Request()
        id_info = google.oauth2.id_token.verify_oauth2_token(token, request, GOOGLE_CLIENT_ID)
        return {"sub": id_info.get("sub"), "email": id_info.get("email")}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
