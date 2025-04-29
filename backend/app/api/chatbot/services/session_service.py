from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from sqlalchemy.orm import Session

from app.api.chatbot.models.chat_models import ChatSession, ChatMessage, UserPreferences
from app.schemas.chatbot.message import MessageCreate, MessageResponse
from app.schemas.chatbot.session import ChatSessionCreate, ChatSessionUpdate, ChatSessionResponse

class ChatSessionService:
    """Service for managing chat sessions."""
    
    @staticmethod
    def create_session(db: Session, session_data: ChatSessionCreate) -> ChatSessionResponse:
        """Create a new chat session."""
        db_session = ChatSession(
            user_id=session_data.user_id,
            name=session_data.name,
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        return ChatSessionResponse(
            id=db_session.id,
            user_id=db_session.user_id,
            name=db_session.name,
            created_at=db_session.created_at,
            last_activity=db_session.last_activity,
            is_active=db_session.is_active,
            message_count=0,
            preferences=db_session.preferences
        )
    
    @staticmethod
    def get_session(db: Session, session_id: str) -> Optional[ChatSessionResponse]:
        """Get a chat session by ID."""
        db_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not db_session:
            return None
            
        message_count = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).count()
        
        return ChatSessionResponse(
            id=db_session.id,
            user_id=db_session.user_id,
            name=db_session.name,
            created_at=db_session.created_at,
            last_activity=db_session.last_activity,
            is_active=db_session.is_active,
            message_count=message_count,
            preferences=db_session.preferences
        )
    
    @staticmethod
    def get_user_sessions(db: Session, user_id: str) -> List[ChatSessionResponse]:
        """Get all chat sessions for a user."""
        db_sessions = db.query(ChatSession).filter(ChatSession.user_id == user_id).all()
        
        result = []
        for session in db_sessions:
            message_count = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).count()
            
            result.append(ChatSessionResponse(
                id=session.id,
                user_id=session.user_id,
                name=session.name,
                created_at=session.created_at,
                last_activity=session.last_activity,
                is_active=session.is_active,
                message_count=message_count,
                preferences=session.preferences
            ))
            
        return result
    
    @staticmethod
    def update_session(db: Session, session_id: str, session_update: ChatSessionUpdate) -> Optional[ChatSessionResponse]:
        """Update a chat session."""
        db_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not db_session:
            return None
            
        # Update fields if provided
        if session_update.name is not None:
            db_session.name = session_update.name
        if session_update.is_active is not None:
            db_session.is_active = session_update.is_active
        if session_update.preferences is not None:
            db_session.preferences = session_update.preferences
            
        db.commit()
        db.refresh(db_session)
        
        message_count = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).count()
        
        return ChatSessionResponse(
            id=db_session.id,
            user_id=db_session.user_id,
            name=db_session.name,
            created_at=db_session.created_at,
            last_activity=db_session.last_activity,
            is_active=db_session.is_active,
            message_count=message_count,
            preferences=db_session.preferences
        )
    
    @staticmethod
    def delete_session(db: Session, session_id: str) -> bool:
        """Delete a chat session."""
        db_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not db_session:
            return False
            
        db.delete(db_session)
        db.commit()
        
        return True