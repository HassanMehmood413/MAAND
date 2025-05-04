import React, { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Me', text: 'Hey there!' },
    { id: 2, sender: 'Friend', text: 'Hello! How are you?' },
    { id: 3, sender: 'Me', text: 'I am good, thanks! What about you?' },
    { id: 4, sender: 'Friend', text: 'Doing great! Excited for our project.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'Me', text: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src="https://www.svgrepo.com/show/447332/user-avatar.svg"
            alt="Friend Avatar"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold">Friend</h2>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'Me'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700 flex items-center space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
