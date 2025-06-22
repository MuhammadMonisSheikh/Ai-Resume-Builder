import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Lightbulb, ArrowLeft } from 'lucide-react';

const AICommandPortal = ({ 
  isOpen, 
  onClose, 
  fieldName, 
  currentContent = '', 
  onGenerate, 
  isLoading = false,
  context = {},
  documentType = 'resume',
  formData = {}
}) => {
  const [command, setCommand] = useState('');
  const [suggestedCommands, setSuggestedCommands] = useState([]);
  const [mode, setMode] = useState('write'); // 'write' or 'improve'
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Set mode based on whether there's existing content
      setMode(currentContent.trim() ? 'improve' : 'write');
      
      // Generate suggested commands based on field and content
      generateSuggestedCommands();
      
      // Focus the textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, currentContent, fieldName]);

  const generateSuggestedCommands = () => {
    const suggestions = {
      // Resume specific suggestions
      summary: [
        'Write a compelling professional summary',
        'Create a summary highlighting leadership experience',
        'Write a summary focused on technical skills',
        'Create a summary for a career change',
        'Write a summary emphasizing achievements'
      ],
      skills: [
        'Suggest technical skills for this role',
        'Add soft skills that complement technical abilities',
        'Include industry-specific skills',
        'Suggest skills for a senior position',
        'Add emerging technology skills'
      ],
      achievements: [
        'Write 3-5 impactful achievements',
        'Create achievements with quantifiable results',
        'Focus on leadership achievements',
        'Highlight project management successes',
        'Emphasize innovation and problem-solving'
      ],
      experience: [
        'Improve this job description with action verbs',
        'Add quantifiable results to this experience',
        'Make this description more impactful',
        'Focus on leadership and management skills',
        'Emphasize technical accomplishments'
      ],
      education: [
        'Write a compelling education section',
        'Highlight relevant coursework and projects',
        'Include academic achievements and honors',
        'Add certifications and training',
        'Emphasize research or thesis work'
      ],
      // Cover letter specific suggestions
      coverLetter: [
        'Write a compelling opening paragraph',
        'Create a strong closing paragraph',
        'Emphasize relevant experience for this role',
        'Show enthusiasm for the company',
        'Address specific job requirements'
      ],
      // Custom editor element types
      heading: [
        'Write a professional section heading',
        'Create an attention-grabbing title',
        'Write a clear and concise header',
        'Create a modern section title',
        'Write a descriptive heading'
      ],
      text: [
        'Write professional content for this section',
        'Create compelling text content',
        'Write clear and concise information',
        'Add professional descriptions',
        'Create engaging content'
      ],
      list: [
        'Create a bulleted list of key points',
        'Write a numbered list of achievements',
        'Create a skills list with categories',
        'Write a list of responsibilities',
        'Create a list of accomplishments'
      ],
      general: [
        'Write professional content for this element',
        'Create compelling text for this section',
        'Improve this content to be more professional',
        'Make this more concise and impactful',
        'Add specific examples and results'
      ],
      default: [
        'Improve this content to be more professional',
        'Make this more concise and impactful',
        'Add specific examples and results',
        'Use stronger action verbs',
        'Focus on achievements and outcomes'
      ]
    };

    const fieldSuggestions = suggestions[fieldName] || suggestions.default;
    setSuggestedCommands(fieldSuggestions);
  };

  const handleCommandClick = (suggestedCommand) => {
    setCommand(suggestedCommand);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onGenerate(command, mode);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const getFieldDisplayName = () => {
    const fieldNames = {
      summary: 'Professional Summary',
      skills: 'Skills',
      achievements: 'Achievements',
      experience: 'Experience',
      education: 'Education',
      description: 'Job Description',
      coverLetter: 'Cover Letter Content',
      heading: 'Section Heading',
      text: 'Text Content',
      list: 'List Content',
      general: 'General Content'
    };
    return fieldNames[fieldName] || fieldName;
  };

  const getModeDescription = () => {
    return mode === 'write' 
      ? 'Write new content for this field'
      : 'Improve and enhance existing content';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">AI Command Portal</h2>
                <p className="text-purple-100 text-sm">{getFieldDisplayName()} • {getModeDescription()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Content Preview (if improving) */}
          {mode === 'improve' && currentContent.trim() && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ArrowLeft className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Current Content:</span>
              </div>
              <div className="text-sm text-gray-600 bg-white rounded p-3 border">
                {currentContent}
              </div>
            </div>
          )}

          {/* Command Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {mode === 'write' ? 'What would you like me to write?' : 'How should I improve this content?'}
            </label>
            <form onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={mode === 'write' 
                  ? "e.g., 'Write a professional summary for a software engineer with 5 years of experience...'"
                  : "e.g., 'Make this more concise and add quantifiable results...'"
                }
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
              
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  Press Ctrl+Enter to submit
                </p>
                <button
                  type="submit"
                  disabled={!command.trim() || isLoading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Suggested Commands */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Quick Suggestions:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedCommands.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleCommandClick(suggestion)}
                  className="text-left p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-colors text-sm text-gray-700 hover:text-purple-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Context Information */}
          {(Object.keys(context).length > 0 || Object.keys(formData).length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Context for AI:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                {Object.keys(formData).length > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">Document Type:</span>
                      <span className="capitalize">{documentType}</span>
                    </div>
                    {formData.name && (
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>{formData.name}</span>
                      </div>
                    )}
                    {formData.jobTitle && (
                      <div className="flex justify-between">
                        <span className="font-medium">Job Title:</span>
                        <span>{formData.jobTitle}</span>
                      </div>
                    )}
                    {formData.company && (
                      <div className="flex justify-between">
                        <span className="font-medium">Company:</span>
                        <span>{formData.company}</span>
                      </div>
                    )}
                  </>
                ) : (
                  Object.entries(context).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICommandPortal; 