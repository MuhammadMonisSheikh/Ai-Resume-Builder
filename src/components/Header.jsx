import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FileText, Menu, X, Settings, Download } from 'lucide-react';
import PWASettings from './PWASettings';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const baseLinkClass = "transition-colors hover:text-blue-600";
  const activeLinkClass = "text-blue-600 font-semibold";
  const inactiveLinkClass = "text-gray-600 font-medium";

  const getLinkClassName = ({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-8 w-auto" src="/icons/icon-192x192.png" alt="AI Resume Pro Logo" />
              <span className="text-xl font-bold text-gray-800">AI Resume Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base`}>
              Home
            </NavLink>
            <NavLink to="/resume-for-freshers" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base`}>
              Freshers
            </NavLink>
            <NavLink to="/resume-for-gulf-jobs" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base`}>
              Gulf Jobs
            </NavLink>
            <NavLink to="/cover-letter-for-teachers" className={({isActive}) => `${getLinkClassName({isActive})} text-sm lg:text-base`}>
              Teachers
            </NavLink>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <Settings className="h-5 w-5" />
            </button>
          </nav>

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
        <div className="bg-white w-full h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <NavLink to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                    <FileText className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">AI Resume Pro</span>
                </NavLink>
                <button onClick={() => setIsMenuOpen(false)} className="p-2">
                    <X className="h-6 w-6 text-gray-700" />
                </button>
            </div>

            <nav className="flex-grow flex flex-col justify-center items-center space-y-8">
              <NavLink to="/" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl`} onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/resume-for-freshers" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl`} onClick={() => setIsMenuOpen(false)}>
                For Freshers
              </NavLink>
              <NavLink to="/resume-for-gulf-jobs" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl`} onClick={() => setIsMenuOpen(false)}>
                Gulf Jobs
              </NavLink>
              <NavLink to="/cover-letter-for-teachers" className={({isActive}) => `${getLinkClassName({isActive})} text-2xl`} onClick={() => setIsMenuOpen(false)}>
                For Teachers
              </NavLink>
              
              <div className="border-t w-1/2 my-4"></div>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2 text-xl"
              >
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </button>
            </nav>
        </div>
      </div>
      
      {/* PWA Settings Modal */}
      <PWASettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
};

export default Header;