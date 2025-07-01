import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Settings, Zap, Eye, EyeOff } from 'lucide-react';
import aiLearningService from '../services/aiLearningService';
import { useAuth } from '../contexts/AuthContext';

const AILearningDashboard = ({ onClose }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [testCommand, setTestCommand] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadStats();
    setLearningEnabled(aiLearningService.isLearningEnabled());
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const learningStats = await aiLearningService.getLearningStats();
      setStats(learningStats);
    } catch (error) {
      console.error('Error loading learning stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLearningToggle = () => {
    const newState = !learningEnabled;
    setLearningEnabled(newState);
    aiLearningService.setLearningEnabled(newState);
  };

  const handleTestCommand = async () => {
    if (!testCommand.trim()) return;

    const startTime = Date.now();
    try {
      // Simulate AI response
      const response = `This is a test response to: "${testCommand}"\n\n**Learning Analysis:**\n- Command complexity: ${aiLearningService.analyzeComplexity(testCommand)}/10\n- Pattern detected: ${aiLearningService.extractPattern(testCommand)}\n- Suggested improvements based on learning data`;

      setTestResponse(response);

      // Track the interaction
      await aiLearningService.trackAICommand(
        testCommand,
        response,
        true,
        'test_interaction'
      );

      // Learn from success
      await aiLearningService.learnFromSuccess(testCommand, response, 8);

      // Reload stats
      await loadStats();

    } catch (error) {
      console.error('Error testing command:', error);
      setTestResponse('Error: ' + error.message);
      
      // Track the error
      await aiLearningService.trackError(error, { command: testCommand });
    }
  };

  const handleUserFeedback = async (rating) => {
    if (!testCommand || !testResponse) return;

    try {
      await aiLearningService.trackUserPreference('response_rating', rating.toString(), {
        command: testCommand,
        response: testResponse
      });

      await loadStats();
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const handleCorrection = async () => {
    if (!testCommand || !testResponse) return;

    const correction = prompt('What would be a better response?');
    if (correction) {
      try {
        await aiLearningService.trackCorrection(testResponse, correction, 'user_correction');
        await aiLearningService.learnFromFailure(testCommand, testResponse, correction);
        
        setTestResponse(correction);
        await loadStats();
      } catch (error) {
        console.error('Error saving correction:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading AI Learning Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Learning Dashboard</h2>
                <p className="text-purple-100 text-sm">Monitor and improve AI responses</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLearningToggle}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  learningEnabled 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {learningEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>{learningEnabled ? 'Learning ON' : 'Learning OFF'}</span>
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-purple-200 transition-colors p-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'testing', label: 'Testing', icon: Zap },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Interactions</p>
                      <p className="text-2xl font-bold text-blue-900">{stats?.total_interactions || 0}</p>
                    </div>
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Success Rate</p>
                      <p className="text-2xl font-bold text-green-900">
                        {stats?.interaction_types?.find(t => t.type === 'ai_command')?.success_rate || 0}%
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Learning Entries</p>
                      <p className="text-2xl font-bold text-purple-900">{stats?.learning_entries || 0}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Failures Tracked</p>
                      <p className="text-2xl font-bold text-red-900">{stats?.failure_entries || 0}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Learning Activity</h3>
                <div className="space-y-2">
                  {stats?.interaction_types?.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="font-medium">{type.type}</span>
                      <span className="text-gray-600">{type.count} interactions</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Testing Tab */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Test AI Learning</h3>
                <p className="text-blue-700 mb-4">
                  Try different commands to see how the AI learns and improves its responses.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Command
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={testCommand}
                        onChange={(e) => setTestCommand(e.target.value)}
                        placeholder="Enter a command to test..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleTestCommand}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Test
                      </button>
                    </div>
                  </div>

                  {testResponse && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AI Response
                      </label>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">{testResponse}</pre>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">Rate this response:</span>
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => handleUserFeedback(rating)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                          >
                            {rating}
                          </button>
                        ))}
                        <button
                          onClick={handleCorrection}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        >
                          Suggest Correction
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Learning Analytics</h3>
                <p className="text-green-700 mb-4">
                  Detailed insights into AI learning patterns and performance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Command Patterns</h4>
                    <div className="space-y-2">
                      {stats?.interaction_types?.filter(t => t.type === 'ai_command').map((pattern, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{pattern.type}</span>
                          <span className="font-medium">{pattern.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Error Types</h4>
                    <div className="space-y-2">
                      {stats?.interaction_types?.filter(t => t.type === 'error').map((error, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{error.type}</span>
                          <span className="font-medium">{error.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Learning Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Learning Mode</h4>
                      <p className="text-sm text-gray-600">Enable AI to learn from interactions</p>
                    </div>
                    <button
                      onClick={handleLearningToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        learningEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          learningEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Advanced Analytics</h4>
                      <p className="text-sm text-gray-600">Show detailed learning metrics</p>
                    </div>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showAdvanced ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showAdvanced ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {showAdvanced && (
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Advanced Settings</h4>
                      <div className="space-y-2 text-sm">
                        <p>Buffer Size: {aiLearningService.maxBufferSize}</p>
                        <p>Session ID: {aiLearningService.getSessionId()}</p>
                        <p>Learning Enabled: {aiLearningService.isLearningEnabled() ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AILearningDashboard; 