import axios from 'axios';

import { API_URL, API_TIMEOUT } from '../../util/config';

// Message type used in the chat interface
export interface Message {
  id?: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp?: Date;
  image_data?: string; // Add this field to support images in messages
}

// Request type for sending messages to the API
export interface ChatRequest {
  message: string;
  conversation_id?: string;
  image_data?: string;
}

// Response type from the API
export interface ChatResponse {
  message: Message;
  conversation_id: string;
  suggestions?: string[];
}

// Google Generative AI API configuration (updated to use gemini-1.5-flash)
const GOOGLE_GENERATIVE_AI_API_KEY = 'AIzaSyAscQ82MGXs2Mkd6scBe8hj33g-LC_FlwY';
const GOOGLE_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// DeepSeek API as fallback (kept for backup)
const DEEPSEEK_API_KEY = 'sk-c015b606eae64e64af2898cbbf6fbd34';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Local storage for conversation history
const localConversations = new Map<string, Message[]>();

// Enhanced system prompt with specific context and guidelines
const SYSTEM_PROMPT = `You are the Halal Assistant for the HalalLife App, helping users verify if food products and ingredients are halal.

CRITICAL INSTRUCTIONS:
1. For food product analysis or specific ingredients verification ONLY, begin with "VERDICT: HALAL", "VERDICT: HARAM", or "VERDICT: UNKNOWN"
2. For general questions and information, do NOT use any verdict prefix
3. If HARAM, immediately list the non-halal ingredients after the verdict
4. Keep all responses concise but COMPLETE - never cut off lists or explanations mid-sentence
5. Total responses should be brief but must fully answer the user's question
6. Only discuss halal food topics. Politely refuse other topics
7. When listing items, use complete numbered lists (1., 2., 3., etc.)
8. Do NOT use markdown formatting
9. For food images, analyze visible ingredients, packaging or certification logos

Food must meet these requirements to be halal:
1. No pork or pork derivatives
2. No alcohol or intoxicants
3. Meat from animals slaughtered Islamically (if applicable)
4. No cross-contamination with non-halal items`;

// Common non-halal ingredients for reference
const NON_HALAL_INGREDIENTS = [
  'pork',
  'lard',
  'gelatin',
  'alcohol',
  'wine',
  'beer',
  'rum',
  'brandy',
  'ethanol',
  'vanilla extract',
  'carmine',
  'cochineal',
  'rennet',
  'pepsin',
  'lipase',
  'blood',
  'bacon',
  'ham',
  'pancetta',
  'prosciutto',
  'sausage',
  'l-cysteine',
  'mono-glycerides',
  'di-glycerides',
  'e120',
  'e441',
  'e542',
];

// Common halal ingredients for reference
const HALAL_INGREDIENTS = [
  'vegetables',
  'fruits',
  'grains',
  'plant-based',
  'salt',
  'honey',
  'vegetable oil',
  'olive oil',
  'sugar',
  'rice',
  'milk',
  'eggs',
  'most seafood',
  'beef',
  'chicken',
  'lamb',
];

// Questionable ingredients that need verification
const VERIFICATION_NEEDED = [
  'glycerin',
  'glycerol',
  'emulsifiers',
  'enzymes',
  'flavorings',
  'whey',
  'yogurt',
  'cheese',
  'shortening',
  'e471',
  'e472',
  'e473',
  'e475',
  'mono and diglycerides',
  'lecithin',
  'magnesium stearate',
];

// Fixing type indexing issues by adding index signatures to the ingredient objects
const haramIngredients: { [key: string]: string } = {
  alcohol: 'Contains alcohol',
  ethanol: 'Contains ethanol',
  'ethyl alcohol': 'Contains ethyl alcohol',
  wine: 'Contains wine',
  beer: 'Contains beer',
  rum: 'Contains rum',
  pork: 'Contains pork',
  bacon: 'Contains bacon',
  lard: 'Contains lard',
  gelatin: 'Contains gelatin',
  pepsin: 'Contains pepsin',
  rennet: 'Contains rennet',
  blood: 'Contains blood',
  'l-cysteine': 'Contains l-cysteine',
  carmine: 'Contains carmine',
  cochineal: 'Contains cochineal',
  e120: 'Contains E120',
};

