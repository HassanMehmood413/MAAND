import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Brain, Sparkles, Shield, Clock, Users, ArrowRight } from "lucide-react";
import * as THREE from 'three';
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import FindService from "./FindService.jsx";

function Home() {
  const sceneRef = useRef();

  // Enhanced Three.js scene setup with therapeutic particles
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Create floating particles with therapeutic colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const colors = [
      new THREE.Color(0x8B5CF6), // Purple
      new THREE.Color(0xEC4899), // Pink
      new THREE.Color(0x3B82F6), // Blue
      new THREE.Color(0x10B981), // Green
    ];

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 50;
      posArray[i + 1] = (Math.random() - 0.5) * 50;
      posArray[i + 2] = (Math.random() - 0.5) * 50;

      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.contains(renderer.domElement)) {
        sceneRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900">
        <Navbar />
        
        {/* Three.js Background */}
        <div ref={sceneRef} className="absolute inset-0 z-0" />
        
        {/* Content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-6xl md:text-8xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-8">
                Welcome to MAAND
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
                Your compassionate AI companion for mental well-being. Experience personalized support, 
                understanding, and guidance on your journey to better mental health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/services"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signin"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <FindService />

          {/* Features Section */}
          <section className="py-20 bg-gray-800/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-4 text-white">Why Choose MAAND</h2>
              <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                We combine cutting-edge AI technology with therapeutic expertise to provide
                comprehensive mental health support.
              </p>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20">
                  <Clock className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-white">24/7 Support</h3>
                  <p className="text-gray-300">Always here when you need someone to talk to, day or night.</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20">
                  <Shield className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Safe Space</h3>
                  <p className="text-gray-300">A judgment-free environment to express your thoughts and feelings.</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20">
                  <Brain className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Personalized Care</h3>
                  <p className="text-gray-300">Tailored support based on your unique emotional needs.</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20">
                  <Users className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Community Support</h3>
                  <p className="text-gray-300">Connect with others on similar mental health journeys.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-4 text-white">Stories of Hope</h2>
              <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                Hear from people who have found support and guidance through MAAND.
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold">S</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">Sarah M.</h4>
                      <p className="text-sm text-gray-400">Using MAAND for 3 months</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "MAAND has been my constant companion during difficult times. The personalized support
                    and understanding responses have made a real difference in my journey to better mental health."
                  </p>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold">J</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">James K.</h4>
                      <p className="text-sm text-gray-400">Using MAAND for 6 months</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "The avatar feature makes it feel like I'm talking to a real person. It's helped me
                    open up more about my feelings and develop better coping strategies."
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
