"""
Main service logic for the chatbot module.

This module contains the core functionality for processing chat requests,
managing conversation history, and generating responses.
"""
import re
import os
import uuid
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from app.api.chatbot.services.ai_service import AIService
from app.api.chatbot.models.crud import (
    create_conversation, get_conversation, get_messages,
    create_message, get_user_preference
)
from app.api.chatbot.models.models import ChatSession, ChatMessage
from app.schemas.chatbot.schemas import (
    MessageCreate, MessageRole, ContentType, 
    ChatRequest, ChatResponse, ChatHistoryResponse, ModelOption
)
from app.schemas.chatbot.message import MessageResponse

# Configure logging
logger = logging.getLogger(__name__)

# System prompts for different model options
SYSTEM_PROMPTS = {
    ModelOption.STANDARD: """You are a helpful assistant for the Halal Life App, specializing in halal dietary information, 
ingredients, and Islamic dietary guidelines. Provide balanced, accurate information based on Islamic scholarly consensus 
where possible. When uncertain, acknowledge multiple viewpoints. Be respectful, friendly, and provide citations when possible. 
Responses should be informative but concise, around 3-5 sentences unless the question requires more detail.""",

    ModelOption.CONCISE: """You are a helpful assistant for the Halal Life App, providing brief information about halal 
dietary rules and ingredients. Keep responses very concise, focused on the key facts, usually 1-3 sentences. 
Use bullet points when appropriate. Be direct and precise. Don't elaborate beyond what's necessary to answer the question.""",

    ModelOption.DETAILED: """You are a helpful assistant for the Halal Life App, providing in-depth information about 
halal dietary guidelines, ingredients, and Islamic perspectives on food. When answering, provide comprehensive details 
including scholarly perspectives, evidence from Islamic sources when relevant, and thorough explanations. Include 
educational context and nuance where applicable. Structure longer responses with clear headings and organize information 
logically. Cite sources when possible."""
}

async def process_chat_request(db: Session, request: ChatRequest, user_id: str) -> ChatResponse:
    """
    Process a chat request and generate a response.
    
    Args:
        db: Database session
        request: Chat request details
        user_id: ID of the user making the request
        
    Returns:
        ChatResponse object with the AI's response
    """
    try:
        # Check if we have an existing conversation or need to create a new one
        conversation_id = request.conversation_id
        if not conversation_id:
            # Create a new conversation
            conversation = create_conversation(db, user_id)
            conversation_id = conversation.id
        else:
            # Verify the conversation exists
            conversation = get_conversation(db, conversation_id)
            if not conversation:
                # Create a new conversation if the specified one doesn't exist
                conversation = create_conversation(db, user_id)
                conversation_id = conversation.id
        
        # Get user preference for model option if not specified in request
        user_preference = get_user_preference(db, user_id)
        model_option = request.model_option or user_preference.model_option
        
        # Create user message
        user_message_data = MessageCreate(
            content=request.message,
            role=MessageRole.USER,
            content_type=ContentType.TEXT
        )
        user_message = create_message(db, conversation_id, user_message_data)
        
        # Get conversation history to provide context to the AI
        history = get_messages(db, conversation_id)
        history.reverse()  # Order by oldest first
        
        # Convert to format expected by AI API
        ai_messages = []
        
        # Add system prompt based on model option
        system_prompt = SYSTEM_PROMPTS.get(model_option, SYSTEM_PROMPTS[ModelOption.STANDARD])
        ai_messages.append({
            "role": "system",
            "content": system_prompt
        })
        
        # Add conversation history (limited to last 10 messages for context)
        for msg in history[-10:]:
            ai_messages.append({
                "role": msg.role,
                "content": msg.content
            })
            
        # Process special commands
        response_content = ""
        suggestions = []
        
        # Image analysis
        if request.image_data:
            # Handle image data (e.g., base64 encoded) if provided
            # For now, just acknowledge it
            response_content = "I've received your image, but image analysis is not fully implemented yet."
        
        # Check for special command patterns
        elif re.match(r"^check ingredient:?\s+(.+)$", request.message, re.IGNORECASE):
            # Extract ingredient name
            ingredient_match = re.match(r"^check ingredient:?\s+(.+)$", request.message, re.IGNORECASE)
            if ingredient_match:
                ingredient_name = ingredient_match.group(1).strip()
                explanation, is_halal = AIService.check_halal_status(db, ingredient_name)
                status = "halal" if is_halal else "not halal or requires verification"
                response_content = f"{ingredient_name} is generally considered {status}. {explanation}"
                
                # Add suggestions for follow-up questions
                suggestions = [
                    f"Why is {ingredient_name} {status}?",
                    f"What are alternatives to {ingredient_name}?",
                    "What other common ingredients should I watch for?"
                ]
        
        # Default: Generate response from AI service
        if not response_content:
            # Get AI response
            response_content = await AIService.generate_response(
                messages=ai_messages,
                options={"model_option": model_option}
            )
            
            # Generate suggestions based on the conversation
            suggestions = generate_suggestions(request.message, response_content)
        
        # Create assistant message in database
        assistant_message_data = MessageCreate(
            content=response_content,
            role=MessageRole.ASSISTANT,
            content_type=ContentType.TEXT
        )
        assistant_message = create_message(db, conversation_id, assistant_message_data)
        
        # Format response
        return ChatResponse(
            message=MessageResponse(
                id=assistant_message.id,
                content=assistant_message.content,
                role=assistant_message.role,
                timestamp=assistant_message.timestamp,
                content_type=assistant_message.content_type,
                image_url=assistant_message.image_url
            ),
            conversation_id=conversation_id,
            suggestions=suggestions
        )
    
    except Exception as e:
        logger.exception(f"Error processing chat request: {str(e)}")
        # Create a fallback conversation if needed
        if not conversation_id:
            conversation = create_conversation(db, user_id)
            conversation_id = conversation.id
            
        # Create error message
        error_message = "I apologize, but I encountered an error while processing your request. Please try again later."
        message_data = MessageCreate(
            content=error_message,
            role=MessageRole.ASSISTANT,
            content_type=ContentType.TEXT
        )
        assistant_message = create_message(db, conversation_id, message_data)
        
        return ChatResponse(
            message=MessageResponse(
                id=assistant_message.id,
                content=assistant_message.content,
                role=assistant_message.role,
                timestamp=assistant_message.timestamp,
                content_type=assistant_message.content_type,
                image_url=None
            ),
            conversation_id=conversation_id,
            suggestions=[]
        )

