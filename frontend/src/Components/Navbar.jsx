import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userInfo = auth.getUserInfo();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              MAAND
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/personalized-maand" className="text-gray-300 hover:text-white transition-colors">
              Threapist
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
              Services
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Login/User Menu */}
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {userInfo.name}</span>
              {userInfo.role === 'Admin' && (
                <Link
                  to="/AdminDashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={auth.logout}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-500 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;