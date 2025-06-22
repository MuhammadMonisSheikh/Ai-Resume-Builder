import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FileText, Menu, X, Settings, Download, User, LogOut, ChevronDown } from 'lucide-react';
import PWASettings from './PWASettings';
import AuthModal from './auth/AuthModal';
import UserProfile from './auth/UserProfile';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef(null);

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

  // Handle auth modal opening from other components
  useEffect(() => {
    const handleOpenAuthModalFromForm = () => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModalFromForm', handleOpenAuthModalFromForm);
    return () => {
      window.removeEventListener('openAuthModalFromForm', handleOpenAuthModalFromForm);
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

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    setIsUserMenuOpen(false);
  };

  async function generateAIResume(data) {
    const prompt = `Generate a professional resume layout and content for the following job title and details:\nJob Title: ${data.jobTitle}\nDetails: ${JSON.stringify(data)}`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.7
      })
    });
    const result = await response.json();
    return result.choices[0].message.content;
  }

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-8 w-auto" src="/icons/icon-192x192.png" alt="AI Resume Pro Logo" />
              <span className="text-xl font-bold text-white">AI Resume Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base text-gray-300 hover:text-white`}>
              Home
            </NavLink>
            <NavLink to="/resume-for-freshers" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base text-gray-300 hover:text-white`}>
              Freshers
            </NavLink>
            <NavLink to="/resume-for-gulf-jobs" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base text-gray-300 hover:text-white`}>
              Gulf Jobs
            </NavLink>
            <NavLink to="/cover-letter-for-teachers" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base text-gray-300 hover:text-white`}>
              Teachers
            </NavLink>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <Settings className="h-5 w-5" />
            </button>
          </nav>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <span className="text-sm">{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50" ref={userMenuRef}>
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
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
              <button
                onClick={handleAuthClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen Modal */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="bg-gray-800 w-full h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <NavLink to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-white">AI Resume Pro</span>
            </NavLink>
            <button onClick={() => setIsMenuOpen(false)} className="p-2">
              <X className="h-6 w-6 text-gray-300" />
            </button>
          </div>
          <nav className="flex-grow flex flex-col justify-center items-center space-y-8">
            <NavLink to="/" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl text-gray-300 hover:text-white`} onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/resume-for-freshers" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl text-gray-300 hover:text-white`} onClick={() => setIsMenuOpen(false)}>
              For Freshers
            </NavLink>
            <NavLink to="/resume-for-gulf-jobs" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl text-gray-300 hover:text-white`} onClick={() => setIsMenuOpen(false)}>
              Gulf Jobs
            </NavLink>
            <NavLink to="/cover-letter-for-teachers" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl text-gray-300 hover:text-white`} onClick={() => setIsMenuOpen(false)}>
              For Teachers
            </NavLink>
            <div className="border-t border-gray-700 w-1/2 my-4"></div>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 text-xl"
            >
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </button>
            
            {/* Mobile Authentication */}
            <div className="border-t border-gray-700 w-1/2 my-4"></div>
            {isAuthenticated ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <span className="text-xl">{user?.firstName} {user?.lastName}</span>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleProfileClick();
                  }}
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 text-xl"
                >
                  <User className="h-6 w-6" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2 text-xl"
                >
                  <LogOut className="h-6 w-6" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleAuthClick();
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-xl"
              >
                <User className="h-6 w-6" />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
      
      {/* PWA Settings Modal */}
      <PWASettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="login"
      />
      
      {/* User Profile Modal */}
      {isProfileOpen && (
        <UserProfile onClose={() => setIsProfileOpen(false)} />
      )}
    </header>
  );
};

export default Header;