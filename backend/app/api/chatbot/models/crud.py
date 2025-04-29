"""
CRUD operations for the chatbot module.

This file contains functions for creating, reading, updating, and deleting chatbot data.
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from datetime import datetime
import uuid

from app.api.chatbot.models.models import ChatSession, ChatMessage, UserPreference
from app.schemas.chatbot.schemas import MessageCreate, UserPreferenceCreate, UserPreferenceUpdate, ModelOption

# Sessions CRUD operations

def create_conversation(db: Session, user_id: str, title: str = "New Conversation") -> ChatSession:
    """Create a new chat session."""
    session = ChatSession(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def get_conversation(db: Session, session_id: str) -> ChatSession:
    """Get a specific chat session by ID."""
    return db.query(ChatSession).filter(ChatSession.id == session_id).first()

def get_user_sessions(db: Session, user_id: str, limit: int = 100) -> list[ChatSession]:
    """Get all chat sessions for a specific user."""
    return db.query(ChatSession)\
        .filter(ChatSession.user_id == user_id)\
        .order_by(desc(ChatSession.updated_at))\
        .limit(limit)\
        .all()

def update_session(db: Session, session_id: str, title: str = None) -> ChatSession:
    """Update a chat session."""
    session = get_conversation(db, session_id)
    if session:
        if title:
            session.title = title
        session.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(session)
    return session

def delete_session(db: Session, session_id: str) -> bool:
    """Delete a chat session and all its messages."""
    session = get_conversation(db, session_id)
    if session:
        db.delete(session)
        db.commit()
        return True
    return False

# Messages CRUD operations

def create_message(db: Session, conversation_id: str, message_data: MessageCreate) -> ChatMessage:
    """Create a new message in a chat session."""
    # Update the session's updated_at timestamp
    session = get_conversation(db, conversation_id)
    if session:
        session.updated_at = datetime.utcnow()
        
    message = ChatMessage(
        id=str(uuid.uuid4()),
        conversation_id=conversation_id,
        content=message_data.content,
        role=message_data.role,
        content_type=message_data.content_type,
        image_url=message_data.image_url,
        timestamp=datetime.utcnow()
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_messages(
    db: Session, 
    conversation_id: str, 
    limit: int = 50, 
    before_timestamp: datetime = None
) -> list[ChatMessage]:
    """Get messages for a specific chat session."""
    query = db.query(ChatMessage).filter(ChatMessage.conversation_id == conversation_id)
    
    if before_timestamp:
        query = query.filter(ChatMessage.timestamp < before_timestamp)
    
    return query.order_by(desc(ChatMessage.timestamp)).limit(limit).all()

def delete_message(db: Session, message_id: str) -> bool:
    """Delete a specific message."""
    message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if message:
        db.delete(message)
        db.commit()
        return True
    return False

def clear_session_messages(db: Session, conversation_id: str) -> bool:
    """Clear all messages from a specific chat session."""
    try:
        db.query(ChatMessage).filter(ChatMessage.conversation_id == conversation_id).delete()
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False

# User Preferences CRUD operations

def get_user_preference(db: Session, user_id: str) -> UserPreference:
    """Get user preferences, create default if doesn't exist."""
    preference = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not preference:
        # Create default preferences
        preference = UserPreference(
            id=str(uuid.uuid4()),
            user_id=user_id,
            model_option=ModelOption.STANDARD,
        )
        db.add(preference)
        db.commit()
        db.refresh(preference)
    return preference

def update_user_preference(
    db: Session, 
    user_id: str,
    model_option: str = None,
    language: str = None,
    expertise_level: str = None
) -> UserPreference:
    """Update user preferences."""
    preference = get_user_preference(db, user_id)
    
    if model_option:
        preference.model_option = model_option
    if language:
        preference.language = language
    if expertise_level:
        preference.expertise_level = expertise_level
        
    preference.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(preference)
    return preference