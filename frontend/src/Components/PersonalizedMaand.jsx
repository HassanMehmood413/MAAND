import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Smile, Frown, Meh, Brain, History, Camera, CameraOff } from 'lucide-react';
import EmotionDetector from './EmotionDetector';
import { generateGroqResponse, SYSTEM_PROMPTS, validateConversationHistory } from '../utils/groqAPI';

const PersonalizedMaand = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Welcome back! I've been learning about your patterns. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [showEmotionDetector, setShowEmotionDetector] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [moodHistory] = useState([
    { date: '2024-03-10', mood: 'happy', note: 'Felt energetic and productive' },
    { date: '2024-03-09', mood: 'neutral', note: 'Regular day' },
    { date: '2024-03-08', mood: 'sad', note: 'Struggled with anxiety' }
  ]);
  const messagesEndRef = useRef(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleEmotionDetected = (emotionData) => {
    setIsModelLoading(false);
    setDetectedEmotion(emotionData);

    // Map face-api emotions to our mood categories with enhanced mapping
    const emotionToMoodMap = {
      happy: 'happy',
      sad: 'sad',
      neutral: 'neutral',
      angry: 'sad',
      fearful: 'sad',
      disgusted: 'sad',
      surprised: 'neutral'
    };

    const detectedMood = emotionToMoodMap[emotionData.dominant] || 'neutral';

    // Only update mood if it's significantly different or if it's an intense emotion
    if (detectedMood !== currentMood || emotionData.isIntense) {
      setCurrentMood(detectedMood);

      // Generate appropriate response based on emotion intensity and combinations
      let response = '';
      if (emotionData.isIntense) {
        response = `I notice you're feeling quite ${emotionData.dominant}. Would you like to talk about what's causing these strong feelings?`;
      } else if (emotionData.secondaryEmotions.length > 0) {
        response = `I see you're feeling ${emotionData.dominant} with some ${emotionData.secondaryEmotions.join(', ')} mixed in. Would you like to explore these feelings together?`;
      } else {
        response = `I notice that you seem ${emotionData.dominant}. Would you like to talk about what's making you feel this way?`;
      }

      const moodMessage = {
        id: Date.now(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, moodMessage]);
    }
  };

  const handleModelLoadingChange = (loading) => {
    setIsModelLoading(loading);
  };

  const toggleEmotionDetector = () => {
    if (!isModelLoading) {
      setShowEmotionDetector(!showEmotionDetector);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = validateConversationHistory(messages);

      // Add emotion context if available
      let enhancedInput = input;
      if (detectedEmotion) {
        enhancedInput = `[Detected Emotion: ${detectedEmotion.dominant} (${Math.round(detectedEmotion.confidence * 100)}% confidence)] ${input}`;
      }
      if (currentMood) {
        enhancedInput = `[Current Mood: ${currentMood}] ${enhancedInput}`;
      }

      const response = await generateGroqResponse(
        enhancedInput,
        SYSTEM_PROMPTS.personalized,
        conversationHistory
      );

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: error.message || "I apologize, but I'm having trouble responding right now. Could you please try again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedResponse = (input, mood, emotion) => {
    const lowercaseInput = input.toLowerCase();

    // Enhanced response system based on emotion data
    const responses = {
      happy: {
        default: "It's wonderful to see you in good spirits! Would you like to explore ways to maintain this positive energy?",
        achievement: "Your accomplishments deserve celebration! What's been the highlight of your day?",
        gratitude: "Your positive outlook is inspiring. Let's build on this moment - what else brings you joy?",
        intense: "Your joy is contagious! Would you like to share what's bringing you such happiness today?"
      },
      sad: {
        default: "I notice you're feeling down. Remember, I'm here to support you through this. Would you like to talk about what's troubling you?",
        comfort: "It's okay to not be okay. We can work through this together. What small step could make things a bit better right now?",
        distraction: "Sometimes a change of focus can help. Would you like to try a quick mindfulness exercise with me?",
        intense: "I can see this is really affecting you. Let's take a moment to breathe together. Would you like to try a grounding exercise?"
      },
      neutral: {
        default: "How would you like to make the most of your current state of mind?",
        exploration: "This is a good time for reflection. What's been on your mind lately?",
        planning: "Would you like to explore some strategies for enhancing your well-being?",
        mixed: "I notice you might be feeling a mix of emotions. Would you like to talk about what's on your mind?"
      }
    };

    // Emotion-aware response modifiers
    if (emotion) {
      // Handle intense emotions
      if (emotion.isIntense) {
        if (emotion.dominant === 'angry') {
          return "I can sense that you're feeling quite frustrated. Let's take a moment to breathe together. Would you like to try a quick calming exercise?";
        }
        if (emotion.dominant === 'fearful') {
          return "I notice you might be feeling anxious. Remember, you're in a safe space here. Would you like to try a grounding technique?";
        }
        if (emotion.dominant === 'sad') {
          return "I can see this is really affecting you deeply. Let's take this one step at a time. Would you like to talk about what's causing these feelings?";
        }
      }

      // Handle mixed emotions
      if (emotion.secondaryEmotions.length > 0) {
        const emotionCombination = `${emotion.dominant} and ${emotion.secondaryEmotions.join(', ')}`;
        return `I notice you're feeling ${emotionCombination}. This is a complex emotional state. Would you like to explore these feelings together?`;
      }

      // Handle specific emotion combinations
      if (emotion.allEmotions.angry > 0.3 && emotion.allEmotions.sad > 0.3) {
        return "I can see you're feeling both frustrated and sad. This is a challenging combination. Would you like to talk about what's causing these feelings?";
      }
      if (emotion.allEmotions.fearful > 0.3 && emotion.allEmotions.surprised > 0.3) {
        return "You seem to be feeling both anxious and surprised. This can be overwhelming. Would you like to try a quick calming exercise?";
      }
    }

    // Determine response category based on input content
    if (lowercaseInput.includes('achieve') || lowercaseInput.includes('accomplish')) {
      return responses[mood || 'neutral'].achievement || responses[mood || 'neutral'].default;
    } else if (lowercaseInput.includes('thank') || lowercaseInput.includes('grateful')) {
      return responses[mood || 'neutral'].gratitude || responses[mood || 'neutral'].default;
    } else if (lowercaseInput.includes('help') || lowercaseInput.includes('support')) {
      return responses[mood || 'neutral'].comfort || responses[mood || 'neutral'].default;
    }

    return responses[mood || 'neutral'].default;
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    const moodMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Thank you for sharing. I'll keep in mind that you're feeling ${mood} today.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, moodMessage]);
  };

  const handleReset = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: "Welcome back! I've been learning about your patterns. How are you feeling today?",
      timestamp: new Date()
    }]);
    setCurrentMood(null);
    setDetectedEmotion(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">Personalized MAAND</h1>
          {currentMood && (
            <span className="px-3 py-1 bg-purple-600 rounded-full text-sm text-white">
              Current Mood: {currentMood}
            </span>
          )}
          {detectedEmotion && (
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm text-white">
              Detected: {detectedEmotion.dominant} ({Math.round(detectedEmotion.confidence * 100)}%)
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleEmotionDetector}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title={showEmotionDetector ? "Hide Camera" : "Show Camera"}
          >
            {showEmotionDetector ? (
              <CameraOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Camera className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <button
            onClick={() => setShowMoodHistory(!showMoodHistory)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Mood History"
          >
            <History className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              title="Close chat"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Emotion Detector */}
      {showEmotionDetector && (
        <div className="absolute top-16 right-4 z-10">
          <EmotionDetector
            onEmotionDetected={handleEmotionDetected}
            onModelLoadingChange={handleModelLoadingChange}
          />
        </div>
      )}

      {/* Mood History Sidebar */}
      {showMoodHistory && (
        <div className="absolute right-0 top-16 w-64 bg-gray-800 p-4 rounded-l-lg shadow-lg">
          <h2 className="text-white font-semibold mb-4">Mood History</h2>
          <div className="space-y-3">
            {moodHistory.map((entry, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded">
                <div className="text-white text-sm">{entry.date}</div>
                <div className="text-purple-400">{entry.mood}</div>
                <div className="text-gray-400 text-sm">{entry.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood Selection */}
      {!currentMood && !detectedEmotion && (
        <div className="bg-gray-800 p-4 flex justify-center space-x-4">
          <button
            onClick={() => handleMoodSelect('happy')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
          >
            <Smile className="w-5 h-5" />
            <span>Happy</span>
          </button>
          <button
            onClick={() => handleMoodSelect('neutral')}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 rounded-lg text-white hover:bg-yellow-700"
          >
            <Meh className="w-5 h-5" />
            <span>Neutral</span>
          </button>
          <button
            onClick={() => handleMoodSelect('sad')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
          >
            <Frown className="w-5 h-5" />
            <span>Sad</span>
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-100 rounded-bl-none'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalizedMaand;