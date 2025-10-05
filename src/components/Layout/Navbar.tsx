import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <h1 className="text-3xl font-bold gradient-text">Byway</h1>
              </div>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-blue-50"
              >
                🏠 Home
              </Link>
              <Link
                to="/courses"
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-blue-50"
              >
                📚 Courses
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {(isAuthenticated && !isAdmin) && (
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-blue-600 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
              >
              <svg
  className="w-7 h-7 text-black group-hover:scale-110 transition-transform duration-200"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <circle cx="9" cy="19" r="1.5" />
  <circle cx="17" cy="19" r="1.5" />
  <path d="M3 5h2l1 7a2 2 0 0 0 2 1.8h8.5a2 2 0 0 0 1.9-1.4L20 8H6.5" />
</svg>

                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    ⚡ Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Welcome, {user?.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 text-sm font-medium ml-2 px-2 py-1 rounded hover:bg-red-50 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-lg font-medium hover:bg-blue-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  ✨ Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                to="/courses"
                className="text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📚 Courses
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl text-lg font-bold mx-4 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ✨ Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};