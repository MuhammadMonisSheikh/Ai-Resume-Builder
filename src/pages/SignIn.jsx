// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle, ArrowLeft, Info, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugEmail, setDebugEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Pre-fill email if available in localStorage for faster sign-in
  useEffect(() => {
    const savedEmail = localStorage.getItem('lastSignInEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Save email for faster future sign-ins
      localStorage.setItem('lastSignInEmail', formData.email);
      
      console.log('Starting sign-in process...');
      const startTime = Date.now();
      
      const user = await login(formData.email, formData.password);
      
      const signInTime = Date.now() - startTime;
      console.log(`Sign-in completed in ${signInTime}ms`);
      
      toast.success(`Welcome back! Signed in successfully in ${signInTime}ms`);
      
      // Navigate immediately after successful sign-in
      // The AuthContext will handle updating the user state
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Sign-in error:', error);
      
      // Show specific error message
      const errorMessage = error.message || 'Failed to sign in. Please try again.';
      toast.error(errorMessage);
      
      // Clear password field on error for security
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isFormValid = () => {
    return formData.email.trim() && formData.password.trim() && isValidEmail(formData.email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Test function to check if account exists
  const testAccountExists = async () => {
    if (!debugEmail) {
      toast.error('Please enter an email to test');
      return;
    }
    
    try {
      // This is a simple test - in a real app you'd have an API endpoint for this
      toast.info(`Testing account existence for: ${debugEmail}`);
      console.log('Testing account existence for:', debugEmail);
    } catch (error) {
      console.error('Error testing account:', error);
      toast.error('Error testing account existence');
    }
  };

  // Handle Enter key for faster form submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | AI Resume Pro</title>
        <meta name="description" content="Sign in to your AI Resume Pro account to access your free AI-powered resume and cover letter builder. Secure, fast, and easy login for job seekers." />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Sign In | AI Resume Pro" />
        <meta property="og:description" content="Sign in to your AI Resume Pro account to access your free AI-powered resume and cover letter builder." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-resume-pro.com/signin" />
        <meta property="og:image" content="https://ai-resume-pro.com/og-image.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Sign In | AI Resume Pro" />
        <meta property="twitter:description" content="Sign in to your AI Resume Pro account to access your free AI-powered resume and cover letter builder." />
        <meta property="twitter:image" content="https://ai-resume-pro.com/og-image.png" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6" onKeyPress={handleKeyPress}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  } transition-colors duration-200`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">Don't have an account?</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Create a new account
              </Link>
            </div>

            {/* Debug Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Info className="h-4 w-4 mr-2" />
                {showDebugInfo ? 'Hide' : 'Show'} Debug Information
              </button>
              
              {showDebugInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <h4 className="font-medium mb-2">Firebase Configuration:</h4>
                  <p className="mb-2">Project ID: ai-resume-285cd</p>
                  <p className="mb-2">Auth Domain: ai-resume-285cd.firebaseapp.com</p>
                  
                  <h4 className="font-medium mb-2 mt-4">Authentication Status:</h4>
                  <p className="mb-2">✅ Using Firebase Authentication (cleaned up)</p>
                  <p className="mb-2">❌ Mock authentication system removed</p>
                  
                  <h4 className="font-medium mb-2 mt-4">Current Test:</h4>
                  <p className="mb-2">Email: muhammadmonissheikh9@gmail.com</p>
                  <p className="mb-2 text-red-600">Status: ❌ Authentication failed</p>
                  
                  <h4 className="font-medium mb-2 mt-4">Solution:</h4>
                  <p className="mb-2 text-green-600">✅ Authentication system cleaned up!</p>
                  <p className="mb-2">The issue was having two different auth systems. Now everything uses Firebase.</p>
                  
                  <h4 className="font-medium mb-2 mt-4">Test Account Existence:</h4>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="email"
                      value={debugEmail}
                      onChange={(e) => setDebugEmail(e.target.value)}
                      placeholder="Enter email to test"
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                    <button
                      onClick={testAccountExists}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Search className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <h4 className="font-medium mb-2 mt-4">Next Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to the <strong>Sign Up</strong> page</li>
                    <li>Create a new account with: muhammadmonissheikh9@gmail.com</li>
                    <li>Use a password that meets the requirements</li>
                    <li>Then come back here and sign in with the same credentials</li>
                  </ol>
                  
                  <h4 className="font-medium mb-2 mt-4">Troubleshooting Tips:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure you've created an account first using the Sign Up page</li>
                    <li>Check that your email and password are exactly as you entered them during registration</li>
                    <li>Ensure your email is verified (if required by your Firebase settings)</li>
                    <li>Try creating a new account with a different email to test</li>
                  </ul>
                  
                  <h4 className="font-medium mb-2 mt-4">Common Issues:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>auth/invalid-credential:</strong> Wrong email or password</li>
                    <li><strong>auth/user-not-found:</strong> Account doesn't exist - sign up first</li>
                    <li><strong>auth/too-many-requests:</strong> Too many failed attempts - wait and try again</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn; 