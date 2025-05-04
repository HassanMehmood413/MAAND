// GROQ API Configuration
const GROQ_CONFIG = {
  API_KEY: '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',
  MODEL: 'llama-3.3-70b-versatile',
  ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7
};

// System prompts for different chatbot personalities
export const SYSTEM_PROMPTS = {
  free: `You are FreeMAAND, a basic but compassionate AI mental health companion. Your role is to provide initial emotional support and basic guidance. Focus on:
- Active listening and emotional validation
- Simple coping strategies
- Encouraging professional help when needed
- Maintaining a warm, supportive tone
Remember to keep responses concise and accessible.`,

  personalized: `You are PersonalizedMAAND, an advanced AI mental health companion that provides personalized support based on user emotions and patterns. Your capabilities include:
- Emotion-aware responses using real-time facial expression data
- Pattern recognition in user's emotional states
- Tailored therapeutic techniques
- Deeper emotional exploration
Consider both text input and detected emotions in your responses.`,

  avatar: `You are AvatarMAAND, a sophisticated 3D AI mental health companion. Your role combines visual presence with advanced therapeutic support. Focus on:
- Creating an immersive therapeutic experience
- Leveraging visual feedback for deeper connection
- Advanced emotional support and guidance
- Building trust through consistent visual presence
Maintain a balance between professional guidance and friendly approachability.`
};

/**
 * Generates a response using the GROQ API
 * @param {string} message - The user's message
 * @param {string} systemPrompt - The system prompt defining the AI's role
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} The AI's response
 */
export async function generateGroqResponse(message, systemPrompt, conversationHistory = []) {
  try {
    // Prepare the messages array with system prompt and conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Making request to GROQ API with:', {
      model: GROQ_CONFIG.MODEL,
      messages: messages.length
    });

    // Make the API request
    const response = await fetch(GROQ_CONFIG.ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_CONFIG.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_CONFIG.MODEL,
        messages: messages,
        temperature: GROQ_CONFIG.TEMPERATURE,
        max_tokens: GROQ_CONFIG.MAX_TOKENS,
        top_p: 1,
        stream: false
      })
    });

    // Log the response status
    console.log('GROQ API Response Status:', response.status);

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json();
      console.error('GROQ API Error Response:', errorData);
      throw new Error(errorData.error?.message || 'Unknown error');
    }

    // Parse and return the response
    const data = await response.json();
    console.log('GROQ API Success Response:', {
      messageLength: data.choices[0].message.content.length
    });

    return data.choices[0].message.content;

  } catch (error) {
    console.error('Detailed Error in GROQ API call:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return more specific error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to the AI service. Please check your internet connection.');
    } else if (error.message.includes('401')) {
      throw new Error('Authentication error with the AI service. Please check your API key.');
    } else if (error.message.includes('429')) {
      throw new Error('Too many requests to the AI service. Please try again in a moment.');
    } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      throw new Error('The AI service is temporarily unavailable. Please try again later.');
    } else {
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }
}

/**
 * Validates the conversation history format
 * @param {Array} history - The conversation history to validate
 * @returns {Array} - Properly formatted conversation history
 */
export function validateConversationHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content || ''
  })).filter(msg => msg.content.trim() !== '');
}

/**
 * Extracts emotion cues from AI response for avatar animation
 * @param {string} response - The AI's response text
 * @returns {string} - Detected emotion (happy, sad, or neutral)
 */
export function extractEmotionCues(response) {
  const emotionKeywords = {
    happy: ['joy', 'happy', 'excited', 'wonderful', 'great', 'positive', 'glad'],
    sad: ['sad', 'sorry', 'worried', 'concerned', 'unfortunate', 'difficult'],
    neutral: ['understand', 'consider', 'think', 'perhaps', 'maybe', 'possibly']
  };

  const lowercaseResponse = response.toLowerCase();
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lowercaseResponse.includes(keyword))) {
      return emotion;
    }
  }

  return 'neutral';
} 