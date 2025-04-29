"""
AI service for chatbot module.

This module handles interactions with the AI model service (DeepSeek API).
"""
import os
import json
import logging
import httpx
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.core.config import settings
from app.api.HalalCheck.controllers.CheckIngredients import check_ingredient, get_why_response

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class AIService:
    """Service for interacting with the DeepSeek AI API."""
    
    # Use the provided API key directly
    API_KEY = "sk-c015b606eae64e64af2898cbbf6fbd34"
    API_BASE = "https://api.deepseek.com/v1"
    TEXT_MODEL = "deepseek-chat"
    VISION_MODEL = "deepseek-vision"
    
    @classmethod
    async def generate_response(cls, messages: List[Dict[str, str]], options: Dict[str, Any] = None) -> str:
        """
        Generate a response using the DeepSeek API.
        
        Args:
            messages: List of message objects with role and content
            options: Optional parameters for the API call
            
        Returns:
            The generated response text
        """
        try:
            headers = {
                "Authorization": f"Bearer {cls.API_KEY}",
                "Content-Type": "application/json"
            }
            
            # Set defaults with optimized parameters
            model = cls.TEXT_MODEL
            temperature = 0.7
            max_tokens = 800  # Reduced for faster responses
            
            # Apply options if provided
            if options:
                if options.get("model_option") == "concise":
                    temperature = 0.5
                    max_tokens = 300
                elif options.get("model_option") == "detailed":
                    temperature = 0.8
                    max_tokens = 1200  # Reduced from 2000
            
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": False  # Set to True for streaming responses if needed
            }
            
            logger.info(f"Sending request to DeepSeek API with {len(messages)} messages")
            
            # Use a shorter timeout to prevent long waits
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{cls.API_BASE}/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code != 200:
                    logger.error(f"Error from DeepSeek API: Status {response.status_code}, Response: {response.text}")
                    return "I apologize, but I encountered an issue while generating a response. Please try again later."
                
                result = response.json()
                logger.info("Received response from DeepSeek API")
                
                if "choices" in result and len(result["choices"]) > 0:
                    return result["choices"][0]["message"]["content"]
                else:
                    logger.error(f"Unexpected response format from DeepSeek API: {result}")
                    return "I apologize, but I received an unexpected response format. Please try again later."
                
        except httpx.TimeoutException as e:
            logger.exception(f"Timeout when calling DeepSeek API: {str(e)}")
            return "I apologize, but the request took too long to process. Let me provide some general information instead: Halal foods are those that are permissible according to Islamic law. They exclude pork, alcohol, and animals not slaughtered according to Islamic guidelines. Always check for halal certification or ingredient lists when in doubt."
        except Exception as e:
            logger.exception(f"Exception when calling DeepSeek API: {str(e)}")
            return "I apologize, but I encountered an error while processing your request. Please try again later."
    
    @classmethod
    async def analyze_image(cls, image_url: str) -> str:
        """
        Analyze an image using the DeepSeek Vision API.
        
        Args:
            image_url: URL or path to the image
            
        Returns:
            Analysis of the image
        """
        if not cls.API_KEY:
            logger.error("DeepSeek API key not found. Make sure DEEPSEEK_API_KEY is set in your environment.")
            return "I'm sorry, but I'm unable to analyze this image at the moment. Please try again later."
        
        try:
            headers = {
                "Authorization": f"Bearer {cls.API_KEY}",
                "Content-Type": "application/json"
            }
            
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Please analyze this image for halal-related ingredients and information."},
                        {"type": "image_url", "image_url": {"url": image_url}}
                    ]
                }
            ]
            
            payload = {
                "model": cls.VISION_MODEL,
                "messages": messages,
                "max_tokens": 1000
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{cls.API_BASE}/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code != 200:
                    logger.error(f"Error from DeepSeek Vision API: {response.text}")
                    return "I apologize, but I encountered an issue while analyzing this image. Please try again later."
                
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    return result["choices"][0]["message"]["content"]
                else:
                    logger.error(f"Unexpected response format from DeepSeek Vision API: {result}")
                    return "I apologize, but I received an unexpected response format. Please try again later."
                
        except Exception as e:
            logger.exception(f"Exception when calling DeepSeek Vision API: {str(e)}")
            return "I apologize, but I encountered an error while analyzing your image. Please try again later."
    
    @classmethod
    def check_halal_status(cls, db: Session, ingredient_name: str) -> tuple[str, bool]:
        """
        Check if an ingredient is halal.
        
        Args:
            db: Database session
            ingredient_name: Name of the ingredient to check
            
        Returns:
            Tuple of (explanation, is_halal)
        """
        # Normalize the ingredient name - remove whitespace and convert to lowercase
        ingredient_name = ingredient_name.strip().lower()
        
        # Check for E-numbers (e.g., E471)
        if ingredient_name.startswith('e') and ingredient_name[1:].isdigit():
            e_number = ingredient_name.upper()
            result = check_ingredient(db, e_number)
            explanation = get_why_response(db, e_number)
            return explanation, result == "Halal"
        
        # Regular ingredient
        result = check_ingredient(db, ingredient_name)
        explanation = get_why_response(db, ingredient_name)
        return explanation, result == "Halal"
    
    @classmethod
    async def get_product_by_barcode(cls, db: Session, barcode: str) -> Dict[str, Any]:
        """
        Get product information by barcode.
        
        Args:
            db: Database session
            barcode: The product barcode
            
        Returns:
            Dictionary containing product information
        """
        # This would normally query a product database
        # For now, we'll return a mock response
        try:
            # Here we would query the Products database by barcode
            # For demo purposes, we'll return sample data
            return {
                "name": "Sample Product",
                "brand": "Sample Brand",
                "status": "Pending Verification",
                "ingredients": ["Water", "Sugar", "E471", "Natural Flavors"]
            }
        except Exception as e:
            logger.exception(f"Error retrieving product by barcode: {str(e)}")
            return None