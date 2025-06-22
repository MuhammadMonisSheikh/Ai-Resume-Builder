import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Sparkles } from 'lucide-react';

const AuthAwareContent = ({ 
  children, 
  fallback = null, 
  showUpgradePrompt = false,
  upgradeMessage = "Sign in to unlock this feature",
  upgradeButtonText = "Sign In"
}) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (showUpgradePrompt) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
        <p className="text-gray-600 mb-4">{upgradeMessage}</p>
        <button
          onClick={() => {
            // This will be handled by the parent component
            window.dispatchEvent(new CustomEvent('openAuthModal'));
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
        >
          <User className="h-4 w-4" />
          <span>{upgradeButtonText}</span>
        </button>
      </div>
    );
  }

  return null;
};

export default AuthAwareContent; 