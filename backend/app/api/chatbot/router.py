"""
API routes for the chatbot feature.

This module defines the FastAPI routes for interacting with the chatbot.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, Path, Body
from sqlalchemy.orm import Session
from datetime import datetime

from app.api.deps import get_db
from app.api.chatbot.services.service import process_chat_request, get_chat_history
from app.api.chatbot.models.crud import (
    create_conversation, get_conversation, get_user_sessions,
    update_session, delete_session, clear_session_messages
)
from app.schemas.chatbot.schemas import ChatRequest, ChatResponse, ChatHistoryResponse
from app.schemas.chatbot.session import ChatSessionCreate, ChatSessionResponse, ChatSessionList, ChatSessionUpdate

router = APIRouter()

# Chat endpoints
@router.post("/chat", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    user_id: str = Query(..., description="ID of the user"),
    db: Session = Depends(get_db)
) -> ChatResponse:
    """
    Process a chat request and generate a response.
    """
    response = await process_chat_request(db, chat_request, user_id)
    return response

# Chat history endpoints
@router.get("/sessions/{conversation_id}/messages", response_model=ChatHistoryResponse)
async def get_messages(
    conversation_id: str = Path(..., description="ID of the conversation"),
    user_id: str = Query(..., description="ID of the user"),
    limit: int = Query(20, description="Maximum number of messages to retrieve"),
    before: Optional[datetime] = Query(None, description="Only retrieve messages before this timestamp"),
    db: Session = Depends(get_db)
) -> ChatHistoryResponse:
    """
    Get chat history for a conversation.
    """
    history = await get_chat_history(db, conversation_id, user_id, limit, before)
    return history

# Chat sessions endpoints
@router.post("/sessions", response_model=ChatSessionResponse)
async def create_session(
    session: ChatSessionCreate,
    db: Session = Depends(get_db)
) -> ChatSessionResponse:
    """
    Create a new chat session.
    """
    new_session = create_conversation(db, session.user_id, session.title)
    return new_session

@router.get("/sessions", response_model=ChatSessionList)
async def list_sessions(
    user_id: str = Query(..., description="ID of the user"),
    limit: int = Query(100, description="Maximum number of sessions to retrieve"),
    db: Session = Depends(get_db)
) -> ChatSessionList:
    """
    List all chat sessions for a user.
    """
    sessions = get_user_sessions(db, user_id, limit)
    return {"sessions": sessions}

@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(
    session_id: str = Path(..., description="ID of the session to retrieve"),
    db: Session = Depends(get_db)
) -> ChatSessionResponse:
    """
    Get a specific chat session.
    """
    session = get_conversation(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.put("/sessions/{session_id}", response_model=ChatSessionResponse)
async def update_session_title(
    session_id: str = Path(..., description="ID of the session to update"),
    session_update: ChatSessionUpdate = Body(...),
    db: Session = Depends(get_db)
) -> ChatSessionResponse:
    """
    Update a chat session's title.
    """
    updated_session = update_session(db, session_id, session_update.title)
    if not updated_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return updated_session

@router.delete("/sessions/{session_id}", response_model=dict)
async def delete_chat_session(
    session_id: str = Path(..., description="ID of the session to delete"),
    db: Session = Depends(get_db)
) -> dict:
    """
    Delete a chat session and all its messages.
    """
    success = delete_session(db, session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"detail": "Session deleted successfully"}

@router.delete("/sessions/{session_id}/messages", response_model=dict)
async def clear_chat_messages(
    session_id: str = Path(..., description="ID of the session to clear messages from"),
    db: Session = Depends(get_db)
) -> dict:
    """
    Clear all messages from a chat session.
    """
    session = get_conversation(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    success = clear_session_messages(db, session_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to clear messages")
        
    return {"detail": "Messages cleared successfully"}