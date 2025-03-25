import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
            alt="Logo"
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-2xl font-bold">BookReviews</h1>
        </Link>

        {/* Desktop Menu Items */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-indigo-200">Home</Link>
            <Link to="/book" className="hover:text-indigo-200">Browse</Link>
            <Link to="/my-review" className="hover:text-indigo-200">My Reviews</Link>
            {/* <Link to="#" className="hover:text-indigo-200">Reading Lists</Link> */}
          </nav>
          
          {/* User Profile for Desktop */}
          <div className="hidden md:flex items-center">
            <Link to="/profile" className="flex items-center hover:text-indigo-200 mr-4">
              <img
                className="h-8 w-8 rounded-full object-cover border-2 border-white"
                src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                alt="User profile"
              />
            </Link>
            <button
              onClick={onLogout}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg"
            >
              Sign Out
            </button>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button 
            className="md:hidden p-2 text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-20">
          <div className="px-4 py-3 flex flex-col space-y-3">
            <Link to="/" className="py-2 border-b border-gray-200 text-indigo-700 font-medium">
              Home
            </Link>
            <Link to="/book" className="py-2 border-b border-gray-200 text-indigo-700 font-medium">
              Browse
            </Link>
            <Link to="/my-review" className="py-2 border-b border-gray-200 text-indigo-700 font-medium">
              My Reviews
            </Link>
            {/* <Link to="#" className="py-2 border-b border-gray-200 text-indigo-700 font-medium">
              Reading Lists
            </Link> */}
            <Link to="/profile" className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-indigo-700 font-medium">Profile</span>
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                alt="User profile"
              />
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 text-indigo-700 border font-medium border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;