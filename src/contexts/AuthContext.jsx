import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [error, setError] = useState('');

  // Initialize IndexedDB
  useEffect(() => {
    initializeDB();
    checkAuthStatus();
  }, []);

  const initializeDB = () => {
    const request = indexedDB.open('ResumeAppDB', 1);
    
    request.onerror = () => {
      console.error('Failed to open IndexedDB');
    };

    request.onsuccess = () => {
      console.log('IndexedDB opened successfully');
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'email' });
        userStore.createIndex('email', 'email', { unique: true });
      }

      // Create resumes store
      if (!db.objectStoreNames.contains('resumes')) {
        const resumeStore = db.createObjectStore('resumes', { keyPath: 'id', autoIncrement: true });
        resumeStore.createIndex('userId', 'userId', { unique: false });
        resumeStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create cover letters store
      if (!db.objectStoreNames.contains('coverLetters')) {
        const coverLetterStore = db.createObjectStore('coverLetters', { keyPath: 'id', autoIncrement: true });
        coverLetterStore.createIndex('userId', 'userId', { unique: false });
        coverLetterStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  };

  const checkAuthStatus = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const register = async (userData) => {
    try {
      setError('');
      const { email, password, firstName, lastName } = userData;

      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        email,
        password: btoa(password), // Simple encoding (not secure for production)
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to IndexedDB
      await saveUser(newUser);

      // Set user in state and localStorage
      const userToStore = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: newUser.createdAt
      };

      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      
      // Get user from IndexedDB
      const user = await getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Check password
      if (user.password !== btoa(password)) {
        throw new Error('Invalid password');
      }

      // Set user in state and localStorage
      const userToStore = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      };

      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    try {
      setError('');
      
      if (!user) {
        throw new Error('No user logged in');
      }

      // Update user in IndexedDB
      const updatedUser = {
        ...profileData,
        email: user.email,
        updatedAt: new Date().toISOString()
      };

      await saveUser(updatedUser);

      // Update user in state and localStorage
      const userToStore = {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        createdAt: updatedUser.createdAt
      };

      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    setError('');
  };

  const resetPassword = async (email) => {
    try {
      setError('');
      
      // Check if user exists
      const user = await getUserByEmail(email);
      if (!user) {
        throw new Error('No account found with this email address');
      }

      // In a real application, you would send an email here
      // For this demo, we'll just simulate success
      console.log('Password reset email would be sent to:', email);
      
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // IndexedDB helper functions
  const saveUser = (userData) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ResumeAppDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const saveRequest = store.put(userData);
        
        saveRequest.onsuccess = () => resolve(saveRequest.result);
        saveRequest.onerror = () => reject(saveRequest.error);
      };
    });
  };

  const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ResumeAppDB', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const getRequest = store.get(email);
        
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    clearError,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 