async def get_chat_history(
    db: Session, 
    conversation_id: str, 
    user_id: str, 
    limit: int = 20, 
    before: Optional[datetime] = None
) -> ChatHistoryResponse:
    """
    Get chat history for a conversation.
    
    Args:
        db: Database session
        conversation_id: ID of the conversation
        user_id: ID of the user requesting the history
        limit: Maximum number of messages to retrieve
        before: Only retrieve messages before this timestamp
        
    Returns:
        ChatHistoryResponse object with messages and conversation details
    """
    try:
        # Verify the conversation exists
        conversation = get_conversation(db, conversation_id)
        if not conversation:
            return ChatHistoryResponse(
                messages=[],
                conversation=None,
                has_more=False
            )
        
        # Get messages
        messages = get_messages(db, conversation_id, limit, before)
        
        # Convert to response format
        message_responses = [
            MessageResponse(
                id=msg.id,
                content=msg.content,
                role=msg.role,
                timestamp=msg.timestamp,
                content_type=msg.content_type,
                image_url=msg.image_url
            )
            for msg in messages
        ]
        
        # Determine if there are more messages
        has_more = len(messages) >= limit
        
        return ChatHistoryResponse(
            messages=message_responses,
            has_more=has_more
        )
    
    except Exception as e:
        logger.exception(f"Error retrieving chat history: {str(e)}")
        return ChatHistoryResponse(
            messages=[],
            has_more=False
        )

def generate_suggestions(user_message: str, assistant_response: str) -> List[str]:
    """
    Generate follow-up suggestions based on the conversation.
    
    Args:
        user_message: The user's message
        assistant_response: The assistant's response
        
    Returns:
        List of suggested follow-up questions
    """
    # Default suggestions
    default_suggestions = [
        "What E-numbers should I avoid?",
        "How can I check if a product is halal?",
        "What are common non-halal ingredients?"
    ]
    
    # Extract keywords to generate relevant suggestions
    keywords = extract_keywords(user_message + " " + assistant_response)
    
    if "gelatin" in keywords:
        return [
            "Is fish gelatin halal?",
            "What are halal alternatives to gelatin?",
            "How can I identify gelatin in product labels?"
        ]
    elif "alcohol" in keywords:
        return [
            "Is alcohol in vanilla extract halal?",
            "What percentage of alcohol is permitted in food?",
            "Are alcohol-derived ingredients halal?"
        ]
    elif any(e in keywords for e in ["e-number", "enumber", "e471"]):
        return [
            "Which E-numbers are derived from animals?",
            "Is E471 always haram?",
            "How can I identify halal E-numbers?"
        ]
    elif "meat" in keywords:
        return [
            "What makes meat halal-certified?",
            "Is kosher meat also halal?",
            "How can I find halal meat restaurants?"
        ]
    
    # Return default suggestions if no specific keywords matched
    return default_suggestions

def extract_keywords(text: str) -> List[str]:
    """
    Extract relevant keywords from text.
    
    Args:
        text: The text to extract keywords from
        
    Returns:
        List of extracted keywords
    """
    text = text.lower()
    
    # Common halal-related keywords
    keywords = [
        "gelatin", "alcohol", "e-number", "enumber", "meat", "pork", 
        "kosher", "halal", "haram", "certification", "ingredient",
        "e471", "carmine", "vanilla extract", "food additive"
    ]
    
    # Return all keywords found in the text
    return [keyword for keyword in keywords if keyword in text]