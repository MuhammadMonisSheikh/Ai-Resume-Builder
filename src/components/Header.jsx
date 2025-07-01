// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FileText, Menu, X, Settings, Download, User, LogOut, ChevronDown, Brain, Layout, MessageCircle } from 'lucide-react';
import PWASettings from './PWASettings';
import UserProfile from './auth/UserProfile';
import AILearningDashboard from './AILearningDashboard';
import TemplateDashboard from './TemplateDashboard';
import AIChatInterface from './AIChatInterface';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAILearningOpen, setIsAILearningOpen] = useState(false);
  const [isTemplateDashboardOpen, setIsTemplateDashboardOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, profile, isAuthenticated, logout, getUserDisplayName, getUserInitials } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Debug user state
  useEffect(() => {
    console.log('Header - User state changed:', {
      isAuthenticated,
      user: user ? {
        id: user.id,
        email: user.email
      } : null,
      profile: profile ? {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: profile.full_name
      } : null
    });
  }, [user, profile, isAuthenticated]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const baseLinkClass = "transition-colors hover:text-blue-600";
  const activeLinkClass = "text-blue-600 font-semibold";
  const inactiveLinkClass = "text-gray-600 font-medium";

  const getLinkClassName = ({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleAILearningClick = () => {
    setIsAILearningOpen(true);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleTemplateDashboardClick = () => {
    setIsTemplateDashboardOpen(true);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleAIChatClick = () => {
    setIsAIChatOpen(true);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-8 w-auto" src="/icons/icon-192x192.png" alt="AI Resume Pro Logo" />
              <span className="text-xl font-bold text-gray-900">AI Resume Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/" className={getLinkClassName}>
                Home
              </NavLink>
              <NavLink to="/resume" className={getLinkClassName}>
                Resume Builder
              </NavLink>
              <NavLink to="/cover-letter" className={getLinkClassName}>
                Cover Letter
              </NavLink>
            </nav>
          </div>

          {/* Right side - User menu and settings */}
          <div className="flex items-center space-x-4">
            {/* AI Chat Button */}
            <button
              onClick={handleAIChatClick}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              title="AI Chat Assistant"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            {/* Template Dashboard Button */}
            <button
              onClick={handleTemplateDashboardClick}
              className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
              title="Template Dashboard"
            >
              <Layout className="h-5 w-5" />
            </button>

            {/* AI Learning Dashboard Button */}
            <button
              onClick={handleAILearningClick}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              title="AI Learning Dashboard"
            >
              <Brain className="h-5 w-5" />
            </button>

            {/* PWA Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="PWA Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getUserInitials()}
                  </div>
                  <span className="hidden sm:block text-gray-700 font-medium">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50" ref={userMenuRef}>
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={handleAIChatClick}
                      className="w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 flex items-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>AI Chat</span>
                    </button>
                    <button
                      onClick={handleTemplateDashboardClick}
                      className="w-full px-4 py-2 text-left text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                    >
                      <Layout className="h-4 w-4" />
                      <span>Templates</span>
                    </button>
                    <button
                      onClick={handleAILearningClick}
                      className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                    >
                      <Brain className="h-4 w-4" />
                      <span>AI Learning</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/resume"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Resume Builder
            </NavLink>
            <NavLink
              to="/cover-letter"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Cover Letter
            </NavLink>
            
            {/* Mobile Dashboard Links */}
            {isAuthenticated && (
              <>
                <button
                  onClick={handleAIChatClick}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-green-50"
                >
                  AI Chat Assistant
                </button>
                <button
                  onClick={handleTemplateDashboardClick}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:bg-orange-50"
                >
                  Template Dashboard
                </button>
                <button
                  onClick={handleAILearningClick}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:bg-purple-50"
                >
                  AI Learning Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isSettingsOpen && (
        <PWASettings onClose={() => setIsSettingsOpen(false)} />
      )}

      {isProfileOpen && (
        <UserProfile onClose={() => setIsProfileOpen(false)} />
      )}

      {isAILearningOpen && (
        <AILearningDashboard onClose={() => setIsAILearningOpen(false)} />
      )}

      {isTemplateDashboardOpen && (
        <TemplateDashboard onClose={() => setIsTemplateDashboardOpen(false)} />
      )}

      {isAIChatOpen && (
        <AIChatInterface onClose={() => setIsAIChatOpen(false)} />
      )}
    </header>
  );
};

export default Header;