import React, { useState, useEffect } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { auth } from '../utils/api';
import slide1 from '../assets/signinpageside.png';
import slide2 from '../assets/signinpageside.png';
import slide3 from '../assets/signinpageside.png';

export default function SignUpForm() {
  const slides = [slide1, slide2, slide3];
  const [current, setCurrent] = useState(0);
  const [showPwd, setShowPwd] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
    role: 'User',
    institution: '',
    enrollmentDate: '',
    gender: '',
    agree: false,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-rotate slides every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        avatarUrl: formState.avatarUrl,
        role: formState.role,
        institution: formState.institution,
        gender: formState.gender,
        enrollmentDate: formState.enrollmentDate || undefined,
      };

      const response = await fetch('https://maand-backend.vercel.app/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();

      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect to main page
      window.location.href = '/';
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* ─── LEFT PANEL: Slider ─── */}
      <div className="w-full md:w-1/2 relative p-4 md:p-8">
        <div className="relative rounded-xl overflow-hidden h-64 sm:h-80 md:h-full">
          <img
            src={slides[current]}
            alt={`slide-${current}`}
            className="object-cover w-full h-full"
          />
          <button
            onClick={goPrev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-1.5 rounded-full hover:bg-opacity-75"
          >
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={goNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-1.5 rounded-full hover:bg-opacity-75"
          >
            <ChevronRightIcon className="h-5 w-5 text-white" />
          </button>
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`${idx === current ? 'w-6' : 'w-3'} h-1 rounded-full ${
                  idx === current ? 'bg-white' : 'bg-gray-600'
                } transition-all duration-300`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Sign Up Form ─── */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Create an account</h1>
        <p className="mb-6 text-gray-300 text-sm md:text-base">
          Already have an account?{' '}
          <a href="/signin" className="text-indigo-400 hover:underline">
            Log in
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <input
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
            placeholder="Full Name"
            required
            disabled={isLoading}
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
            placeholder="Email"
            required
            disabled={isLoading}
          />

          {/* Password with toggle */}
          <div className="relative">
            <input
              name="password"
              value={formState.password}
              onChange={handleChange}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
              type={showPwd ? 'text' : 'password'}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
              disabled={isLoading}
            >
              {showPwd ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Gender and Role */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <select
              name="gender"
              value={formState.gender}
              onChange={handleChange}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
              required
              disabled={isLoading}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="role"
              value={formState.role}
              onChange={handleChange}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
              disabled={isLoading}
            >
              <option value="User">User</option>
              <option value="Service-Provider">Service Provider</option>
              <option value="Guard">Guard</option>
              <option value="SocietyAdmin">Society Admin</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Institution and Enrollment Date */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              name="institution"
              value={formState.institution}
              onChange={handleChange}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
              placeholder="Institution (optional)"
              disabled={isLoading}
            />
            <input
              name="enrollmentDate"
              type="date"
              value={formState.enrollmentDate}
              onChange={handleChange}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Avatar URL */}
          <input
            name="avatarUrl"
            type="url"
            value={formState.avatarUrl}
            onChange={handleChange}
            className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none"
            placeholder="Avatar URL (optional)"
            disabled={isLoading}
          />

          {/* Terms checkbox */}
          <div className="flex items-center">
            <input
              id="terms"
              name="agree"
              checked={formState.agree}
              onChange={handleChange}
              type="checkbox"
              className="h-4 w-4 text-indigo-400 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="ml-2 text-gray-300 text-sm">
              I agree to the{' '}
              <a href="/terms" className="text-indigo-400 hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formState.agree || isLoading}
            className="w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Social login divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-700" />
          <span className="mx-2 text-gray-400 text-xs md:text-sm">Or register with</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        {/* Social buttons */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <button className="w-full flex items-center justify-center border border-gray-600 py-3 rounded-lg hover:bg-gray-800 transition">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Google
          </button>
          <button className="w-full flex items-center justify-center border border-gray-600 py-3 rounded-lg hover:bg-gray-800 transition">
            <img
              src="https://www.svgrepo.com/show/303128/apple-logo.svg"
              alt="Apple"
              className="h-5 w-5 mr-2"
            />
            Apple
          </button>
        </div>
      </div>
    </div>
  );
}