const doubtfulIngredients: { [key: string]: string } = {
  glycerin: 'May contain glycerin',
  glycerol: 'May contain glycerol',
  glycerine: 'May contain glycerine',
  emulsifier: 'May contain emulsifier',
  enzyme: 'May contain enzyme',
  lipase: 'May contain lipase',
  'mono and diglycerides': 'May contain mono and diglycerides',
  monoglycerides: 'May contain monoglycerides',
  diglycerides: 'May contain diglycerides',
  e471: 'May contain E471',
  shortening: 'May contain shortening',
};

const halalIngredients: { [key: string]: string } = {
  'vegetable oil': 'Contains vegetable oil',
  soy: 'Contains soy',
  tofu: 'Contains tofu',
  rice: 'Contains rice',
  wheat: 'Contains wheat',
  corn: 'Contains corn',
  sugar: 'Contains sugar',
  salt: 'Contains salt',
  spices: 'Contains spices',
  vegetable: 'Contains vegetable',
  fruit: 'Contains fruit',
  water: 'Contains water',
  honey: 'Contains honey',
  preservative: 'Contains preservative',
};

// A simple utility function to check if an ingredient is halal, haram, or unknown
function checkIngredientStatus(ingredient: string): {
  status: 'halal' | 'haram' | 'doubtful' | 'unknown';
  reason: string;
} {
  // Normalize the ingredient name
  const normalizedName = ingredient.toLowerCase().trim();

  // Check if the ingredient is in any of the lists
  if (haramIngredients[normalizedName]) {
    return {
      status: 'haram',
      reason: haramIngredients[normalizedName],
    };
  }

  if (doubtfulIngredients[normalizedName]) {
    return {
      status: 'doubtful',
      reason: doubtfulIngredients[normalizedName],
    };
  }

  if (halalIngredients[normalizedName]) {
    return {
      status: 'halal',
      reason: halalIngredients[normalizedName],
    };
  }

  // Check for partial matches in case the ingredient is part of a longer name
  for (const [key, reason] of Object.entries(haramIngredients)) {
    if (normalizedName.includes(key)) {
      return {
        status: 'haram',
        reason,
      };
    }
  }

  for (const [key, reason] of Object.entries(doubtfulIngredients)) {
    if (normalizedName.includes(key)) {
      return {
        status: 'doubtful',
        reason,
      };
    }
  }

  for (const [key, reason] of Object.entries(halalIngredients)) {
    if (normalizedName.includes(key)) {
      return {
        status: 'halal',
        reason,
      };
    }
  }

  // If we couldn't identify the status
  return {
    status: 'unknown',
    reason: 'Ingredient not in our database, further research needed.',
  };
}

