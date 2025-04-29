from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# Chat session schemas
class ChatSessionBase(BaseModel):
    title: Optional[str] = "New Conversation"
    user_id: str

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionUpdate(BaseModel):
    title: Optional[str] = None

class ChatSessionResponse(ChatSessionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ChatSessionList(BaseModel):
    sessions: List[ChatSessionResponse]