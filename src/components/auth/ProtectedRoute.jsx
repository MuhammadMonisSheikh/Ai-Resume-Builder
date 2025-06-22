import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from './AuthModal';

const ProtectedRoute = ({ children, showAuthModal = true, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // If authentication is not required, show content regardless
  if (!requireAuth) {
    return children;
  }

  // If authentication is required but user is not authenticated
  if (!isAuthenticated) {
    if (showAuthModal) {
      return <AuthModal isOpen={true} initialMode="login" />;
    }
    return null;
  }

  return children;
};

export default ProtectedRoute; 