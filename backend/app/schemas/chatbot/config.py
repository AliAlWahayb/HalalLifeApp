from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class AIServiceConfig(BaseModel):
    """Schema for AI service configuration."""
    model: str = "gpt-3.5-turbo"
    max_tokens: int = 1000
    temperature: float = 0.7
    response_style: Literal["standard", "concise", "detailed"] = "standard"
    
class UserPreference(BaseModel):
    """Schema for user preferences related to the chatbot."""
    language: str = "en"
    response_style: Literal["standard", "concise", "detailed"] = "standard"
    enable_voice: bool = False
    enable_notifications: bool = True
    store_conversation_history: bool = True
    dietary_preferences: List[str] = Field(default_factory=list)
    
class AIPromptTemplate(BaseModel):
    """Schema for AI prompt templates."""
    name: str
    description: str
    template: str
    category: str