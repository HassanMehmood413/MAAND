import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img
              src="/logo192.png"
              alt="Aasani Logo"
              className="h-8 w-8"
            />
            <span className="text-white text-lg font-semibold">MAAND</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="/about" className="hover:text-indigo-400 transition">About</a>
            <a href="/contact" className="hover:text-indigo-400 transition">Contact</a>
            <a href="/terms" className="hover:text-indigo-400 transition">Terms</a>
            <a href="/privacy" className="hover:text-indigo-400 transition">Privacy</a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Copyright */}
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Aasani. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
