// src/components/ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ChatBox({ currentUserId }) {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    axios.get(`https://maand-backend.vercel.app/api/chat/${chatId}`)
      .then(res => setChat(res.data))
      .catch(console.error);
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;
    axios.post(
      `https://maand-backend.vercel.app/api/chat/${chatId}/message`,
      { sender: currentUserId, content: message }
    )
    .then(res => {
      setChat(prev => ({ ...prev, messages: [...prev.messages, res.data] }));
      setMessage('');
    })
    .catch(console.error);
  };

  if (!chat) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        {chat.messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 max-w-xs p-2 rounded-lg ${
              m.sender._id === currentUserId ? 'bg-blue-500 text-white self-end' : 'bg-white text-gray-800 self-start'
            }`}
          >
            <div className="text-sm font-medium">{m.sender.name}</div>
            <div>{m.content}</div>
            <div className="text-xs text-gray-500 text-right">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 bg-white flex">
        <input
          className="flex-1 border rounded-l-md p-2"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