// Function to call Google Generative AI for image analysis (updated for gemini-1.5-flash)
const callGoogleGenerativeAI = async (imageData: string, prompt: string): Promise<string> => {
  try {
    console.log('Calling Google Generative AI API (gemini-1.5-flash) for image analysis...');

    // Clean the image data to make sure it's valid base64
    let base64Image = imageData;
    if (base64Image.includes(',')) {
      // Extract the base64 part if it's a data URL
      base64Image = base64Image.split(',')[1];
    }

    console.log('Image data length:', base64Image.length);

    const googleApi = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GOOGLE_GENERATIVE_AI_API_KEY,
      },
      timeout: 30000, // 30 seconds timeout for vision processing
    });

    // Enhanced prompt that specifically instructs the model to focus on ingredients
    const specificPrompt = `
    ${SYSTEM_PROMPT}

    You are analyzing a food product image to determine halal status. 
    
    1. Look closely at all visible ingredients listed on the product packaging
    2. Begin your response with "VERDICT: HALAL", "VERDICT: HARAM", or "VERDICT: UNKNOWN"
    3. Check for non-halal ingredients like pork, alcohol, non-halal animal derivatives
    4. Look for halal certification symbols or markings
    5. If it's clearly all plant-based ingredients with no animal products, it's likely halal
    6. Analyze both the English and Arabic text if visible
    7. If there are no clear ingredients visible or you can't determine status, use "VERDICT: UNKNOWN"
    8. NEVER include any code or programming in your response
    
    The user asked: "${prompt}"
    `;

    // Prepare the request body for Google Generative AI (gemini-1.5-flash)
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: specificPrompt,
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
      // Free-tier appropriate config
      generationConfig: {
        temperature: 0.2, // Lower temperature for more factual responses
        maxOutputTokens: 300, // Increased for more complete responses
      },
      // Add safety settings required for free tier
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    // Response handling
    const response = await googleApi.post(GOOGLE_API_URL, requestBody);

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0 &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts
    ) {
      const textContent = response.data.candidates[0].content.parts
        .filter((part: any) => part.text)
        .map((part: any) => part.text)
        .join('\n');

      return processApiResponse(textContent);
    } else {
      console.log(
        'Unexpected response format from Google API:',
        JSON.stringify(response.data).substring(0, 200) + '...'
      );
      throw new Error('Unexpected response format from Google API');
    }
  } catch (error: any) {
    console.error('Google Generative AI API error:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data).substring(0, 500));
      console.error('Response status:', error.response.status);
    }
    // Fall back to a text-only response
    return await textOnlyFallback(prompt);
  }
};

// Function to call DeepSeek API for text queries
const callDeepSeekAPI = async (
  message: string,
  conversationHistory: Message[] = []
): Promise<string> => {
  try {
    console.log('Calling DeepSeek text API...');
    const deepSeekApi = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      timeout: 15000, // 15 seconds timeout
    });

    // Format conversation history for the API
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    // Add conversation history (up to last 3 messages for context)
    conversationHistory.slice(-3).forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add the current message with appropriate context
    let userPrompt = message;

    // Check if it's an off-topic request (like coding)
    const isOffTopic =
      message.toLowerCase().includes('code') ||
      message.toLowerCase().includes('script') ||
      message.toLowerCase().includes('python') ||
      message.toLowerCase().includes('javascript') ||
      message.toLowerCase().includes('programming') ||
      message.toLowerCase().includes('function') ||
      (!message.toLowerCase().includes('halal') &&
        !message.toLowerCase().includes('food') &&
        !message.toLowerCase().includes('ingredient'));

    if (isOffTopic) {
      userPrompt =
        'The user has asked about a non-halal food topic. Please politely redirect them to ask about halal food topics only.';
    } else if (
      (message.toLowerCase().includes('analyze') && message.toLowerCase().includes('product')) ||
      (message.toLowerCase().includes('is') && message.toLowerCase().includes('halal')) ||
      (message.toLowerCase().includes('check') && message.toLowerCase().includes('ingredient')) ||
      message.toLowerCase().includes('halal status of')
    ) {
      userPrompt +=
        '\n\nThis is a product or ingredient analysis question. Start your response with VERDICT: HALAL, VERDICT: HARAM, or VERDICT: UNKNOWN depending on your analysis.';
    } else {
      userPrompt +=
        '\n\nThis is a general question about halal foods. Respond normally without using the VERDICT format.';
    }

    messages.push({
      role: 'user',
      content: userPrompt,
    });

    const response = await deepSeekApi.post(DEEPSEEK_API_URL, {
      model: 'deepseek-chat',
      messages,
      temperature: 0.4, // Lower temperature for more consistent, factual responses
      max_tokens: 150, // Limit token length to keep responses very concise
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const rawResponse = response.data.choices[0].message.content;
      return processApiResponse(rawResponse); // Process and clean the response
    } else {
      throw new Error('Unexpected response format from DeepSeek API');
    }
  } catch (error) {
    console.error('Direct DeepSeek API error:', error);
    throw error;
  }
};

