import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import templateService from '../services/templateService';

const TemplateDashboard = () => {
  const [templates, setTemplates] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [testCommand, setTestCommand] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadTemplates();
    loadLayouts();
    loadStats();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_templates')
        .select('*')
        .order('content_type', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const loadLayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('template_layouts')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setLayouts(data || []);
    } catch (err) {
      console.error('Error loading layouts:', err);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_template_insights');
      if (error) throw error;
      setStats(data || {});
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const testTemplate = async () => {
    if (!testCommand.trim()) return;

    setLoading(true);
    try {
      const result = await templateService.analyzeCommand(testCommand);
      setAnalysis(result);
      
      // Track usage
      if (result.template?.id) {
        await supabase
          .from('template_usage')
          .insert({
            template_id: result.template.id,
            command: testCommand,
            success: true
          });
      }
    } catch (err) {
      console.error('Error testing template:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateTemplateData = async () => {
    if (!analysis) return;

    try {
      const templateData = await templateService.generateTemplateData(testCommand, analysis);
      console.log('Generated Template Data:', templateData);
      // You can display this data in a modal or separate section
    } catch (err) {
      console.error('Error generating template data:', err);
    }
  };

  const getContentTypeColor = (contentType) => {
    const colors = {
      resume: 'bg-blue-100 text-blue-800',
      coverLetter: 'bg-green-100 text-green-800',
      portfolio: 'bg-purple-100 text-purple-800',
      cv: 'bg-orange-100 text-orange-800'
    };
    return colors[contentType] || 'bg-gray-100 text-gray-800';
  };

  const getLayoutColor = (layout) => {
    const colors = {
      professional: 'bg-indigo-100 text-indigo-800',
      modern: 'bg-cyan-100 text-cyan-800',
      creative: 'bg-pink-100 text-pink-800',
      minimal: 'bg-gray-100 text-gray-800',
      executive: 'bg-yellow-100 text-yellow-800'
    };
    return colors[layout] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Template Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage and test AI-generated templates based on user commands
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Templates</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total_templates || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Usage</h3>
            <p className="text-3xl font-bold text-green-600">{stats.total_usage || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.avg_success_rate ? `${(stats.avg_success_rate * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Popular Type</h3>
            <p className="text-3xl font-bold text-orange-600 capitalize">
              {stats.most_popular_content_type || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Available Templates</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTemplate?.id === template.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(template.content_type)}`}>
                            {template.content_type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLayoutColor(template.layout)}`}>
                            {template.layout}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Usage: {template.usage_count || 0}</p>
                        <p className="text-sm text-gray-500">
                          Success: {template.success_rate ? `${(template.success_rate * 100).toFixed(1)}%` : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Template Testing Panel */}
          <div className="space-y-6">
            {/* Command Testing */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Template Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Command
                  </label>
                  <textarea
                    value={testCommand}
                    onChange={(e) => setTestCommand(e.target.value)}
                    placeholder="e.g., Create a modern professional resume for a software developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <button
                  onClick={testTemplate}
                  disabled={loading || !testCommand.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : 'Analyze Command'}
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Content Type</h4>
                    <p className="text-sm text-gray-600 capitalize">{analysis.contentType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Suggested Layout</h4>
                    <p className="text-sm text-gray-600 capitalize">{analysis.layout}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Sections</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.sections.map((section) => (
                        <span
                          key={section}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                  {analysis.template && (
                    <div>
                      <h4 className="font-medium text-gray-900">Selected Template</h4>
                      <p className="text-sm text-gray-600">{analysis.template.name}</p>
                    </div>
                  )}
                  <button
                    onClick={generateTemplateData}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Generate Template Data
                  </button>
                </div>
              </div>
            )}

            {/* Selected Template Details */}
            {selectedTemplate && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Details</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Name</h4>
                    <p className="text-sm text-gray-600">{selectedTemplate.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Style</h4>
                    <p className="text-sm text-gray-600">{selectedTemplate.style}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Sections</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTemplate.sections?.map((section) => (
                        <span
                          key={section}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Usage Statistics</h4>
                    <p className="text-sm text-gray-600">
                      Used {selectedTemplate.usage_count || 0} times
                    </p>
                    <p className="text-sm text-gray-600">
                      Success rate: {selectedTemplate.success_rate ? `${(selectedTemplate.success_rate * 100).toFixed(1)}%` : '0%'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Layouts Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Available Layouts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {layouts.map((layout) => (
                <div key={layout.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{layout.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{layout.content_type}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(layout.content_type)}`}>
                      {layout.content_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDashboard; 