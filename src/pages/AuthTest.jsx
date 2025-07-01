import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest = () => {
  const { 
    user, 
    profile, 
    loading, 
    error, 
    isAuthenticated, 
    login, 
    signup, 
    logout,
    getUserDisplayName,
    getUserInitials
  } = useAuth();

  const [testEmail, setTestEmail] = React.useState('test@example.com');
  const [testPassword, setTestPassword] = React.useState('testpassword123');

  const handleTestSignup = async () => {
    try {
      await signup(testEmail, testPassword, 'Test User');
      alert('Signup successful!');
    } catch (err) {
      alert(`Signup failed: ${err.message}`);
    }
  };

  const handleTestLogin = async () => {
    try {
      await login(testEmail, testPassword);
      alert('Login successful!');
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  const handleTestLogout = async () => {
    try {
      await logout();
      alert('Logout successful!');
    } catch (err) {
      alert(`Logout failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
        
        {/* Status Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Loading:</strong> {loading ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
            </div>
            <div>
              <p><strong>User ID:</strong> {user?.id || 'None'}</p>
              <p><strong>User Email:</strong> {user?.email || 'None'}</p>
              <p><strong>Profile ID:</strong> {profile?.id || 'None'}</p>
            </div>
          </div>
        </div>

        {/* User Data Section */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">User Object:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-medium mb-2">Profile Object:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            </div>
            <div className="mt-4">
              <p><strong>Display Name:</strong> {getUserDisplayName()}</p>
              <p><strong>Initials:</strong> {getUserInitials()}</p>
            </div>
          </div>
        )}

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email:
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Password:
              </label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleTestSignup}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Signup
            </button>
            <button
              onClick={handleTestLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Login
            </button>
            <button
              onClick={handleTestLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Test Logout
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>First, run the SQL setup script in your Supabase SQL Editor</li>
            <li>Test signup with a new email address</li>
            <li>Test login with the same credentials</li>
            <li>Check that the profile data appears correctly</li>
            <li>Test the profile update functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AuthTest; 