// Function to call DeepSeek API with text-only (fallback if image fails)
const textOnlyFallback = async (prompt: string): Promise<string> => {
  try {
    console.log('Calling DeepSeek text API as fallback...');
    const deepSeekApi = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      timeout: 10000,
    });

    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content:
          "I couldn't analyze the image properly. For halal verification, I need to know the ingredients list. Remember to start response with VERDICT: UNKNOWN.",
      },
    ];

    const response = await deepSeekApi.post(DEEPSEEK_API_URL, {
      model: 'deepseek-chat',
      messages,
      temperature: 0.4,
      max_tokens: 150,
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const rawResponse = response.data.choices[0].message.content;
      return processApiResponse(rawResponse);
    } else {
      return "VERDICT: UNKNOWN. I couldn't analyze this image. Please share the ingredient list for halal verification.";
    }
  } catch (error) {
    console.error('Fallback API error:', error);
    return "VERDICT: UNKNOWN. I couldn't analyze this image. Please share the ingredient list for halal verification.";
  }
};

// Fix duplicate verdict issue and improve response processing
const processApiResponse = (text: string): string => {
  // Remove markdown formatting that won't render correctly
  let processed = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/```[^`]*```/g, '') // Remove code blocks
    .trim();

  // Handle off-topic responses (like coding)
  if (
    (processed.toLowerCase().includes('code') && processed.toLowerCase().includes('python')) ||
    processed.toLowerCase().includes('javascript') ||
    processed.toLowerCase().includes('function')
  ) {
    processed =
      "I'm the Halal Assistant and can only help with halal food topics. For halal food questions, feel free to ask about ingredients, certifications, or dietary guidelines!";
  }

  // Fix duplicate VERDICT issue
  processed = processed.replace(
    /VERDICT:\s*(HALAL|HARAM|UNKNOWN)VERDICT:\s*(HALAL|HARAM|UNKNOWN)/i,
    'VERDICT: $2'
  );

  // For general questions, ensure no VERDICT prefix is added
  if (!processed.includes('VERDICT:')) {
    // Only add verdict for specific product/ingredient analysis, not general information
    const isProductAnalysis =
      processed.toLowerCase().includes('this product is') ||
      processed.toLowerCase().includes('this ingredient is') ||
      (processed.toLowerCase().includes('halal status') &&
        processed.toLowerCase().includes('analysis'));

    if (isProductAnalysis) {
      const lowerText = processed.toLowerCase();
      if (
        lowerText.includes('halal') &&
        !lowerText.includes('haram') &&
        !lowerText.includes('non-halal')
      ) {
        processed = 'VERDICT: HALAL. ' + processed;
      } else if (
        lowerText.includes('haram') ||
        lowerText.includes('non-halal') ||
        lowerText.includes('forbidden')
      ) {
        processed = 'VERDICT: HARAM. ' + processed;
      } else {
        processed = 'VERDICT: UNKNOWN. ' + processed;
      }
    }
    // Otherwise, leave as is for general questions
  }

  // Don't truncate content, process full response
  return processed;
};

// Function to generate suggestions based on user message and AI response
function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  // Default suggestions
  const defaultSuggestions = [
    'What makes food halal?',
    'Common non-halal ingredients?',
    'Is gelatin halal?',
    'How to read food labels?',
  ];

  // Ingredient-specific suggestions
  if (
    userMessage.toLowerCase().includes('ingredient') ||
    aiResponse.toLowerCase().includes('ingredient') ||
    userMessage.toLowerCase().includes('halal') ||
    aiResponse.toLowerCase().includes('halal status')
  ) {
    return [
      'What are hidden non-halal ingredients?',
      'Is this E-number halal?',
      'Halal alternatives for gelatin?',
      'How to verify halal certification?',
    ];
  }

  // Product-specific suggestions
  if (
    userMessage.toLowerCase().includes('product') ||
    aiResponse.toLowerCase().includes('product') ||
    userMessage.toLowerCase().includes('food') ||
    aiResponse.toLowerCase().includes('food')
  ) {
    return [
      'Scan another product',
      'What halal certifications to look for?',
      'Is this ingredient halal?',
      'Common misconceptions about halal food',
    ];
  }

  return defaultSuggestions;
}

export const ChatAPI = {
  // Send a message to the chatbot
  sendMessage: async (request: ChatRequest, userId: string): Promise<ChatResponse> => {
    try {
      console.log('Processing chat message');

      // Get conversation history for this conversation
      const conversationId = request.conversation_id || `local-${Date.now()}`;
      let history = localConversations.get(conversationId) || [];

      // Add user message to history
      const userMessage: Message = {
        content: request.message,
        role: 'user',
        timestamp: new Date(),
        image_data: request.image_data,
      };
      history = [...history, userMessage];

      let content = '';

      // Check if the message contains extracted ingredients
      const hasExtractedIngredients =
        request.message.includes('Extracted ingredients:') ||
        request.message.includes('Analyze these ingredients for halal status:');

      // Handle different message types
      if (request.image_data && request.image_data.startsWith('data:image')) {
        // Use Google Generative AI API for image analysis
        const imagePrompt = request.message || 'Please analyze these ingredients for halal status';
        console.log('Using Google Generative AI for image analysis');
        content = await callGoogleGenerativeAI(request.image_data, imagePrompt);
      } else {
        // Regular text message without images
        const ingredientMatch = request.message.match(
          /(?:is|check|halal status of)\s+([a-zA-Z0-9\s-]+)\s+(?:halal|haram|permissible)/i
        );
        let ingredientContext = '';

        if (ingredientMatch && ingredientMatch[1]) {
          const ingredient = ingredientMatch[1].trim();
          const status = checkIngredientStatus(ingredient);
          ingredientContext = `[INGREDIENT CHECK: ${ingredient} is likely ${status.status}. ${status.reason}]`;
          console.log('Ingredient check:', ingredientContext);
        }

        // Use regular text API
        content = await callDeepSeekAPI(
          ingredientContext ? `${request.message}\n\n${ingredientContext}` : request.message,
          history
        );
      }

      const suggestions = generateSuggestions(request.message, content);

      // Create assistant message
      const assistantMessage: Message = {
        content,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Update history with the new messages
      history = [...history, assistantMessage];
      localConversations.set(conversationId, history);

      // Return formatted response
      return {
        message: assistantMessage,
        conversation_id: conversationId,
        suggestions,
      };
    } catch (error: any) {
      console.error('API Error:', error);

      // Create a fallback error response
      let errorMessage = "I need to know the ingredients to verify if it's halal.";

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Our halal verification service is busy. Please try again shortly.';
      }

      return {
        message: {
          content: errorMessage,
          role: 'assistant',
          timestamp: new Date(),
        },
        conversation_id: request.conversation_id || 'local-fallback',
        suggestions: [
          'What makes food halal?',
          'How to read food labels?',
          'Common non-halal ingredients?',
        ],
      };
    }
  },

  // Get conversation history from local storage
  getConversation: async (conversationId: string): Promise<Message[]> => {
    return localConversations.get(conversationId) || [];
  },

  // Get user conversations from local storage
  getUserConversations: async (userId: string): Promise<{ id: string; title: string }[]> => {
    // Convert local conversations to the expected format
    return Array.from(localConversations.keys()).map((id) => {
      const messages = localConversations.get(id) || [];
      const firstUserMessage = messages.find((msg) => msg.role === 'user');
      return {
        id,
        title: firstUserMessage ? firstUserMessage.content.substring(0, 30) : 'New conversation',
      };
    });
  },
};

export default ChatAPI;
