from datetime import datetime
import uuid
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database.database import Base

class ChatSession(Base):
    """Database model for chat sessions."""
    __tablename__ = "chat_sessions"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True, nullable=True)
    name = Column(String, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    preferences = Column(JSON, default={})
    
    # Relationship with messages
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "created_at": self.created_at,
            "last_activity": self.last_activity,
            "is_active": self.is_active,
            "preferences": self.preferences,
            "message_count": len(self.messages) if self.messages else 0
        }

class ChatMessage(Base):
    """Database model for chat messages."""
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("chat_sessions.id"), index=True)
    content = Column(Text, nullable=False)
    role = Column(String, nullable=False)  # user, assistant, system
    content_type = Column(String, default="text")  # text, image
    image_url = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with session
    session = relationship("ChatSession", back_populates="messages")
    
    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "content": self.content,
            "role": self.role,
            "content_type": self.content_type,
            "image_url": self.image_url,
            "timestamp": self.timestamp
        }

class UserPreferences(Base):
    """Database model for user preferences related to the chatbot."""
    __tablename__ = "user_chat_preferences"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, unique=True, index=True)
    language = Column(String, default="en")
    response_style = Column(String, default="standard")
    enable_voice = Column(Boolean, default=False)
    enable_notifications = Column(Boolean, default=True)
    store_conversation_history = Column(Boolean, default=True)
    dietary_preferences = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "language": self.language,
            "response_style": self.response_style,
            "enable_voice": self.enable_voice,
            "enable_notifications": self.enable_notifications,
            "store_conversation_history": self.store_conversation_history,
            "dietary_preferences": self.dietary_preferences,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }