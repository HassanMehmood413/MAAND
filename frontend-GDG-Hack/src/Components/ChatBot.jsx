import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Send, Heart, Brain, Sparkles } from 'lucide-react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const GROQ_API_KEY = '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are MAAND, a compassionate and highly skilled AI mental health companion. Your role is to provide empathetic support and guidance to individuals dealing with mental health challenges. Here's how you should interact:

1. Emotional Support:
   - Listen actively and validate feelings
   - Show genuine empathy and understanding
   - Use warm, supportive language
   - Acknowledge the person's experiences and emotions

2. Therapeutic Approach:
   - Use evidence-based therapeutic techniques
   - Provide gentle guidance and coping strategies
   - Encourage self-reflection and personal growth
   - Maintain appropriate boundaries while being supportive

3. Communication Style:
   - Be warm and conversational
   - Use clear, accessible language
   - Avoid clinical or technical jargon
   - Show patience and understanding

4. Response Structure:
   - Acknowledge the person's feelings
   - Provide relevant insights or coping strategies
   - Ask thoughtful follow-up questions
   - Offer gentle encouragement

5. Safety and Boundaries:
   - Recognize signs of crisis
   - Encourage professional help when needed
   - Maintain appropriate therapeutic distance
   - Never provide medical advice

6. Personalization:
   - Adapt your responses to the person's needs
   - Consider their emotional state
   - Build on previous conversations
   - Respect their pace and comfort level

Remember: Your goal is to create a safe, supportive space for emotional expression and growth.`;

const INITIAL_MESSAGE = `Hello! I'm MAAND, your compassionate AI companion. I'm here to listen, support, and walk with you on your journey to better mental well-being. 

I understand that reaching out can be challenging, and I want you to know that this is a safe space. Whether you're dealing with stress, anxiety, depression, or just need someone to talk to, I'm here to listen without judgment.

How are you feeling today? What's on your mind?`;

// Therapeutic images for different chat types
const CHAT_IMAGES = {
  free: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&auto=format&fit=crop&q=60",
  personalized: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60",
  avatar: "https://images.unsplash.com/photo-1573497019236-a2cb8a7d2086?w=800&auto=format&fit=crop&q=60"
};

// Avatar-specific colors and settings
const AVATAR_COLORS = {
  primary: '#00FFB2', // Bright cyan
  secondary: '#FF61D8', // Bright pink
  accent: '#7B61FF', // Bright purple
  glow: '#00FFB2', // Cyan glow
};

