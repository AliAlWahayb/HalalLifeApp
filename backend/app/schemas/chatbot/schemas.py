"""
Schema definitions for the chatbot module.

This file defines the Pydantic models used for request/response validation and documentation.
"""
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

# Enums for chatbot schema
class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ContentType(str, Enum):
    TEXT = "text"
    IMAGE = "image"

class ModelOption(str, Enum):
    STANDARD = "standard"
    CONCISE = "concise"
    DETAILED = "detailed"

# Message schema classes
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

# Chat request/response classes
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    model_option: Optional[ModelOption] = None
    image_data: Optional[str] = None

class ChatResponse(BaseModel):
    message: MessageResponse
    conversation_id: str
    suggestions: List[str] = []

class ChatHistoryRequest(BaseModel):
    conversation_id: str
    limit: int = 20
    before: Optional[datetime] = None

class ChatHistoryResponse(BaseModel):
    messages: List[MessageResponse]
    conversation: Optional["ChatSessionResponse"] = None
    has_more: bool = False

# User preferences
class UserPreference(BaseModel):
    user_id: str
    model_option: ModelOption = ModelOption.STANDARD
    language: Optional[str] = None
    expertise_level: Optional[str] = None

class UserPreferenceCreate(UserPreference):
    pass

class UserPreferenceUpdate(BaseModel):
    model_option: Optional[ModelOption] = None
    language: Optional[str] = None
    expertise_level: Optional[str] = None

class UserPreferenceResponse(UserPreference):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True