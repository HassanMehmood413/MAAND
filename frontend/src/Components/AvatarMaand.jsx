import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { generateGroqResponse, SYSTEM_PROMPTS, validateConversationHistory, extractEmotionCues } from '../utils/groqAPI';

// Enhanced avatar styles with Bitmoji-like appearance
const styles = {
  avatar: {
    width: '300px',
    height: '400px',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  head: {
    width: '160px',
    height: '190px',
    position: 'relative',
    margin: '0 auto',
    transition: 'all 0.3s ease',
  },
  face: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFE4B5',
    borderRadius: '80px 80px 70px 70px',
    position: 'relative',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  hair: {
    position: 'absolute',
    top: '-25px',
    left: '0',
    right: '0',
    height: '60px',
    backgroundColor: '#2C3E50',
    borderRadius: '80px 80px 0 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  eyes: {
    width: '32px',
    height: '36px',
    position: 'absolute',
    top: '70px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  pupil: {
    width: '14px',
    height: '14px',
    backgroundColor: '#1a1a1a',
    borderRadius: '50%',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  eyeHighlight: {
    width: '7px',
    height: '7px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    right: '2px',
  },
  eyebrow: {
    width: '36px',
    height: '8px',
    position: 'absolute',
    top: '-15px',
    backgroundColor: '#2C3E50',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  mouth: {
    position: 'absolute',
    bottom: '45px',
    left: '50%',
    transform: 'translateX(-50%)',
    transition: 'all 0.3s ease',
  },
  body: {
    width: '180px',
    height: '200px',
    backgroundColor: '#3498DB',
    borderRadius: '45px 45px 35px 35px',
    position: 'relative',
    margin: '-25px auto 0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  arm: {
    width: '45px',
    height: '130px',
    backgroundColor: '#3498DB',
    position: 'absolute',
    top: '25px',
    borderRadius: '25px',
    transition: 'all 0.5s ease',
  },
  hand: {
    width: '50px',
    height: '50px',
    backgroundColor: '#FFE4B5',
    position: 'absolute',
    bottom: '-12px',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  blush: {
    width: '30px',
    height: '12px',
    backgroundColor: '#FFB6C1',
    borderRadius: '50%',
    position: 'absolute',
    top: '95px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  }
};

// Enhanced expressions with more dynamic animations
const expressions = {
  happy: {
    eyes: {
      transform: 'scaleY(0.6)',
    },
    pupils: {
      transform: 'scale(1.2)',
    },
    eyebrows: {
      transform: 'rotate(-15deg) translateY(-4px)',
    },
    mouth: (
      <svg width="70" height="35" viewBox="0 0 70 35">
        <path
          d="M10,15 Q35,35 60,15"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
    arms: {
      transform: 'rotate(-25deg) translateY(-15px)',
    },
    blush: {
      opacity: 0.6,
    }
  },
  sad: {
    eyes: {
      transform: 'scaleY(1.3)',
    },
    pupils: {
      transform: 'scale(0.8) translateY(3px)',
    },
    eyebrows: {
      transform: 'rotate(20deg) translateY(3px)',
    },
    mouth: (
      <svg width="70" height="35" viewBox="0 0 70 35">
        <path
          d="M15,15 Q35,5 55,15"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
    arms: {
      transform: 'rotate(15deg) translateY(8px)',
    }
  },
  neutral: {
    eyes: {},
    pupils: {},
    eyebrows: {},
    mouth: (
      <svg width="70" height="35" viewBox="0 0 70 35">
        <path
          d="M15,15 L55,15"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
    arms: {}
  },
  thinking: {
    eyes: {
      transform: 'scaleY(0.8)',
    },
    pupils: {
      transform: 'translateX(4px) translateY(-3px)',
    },
    eyebrows: {
      transform: 'rotate(-8deg) translateY(-6px)',
    },
    mouth: (
      <svg width="70" height="35" viewBox="0 0 70 35">
        <path
          d="M15,15 Q35,15 55,18"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
    arms: {
      transform: 'rotate(-50deg) translateY(-25px)',
    }
  },
  excited: {
    eyes: {
      transform: 'scaleY(1.2) translateY(-3px)',
    },
    pupils: {
      transform: 'scale(1.3)',
    },
    eyebrows: {
      transform: 'rotate(-20deg) translateY(-8px)',
    },
    mouth: (
      <svg width="70" height="35" viewBox="0 0 70 35">
        <path
          d="M10,15 Q35,35 60,15"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
    arms: {
      transform: 'rotate(-35deg) translateY(-20px)',
    },
    blush: {
      opacity: 0.8,
    }
  },
  speaking: {
    mouth: (
      <svg width="70" height="35" viewBox="0 0 70 35">
        <path
          d="M15,15 Q35,25 55,15"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
    arms: {
      transform: 'rotate(-15deg) translateY(-10px)',
    }
  }
};

const Avatar = ({ expression, speaking }) => {
  const expr = expressions[expression] || expressions.neutral;
  const speakingExpr = speaking ? expressions.speaking : {};
  
  return (
    <div style={styles.avatar} className="avatar-container">
      <div style={styles.head} className="head">
        <div style={styles.face} className="face">
          <div style={styles.hair} className="hair" />
          
          {/* Left eye group */}
          <div style={{...styles.eyes, left: '30px', ...expr.eyes}} className="eye left">
            <div style={{...styles.eyebrow, ...expr.eyebrows}} className="eyebrow" />
            <div style={{...styles.pupil, ...expr.pupils}} className="pupil">
              <div style={styles.eyeHighlight} className="eye-highlight" />
            </div>
          </div>
          
          {/* Right eye group */}
          <div style={{...styles.eyes, right: '30px', ...expr.eyes}} className="eye right">
            <div style={{...styles.eyebrow, ...expr.eyebrows}} className="eyebrow" />
            <div style={{...styles.pupil, ...expr.pupils}} className="pupil">
              <div style={styles.eyeHighlight} className="eye-highlight" />
            </div>
          </div>
          
          {/* Blush */}
          <div style={{...styles.blush, left: '25px', ...expr.blush}} className="blush left" />
          <div style={{...styles.blush, right: '25px', ...expr.blush}} className="blush right" />
          
          {/* Mouth */}
          <div style={styles.mouth} className="mouth">
            {speaking ? speakingExpr.mouth : expr.mouth}
          </div>
        </div>
      </div>
      
      <div style={styles.body} className="body">
        {/* Left arm group */}
        <div style={{...styles.arm, left: '-35px', ...expr.arms, ...speakingExpr.arms}} className="arm left">
          <div style={styles.hand} className="hand" />
        </div>
        
        {/* Right arm group */}
        <div 
          style={{
            ...styles.arm,
            right: '-35px',
            transform: speakingExpr.arms?.transform || expr.arms?.transform 
              ? (speakingExpr.arms?.transform || expr.arms?.transform).replace('rotate(', 'rotate(')
              : 'none'
          }}
          className="arm right"
        >
          <div style={styles.hand} className="hand" />
        </div>
      </div>
      
      {/* Speaking indicator */}
      {speaking && (
        <div className="speaking-indicator absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[#00FFB2] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#00FFB2] rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-[#00FFB2] rounded-full animate-bounce delay-200" />
          </div>
        </div>
      )}
    </div>
  );
};

const AvatarMaand = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your MAAND Avatar companion. I'm here to support you with enhanced visual interaction.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [currentGesture, setCurrentGesture] = useState('default');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const speechSynthesis = window.speechSynthesis;
  const currentUtteranceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup function to stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const stopCurrentSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      if (currentUtteranceRef.current) {
        currentUtteranceRef.current = null;
      }
    }
  };

  const speakText = (text) => {
    if (isMuted) return;
    
    // Stop any ongoing speech
    stopCurrentSpeech();
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };
    
    speechSynthesis.speak(utterance);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Stop any ongoing speech when user sends a new message
    stopCurrentSpeech();

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
      const conversationHistory = validateConversationHistory(messages);
      let enhancedInput = input;
      if (currentExpression) {
        enhancedInput = `[Avatar Expression: ${currentExpression}] ${input}`;
      }

      const response = await generateGroqResponse(
        enhancedInput,
        SYSTEM_PROMPTS.avatar,
        conversationHistory
      );

      const emotion = extractEmotionCues(response);
      setCurrentExpression(emotion in expressions ? emotion : 'neutral');

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        expression: emotion
      };
      setMessages(prev => [...prev, botMessage]);
      
      speakText(response);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: error.message || "I apologize, but I'm having trouble responding right now. Could you please try again?",
        timestamp: new Date(),
        expression: 'sad'
      };
      setMessages(prev => [...prev, errorMessage]);
      setCurrentExpression('sad');
      speakText(errorMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Stop any ongoing speech when resetting
    stopCurrentSpeech();
    
    setMessages([{
      id: 1,
      type: 'bot',
      content: "Hello! I'm your MAAND Avatar companion. I'm here to support you with enhanced visual interaction.",
      timestamp: new Date()
    }]);
    setCurrentExpression('neutral');
    if (!isMuted) {
      speakText("Hello! I'm your MAAND Avatar companion. I'm here to support you with enhanced visual interaction.");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gray-900`}>
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Avatar MAAND</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-gray-400" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-400" />
            )}
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

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Avatar Container */}
        <div className="w-1/2 bg-gray-800 relative flex items-center justify-center">
          <div className="w-full max-w-md">
            <Avatar expression={currentExpression} speaking={isSpeaking} />
          </div>
        </div>

        {/* Chat Container */}
        <div className="w-1/2 flex flex-col relative">
          {/* Messages Container */}
          <div className="absolute top-0 left-0 right-0 bottom-[76px] overflow-y-auto">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#00FFB2] text-black rounded-br-none'
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
          </div>

          {/* Input Form - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
            <form onSubmit={handleSend} className="p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFB2]"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#00FFB2] text-black px-4 py-2 rounded-lg hover:bg-[#00E6A0] transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarMaand; 