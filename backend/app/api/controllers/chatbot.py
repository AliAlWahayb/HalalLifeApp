from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

from app.database.database import get_session
from app.api.chatbot.services.service import (
    process_chat_request, 
    get_chat_history
)
from app.api.chatbot.services.session_service import ChatSessionService
from app.api.chatbot.services.message_service import MessageService
from app.schemas.chatbot.schemas import (
    ChatRequest, 
    ChatResponse, 
    ChatHistoryRequest, 
    ChatHistoryResponse,
    ModelOption
)
from app.schemas.chatbot.session import (
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatSessionResponse,
    ChatSessionList
)

router = APIRouter()

# Session endpoints
@router.post("/sessions", response_model=ChatSessionResponse)
async def create_session(
    session_data: ChatSessionCreate,
    db: Session = Depends(get_session)
):
    """Create a new chat session."""
    # For now, use a placeholder user ID if none is provided
    if not session_data.user_id:
        session_data.user_id = "anonymous-user"
    return ChatSessionService.create_session(db, session_data)


@router.get("/sessions", response_model=ChatSessionList)
async def get_sessions(
    user_id: str = Query("anonymous-user", description="User ID to filter sessions"),
    db: Session = Depends(get_session)
):
    """Get all chat sessions for a user."""
    sessions = ChatSessionService.get_user_sessions(db, user_id)
    return ChatSessionList(sessions=sessions)


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(
    session_id: str,
    db: Session = Depends(get_session)
):
    """Get a specific chat session."""
    session = ChatSessionService.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return session


@router.put("/sessions/{session_id}", response_model=ChatSessionResponse)
async def update_session(
    session_id: str,
    update_data: ChatSessionUpdate,
    db: Session = Depends(get_session)
):
    """Update a chat session."""
    session = ChatSessionService.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    updated_session = ChatSessionService.update_session(db, session_id, update_data)
    if not updated_session:
        raise HTTPException(status_code=500, detail="Failed to update session")
    
    return updated_session


@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: str,
    db: Session = Depends(get_session)
):
    """Delete a chat session."""
    session = ChatSessionService.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    success = ChatSessionService.delete_session(db, session_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete session")


# Message endpoints
@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_session),
    user_id: str = Query("anonymous-user", description="User ID for the chat")
):
    """Process a chat message and return a response."""
    response = await process_chat_request(db, request, user_id)
    return ChatResponse(**response)


@router.get("/sessions/{session_id}/messages")
async def get_messages(
    session_id: str,
    limit: int = Query(20, gt=0, le=100),
    before: Optional[datetime] = None,
    user_id: str = Query("anonymous-user", description="User ID for the chat"),
    db: Session = Depends(get_session)
):
    """Get messages from a chat session."""
    session = ChatSessionService.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    chat_history = await get_chat_history(
        db, 
        session_id, 
        user_id,
        limit,
        before
    )
    
    return chat_history


@router.delete("/sessions/{session_id}/messages", status_code=204)
async def clear_messages(
    session_id: str,
    db: Session = Depends(get_session)
):
    """Clear all messages from a chat session."""
    session = ChatSessionService.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    success = MessageService.clear_session_messages(db, session_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to clear messages")