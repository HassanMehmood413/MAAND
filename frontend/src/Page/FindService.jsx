// src/components/FindService.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Heart, Brain, Sparkles, Shield, Clock, Users, ArrowRight } from "lucide-react";
import * as THREE from 'three';
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import FreeMaand from "../Components/FreeMaand.jsx";
import PersonalizedMaand from "../Components/PersonalizedMaand.jsx";
import AvatarMaand from "../Components/AvatarMaand.jsx";

const FindService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ category: '', offerPrice: '' });
  const [allProviders, setAllProviders] = useState([]);
  const [displayedProviders, setDisplayedProviders] = useState([]);
  const [error, setError] = useState('');
  const [activeBot, setActiveBot] = useState(null);

  // Fetch all services on mount
  useEffect(() => {
    axios
      .get('https://maand-backend.vercel.app/api/provider/all')
      .then(res => {
        setAllProviders(res.data);
        setDisplayedProviders(res.data);
      })
      .catch(err => {
        console.error('Error loading services:', err);
        setError('Could not load services. Try again later.');
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const { category, offerPrice } = formData;

    // If no filters, just show full list
    if (!category && !offerPrice) {
      return setDisplayedProviders(allProviders);
    }

    try {
      const res = await axios.get(
        'https://maand-backend.vercel.app/api/provider/find',
        { params: { category, offerPrice } }
      );
      setDisplayedProviders(res.data);
    } catch (err) {
      console.error('Error fetching filtered services:', err);
      setError('Error fetching services. Please try again.');
    }
  };

  const viewProfile = userId => {
    navigate(`/user/${userId}`);
  };

  const renderChatbot = () => {
    switch (activeBot) {
      case 'free':
        return <FreeMaand onClose={() => setActiveBot(null)} />;
      case 'personalized':
        return <PersonalizedMaand onClose={() => setActiveBot(null)} />;
      case 'avatar':
        return <AvatarMaand onClose={() => setActiveBot(null)} />;
      default:
        return null;
    }
  };

  return (
    <>
      {activeBot ? (
        <div className="fixed inset-0 z-50 bg-gray-900">
          {renderChatbot()}
        </div>
      ) : (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-6 text-white">
              Our Therapeutic Services
            </h2>
            <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto text-lg">
              Choose the support that best fits your needs. Each service is designed to provide
              compassionate care and guidance on your mental health journey.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Free MAAND */}
              <div className="bg-gray-800/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-500/20">
                <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Free MAAND</h3>
                <p className="text-gray-300 mb-6">Access our basic emotional support chatbot anytime. A safe space to express yourself and receive immediate guidance.</p>
                <button
                  onClick={() => setActiveBot('free')}
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Try Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>

              {/* Personalized MAAND */}
              <div className="bg-gray-800/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-500/20">
                <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Personalized MAAND</h3>
                <p className="text-gray-300 mb-6">Get customized support based on your unique needs and emotional patterns. Experience tailored guidance for your journey.</p>
                {localStorage.getItem('token') ? (
                  <button
                    onClick={() => setActiveBot('personalized')}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Start Chat
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Login to Access
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Avatar MAAND */}
              <div className="bg-gray-800/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-500/20">
                <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Avatar MAAND</h3>
                <p className="text-gray-300 mb-6">Experience immersive support with our empathetic AI avatar companion. Connect with a visual presence that understands you.</p>
                {localStorage.getItem('token') ? (
                  <button
                    onClick={() => setActiveBot('avatar')}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Start Chat
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Login to Access
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FindService;
