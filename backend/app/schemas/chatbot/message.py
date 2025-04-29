from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.chatbot.schemas import MessageRole, ContentType

class MessageBase(BaseModel):
    content: str
    role: MessageRole
    content_type: ContentType = ContentType.TEXT
    image_url: Optional[str] = None

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: str
    conversation_id: str
    timestamp: datetime

    class Config:
        orm_mode = True