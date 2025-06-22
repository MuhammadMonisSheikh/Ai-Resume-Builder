import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseAuthService from '../services/firebaseAuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userData = await firebaseAuthService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Error getting user data:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Google redirect result on app load
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await firebaseAuthService.handleGoogleRedirectResult();
        if (result) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Error handling Google redirect:', error);
      }
    };

    handleRedirectResult();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await firebaseAuthService.login(email, password);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await firebaseAuthService.loginWithGoogle();
      setUser(data.user);
      return { success: true, isNewUser: data.isNewUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleRedirect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseAuthService.loginWithGoogleRedirect();
      // User will be redirected to Google, then back to your app
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await firebaseAuthService.register(userData);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseAuthService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await firebaseAuthService.updateProfile(user.uid, profileData);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseAuthService.forgotPassword(email);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseAuthService.resetPassword(token, newPassword);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithGoogleRedirect,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 