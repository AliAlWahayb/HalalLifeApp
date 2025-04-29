from typing import List, Optional, Dict
from datetime import datetime
from sqlalchemy.orm import Session

from app.api.chatbot.models.chat_models import ChatMessage, ChatSession
from app.schemas.chatbot.message import MessageCreate, MessageResponse, MessageList

class MessageService:
    """Service for managing chat messages."""
    
    @staticmethod
    def create_message(db: Session, message_data: MessageCreate) -> Optional[MessageResponse]:
        """Create a new chat message."""
        # Check if session exists
        session = db.query(ChatSession).filter(ChatSession.id == message_data.session_id).first()
        if not session:
            return None
            
        # Update session's last activity
        session.last_activity = datetime.utcnow()
        
        # Create message
        db_message = ChatMessage(
            session_id=message_data.session_id,
            content=message_data.content,
            role=message_data.role,
            content_type=message_data.content_type,
            image_url=message_data.image_url
        )
        
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        
        return MessageResponse(
            id=db_message.id,
            session_id=db_message.session_id,
            content=db_message.content,
            role=db_message.role,
            content_type=db_message.content_type,
            timestamp=db_message.timestamp,
            image_url=db_message.image_url
        )
    
    @staticmethod
    def get_session_messages(db: Session, session_id: str) -> MessageList:
        """Get all messages for a session, ordered by timestamp."""
        db_messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.timestamp).all()
        
        messages = []
        for msg in db_messages:
            messages.append(MessageResponse(
                id=msg.id,
                session_id=msg.session_id,
                content=msg.content,
                role=msg.role,
                content_type=msg.content_type,
                timestamp=msg.timestamp,
                image_url=msg.image_url
            ))
            
        return MessageList(messages=messages)
    
    @staticmethod
    def get_message(db: Session, message_id: str) -> Optional[MessageResponse]:
        """Get a message by ID."""
        db_message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
        if not db_message:
            return None
            
        return MessageResponse(
            id=db_message.id,
            session_id=db_message.session_id,
            content=db_message.content,
            role=db_message.role,
            content_type=db_message.content_type,
            timestamp=db_message.timestamp,
            image_url=db_message.image_url
        )
    
    @staticmethod
    def delete_message(db: Session, message_id: str) -> bool:
        """Delete a message."""
        db_message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
        if not db_message:
            return False
            
        db.delete(db_message)
        db.commit()
        
        return True
        
    @staticmethod
    def clear_session_messages(db: Session, session_id: str) -> bool:
        """Delete all messages for a session."""
        db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
        db.commit()
        
        return True