export default function ChatBotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    {
      role: 'assistant',
      content: INITIAL_MESSAGE
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatType, setChatType] = useState('free');
  const messagesEndRef = useRef(null);
  const sceneRef = useRef();
  const avatarRef = useRef();

  // Check authentication for premium features
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo && (chatType === 'personalized' || chatType === 'avatar')) {
      navigate('/signin');
    }
  }, [chatType, navigate]);

  // Enhanced Three.js setup with conditional avatar rendering
  useEffect(() => {
    if (!sceneRef.current || chatType !== 'avatar') return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneRef.current.appendChild(renderer.domElement);

    // Create holographic avatar
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);
    avatarRef.current = avatarGroup;

    // Core sphere with holographic material
    const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: AVATAR_COLORS.primary,
      transparent: true,
      opacity: 0.6,
      shininess: 100,
      specular: 0xffffff,
      emissive: AVATAR_COLORS.glow,
      emissiveIntensity: 0.5,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    avatarGroup.add(core);

    // Energy rings
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: AVATAR_COLORS.secondary,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      emissive: AVATAR_COLORS.secondary,
      emissiveIntensity: 0.3,
    });

    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.x = Math.PI / 2;
    const ring3 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring3.rotation.y = Math.PI / 2;
    
    avatarGroup.add(ring1, ring2, ring3);

    // Particle system for energy field
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(AVATAR_COLORS.primary);
    const color2 = new THREE.Color(AVATAR_COLORS.secondary);
    const color3 = new THREE.Color(AVATAR_COLORS.accent);
    
    for(let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      
      positions[i] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i + 2] = radius * Math.cos(theta);
      
      const mixedColor = [color1, color2, color3][Math.floor(Math.random() * 3)];
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    avatarGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(AVATAR_COLORS.primary, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(AVATAR_COLORS.secondary, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Update the post-processing setup in the useEffect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
      1.5, // intensity
      0.4, // radius
      0.85 // threshold
    );
    
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    camera.position.z = 5;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (avatarRef.current) {
        // Pulse effect
        const time = Date.now() * 0.001;
        core.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
        
        // Ring animations
        ring1.rotation.x += 0.005;
        ring2.rotation.y += 0.005;
        ring3.rotation.z += 0.005;
        
        // Particle animation
        particles.rotation.y += 0.001;
        const positions = particlesGeometry.attributes.position.array;
        for(let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time + positions[i]) * 0.002;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Holographic flicker effect
        if (Math.random() > 0.95) {
          core.material.opacity = 0.4 + Math.random() * 0.2;
        }
      }
      
      controls.update();
      composer.render();
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
      composer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      sceneRef.current?.removeChild(renderer.domElement);
    };
  }, [chatType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      conversationHistory.push({
        role: 'user',
        content: input
      });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Groq API');
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 text-white">
      {/* Three.js Background - Only shown in avatar mode */}
      {chatType === 'avatar' && (
        <div 
          ref={sceneRef} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-1/2"
          style={{
            background: `radial-gradient(circle at center, ${AVATAR_COLORS.glow}10, transparent 70%)`,
            boxShadow: `0 0 100px ${AVATAR_COLORS.glow}30`,
            borderRadius: '50%'
          }}
        />
      )}
      
      {/* Chat Interface */}
      <div className={`relative z-10 max-w-4xl mx-auto p-4 ${chatType === 'avatar' ? 'w-1/2' : 'w-full'}`}>
        {/* Chat Type Selector */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(CHAT_IMAGES).map(([type, image]) => (
              <button
              key={type}
              onClick={() => setChatType(type)}
              className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                chatType === type 
                  ? 'ring-4 ring-purple-500 shadow-lg shadow-purple-500/50' 
                  : 'hover:ring-2 hover:ring-purple-500/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img
                src={image}
                alt={`${type} chat`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="flex items-center space-x-2">
                  {type === 'free' && <Heart className="w-5 h-5 text-purple-400" />}
                  {type === 'personalized' && <Brain className="w-5 h-5 text-purple-400" />}
                  {type === 'avatar' && (
                    <Sparkles className="w-5 h-5" style={{ color: AVATAR_COLORS.primary }} />
                  )}
                  <span className="font-semibold capitalize">{type} Support</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div 
          className={`bg-gray-800/30 backdrop-blur-md rounded-2xl p-6 h-[60vh] overflow-y-auto mb-6 border ${
            chatType === 'avatar' 
              ? `border-[${AVATAR_COLORS.primary}]/20` 
              : 'border-purple-500/20'
          }`}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                  message.sender === 'user'
                    ? chatType === 'avatar'
                      ? `bg-[${AVATAR_COLORS.primary}]/20 shadow-lg shadow-[${AVATAR_COLORS.primary}]/30`
                      : 'bg-purple-600 shadow-lg shadow-purple-500/30'
                    : 'bg-gray-700/80 shadow-lg backdrop-blur-sm'
                }`}
              >
                {message.text}
      </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <div 
                className={`inline-block animate-pulse ${
                  chatType === 'avatar' 
                    ? `text-[${AVATAR_COLORS.primary}]` 
                    : 'text-purple-400'
                }`}
              >
                ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className={`flex-1 bg-gray-700/50 backdrop-blur-sm text-white px-6 py-4 rounded-full focus:outline-none transition-all duration-300 border ${
              chatType === 'avatar'
                ? `border-[${AVATAR_COLORS.primary}]/20 focus:ring-2 focus:ring-[${AVATAR_COLORS.primary}]`
                : 'border-purple-500/20 focus:ring-2 focus:ring-purple-500'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`p-4 rounded-full transition-all duration-300 disabled:opacity-50 flex items-center justify-center ${
              chatType === 'avatar'
                ? `bg-[${AVATAR_COLORS.primary}] hover:bg-[${AVATAR_COLORS.primary}]/90 shadow-lg shadow-[${AVATAR_COLORS.primary}]/30`
                : 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/30'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
