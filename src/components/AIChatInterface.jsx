import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Copy, Check, ThumbsUp, ThumbsDown, Upload, Globe, FileText, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

const TEMPLATE_IMAGES = {
  'classic': '/images/templates/classic.png',
  'modern': '/images/templates/modern.png',
  'minimal': '/images/templates/minimal.png',
  'creative': '/images/templates/creative.png',
  'executive': '/images/templates/executive.png',
  'tech': '/images/templates/tech.png',
  // Add more mappings as needed
};

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'zh', label: '中文' },
  // Add more as needed
];

const AIChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [feedback, setFeedback] = useState({}); // { messageId: 'up' | 'down' }
  const [userPreferences, setUserPreferences] = useState(() => {
    // Try to load from localStorage
    try {
      return JSON.parse(localStorage.getItem('userPreferences')) || {};
    } catch {
      return {};
    }
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('chatLanguage') || 'en';
    } catch {
      return 'en';
    }
  });
  const [jobDescription, setJobDescription] = useState(() => {
    try {
      return localStorage.getItem('jobDescription') || '';
    } catch {
      return '';
    }
  });
  const [parsedResume, setParsedResume] = useState(null); // { name, email, skills }
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Analytics state
  const [analytics, setAnalytics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chatAnalytics')) || { userMessages: 0, aiMessages: 0, feedbackUp: 0, feedbackDown: 0 };
    } catch {
      return { userMessages: 0, aiMessages: 0, feedbackUp: 0, feedbackDown: 0 };
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
    
    // Welcome message
    const welcomeMessage = {
      id: 'welcome',
      type: 'ai',
      content: `Hello! I'm your AI resume assistant. I can help you with resumes, cover letters, templates, and career advice. Just type your request or command!`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Helper to convert messages to OpenAI format
  const getOpenAIMessages = () => {
    return messages
      .filter(m => m.type === 'user' || m.type === 'ai')
      .map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }));
  };

  // Generate or retrieve a userId for analytics
  function getUserId() {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = Math.random().toString(36).substring(2, 12);
      localStorage.setItem('userId', id);
    }
    return id;
  }

  const sendAnalyticsEvent = async (eventType, data = {}) => {
    try {
      await fetch('/.netlify/functions/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          timestamp: new Date().toISOString(),
          userId: getUserId(),
          ...data
        })
      });
    } catch (e) {
      // Fail silently for now
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    sendAnalyticsEvent('user_message', { message: inputMessage });
    try {
      // Prepare chat history for backend
      const chatHistory = [...getOpenAIMessages(), { role: 'user', content: inputMessage }];
      const body = {
        messages: chatHistory,
        userPreferences,
        language,
        jobDescription,
        parsedResume
      };
      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I'm having trouble processing your request right now. Please try again soon.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId, value) => {
    setFeedback(prev => ({ ...prev, [messageId]: value }));
    sendAnalyticsEvent('feedback', { feedback: value, message: messages.find(m => m.id === messageId)?.content || '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'user',
          content: `Uploaded resume: ${file.name}\n\n${text.substring(0, 1000)}...`,
          timestamp: new Date()
        }]);
        // Basic parsing for TXT
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const nameMatch = text.match(/name[:\-\s]+([a-zA-Z ]+)/i);
          const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          const skillsMatch = text.match(/skills[:\-\s]+([a-zA-Z, ]+)/i);
          setParsedResume({
            name: nameMatch ? nameMatch[1].trim() : '',
            email: emailMatch ? emailMatch[0] : '',
            skills: skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()) : []
          });
        } else {
          setParsedResume(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setUserPreferences(prev => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem('userPreferences', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem('chatLanguage', e.target.value);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
    localStorage.setItem('jobDescription', e.target.value);
  };

  // Try to extract template name from AI message and show preview if available
  const getTemplateImage = (content) => {
    const match = content.match(/template: ([a-zA-Z0-9-_]+)/i);
    if (match) {
      const key = match[1].toLowerCase();
      return TEMPLATE_IMAGES[key] || null;
    }
    // Fallback: look for known template names
    for (const key in TEMPLATE_IMAGES) {
      if (content.toLowerCase().includes(key)) return TEMPLATE_IMAGES[key];
    }
    return null;
  };

  const copyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Export chat as text
  const handleExportText = () => {
    const text = messages.map(m => `${m.type === 'user' ? 'You' : 'AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export chat as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(12);
    messages.forEach((m, idx) => {
      const prefix = m.type === 'user' ? 'You: ' : 'AI: ';
      const lines = doc.splitTextToSize(prefix + m.content, 180);
      lines.forEach(line => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += 8;
      });
      y += 4;
    });
    doc.save('chat.pdf');
  };

  // Update analytics on message send/receive
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    setAnalytics(prev => {
      let updated = { ...prev };
      if (last.type === 'user') updated.userMessages += 1;
      if (last.type === 'ai') updated.aiMessages += 1;
      localStorage.setItem('chatAnalytics', JSON.stringify(updated));
      return updated;
    });
  }, [messages]);

  // Update analytics on feedback
  useEffect(() => {
    let up = 0, down = 0;
    Object.values(feedback).forEach(val => {
      if (val === 'up') up++;
      if (val === 'down') down++;
    });
    setAnalytics(prev => {
      const updated = { ...prev, feedbackUp: up, feedbackDown: down };
      localStorage.setItem('chatAnalytics', JSON.stringify(updated));
      return updated;
    });
  }, [feedback]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
        role="dialog" aria-modal="true" aria-label="AI Chat Assistant">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-500">Chat with your AI assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4 text-gray-500" aria-hidden="true" />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="border rounded px-2 py-1 text-xs"
                title="Select language"
                aria-label="Select language"
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Export buttons */}
            <button
              onClick={handleExportText}
              className="p-1 text-gray-500 hover:text-blue-600"
              title="Export chat as text"
              aria-label="Export chat as text"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleExportPDF}
              className="p-1 text-gray-500 hover:text-blue-600"
              title="Export chat as PDF"
              aria-label="Export chat as PDF"
            >
              <FileDown className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Preferences & File Upload */}
        <div className="flex flex-wrap gap-4 p-4 border-b border-gray-100 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Template Style:</label>
            <select
              name="templateStyle"
              value={userPreferences.templateStyle || ''}
              onChange={handlePreferenceChange}
              className="border rounded px-2 py-1 text-xs"
            >
              <option value="">Any</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="creative">Creative</option>
              <option value="executive">Executive</option>
              <option value="tech">Tech</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Job Type:</label>
            <input
              name="jobType"
              value={userPreferences.jobType || ''}
              onChange={handlePreferenceChange}
              className="border rounded px-2 py-1 text-xs"
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="resume-upload" className="text-xs text-gray-600 cursor-pointer flex items-center gap-1">
              <Upload className="h-4 w-4" /> Upload Resume
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            {resumeFile && <span className="text-xs text-green-600">{resumeFile.name}</span>}
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-600" htmlFor="job-desc">Paste Job Description:</label>
            <textarea
              id="job-desc"
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs mt-1"
              rows={2}
              placeholder="Paste the job description here for tailored advice"
              aria-label="Paste job description"
            />
          </div>
        </div>

        {/* Parsed Resume Info */}
        {parsedResume && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-700">
            <div><b>Extracted from Resume:</b></div>
            {parsedResume.name && <div>Name: {parsedResume.name}</div>}
            {parsedResume.email && <div>Email: {parsedResume.email}</div>}
            {parsedResume.skills && parsedResume.skills.length > 0 && <div>Skills: {parsedResume.skills.join(', ')}</div>}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" tabIndex={0} aria-label="Chat messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
                tabIndex={0}
                aria-label={message.type === 'user' ? 'Your message' : 'AI message'}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <Bot className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" aria-hidden="true" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {/* Template preview if available */}
                    {message.type === 'ai' && getTemplateImage(message.content) && (
                      <div className="mt-2">
                        <img
                          src={getTemplateImage(message.content)}
                          alt="Template Preview"
                          className="rounded border w-40 shadow"
                        />
                        <div className="text-xs text-gray-500 mt-1">Template Preview</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Message Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyMessage(message.id, message.content)}
                        className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                        title="Copy message"
                        aria-label="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <Copy className="h-3 w-3" aria-hidden="true" />
                        )}
                      </button>
                      {/* Feedback buttons */}
                      <button
                        onClick={() => handleFeedback(message.id, 'up')}
                        className={`text-xs ${feedback[message.id] === 'up' ? 'text-green-600' : 'text-gray-400'} hover:text-green-600`}
                        title="Helpful"
                        aria-label="Mark as helpful"
                      >
                        <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, 'down')}
                        className={`text-xs ${feedback[message.id] === 'down' ? 'text-red-600' : 'text-gray-400'} hover:text-red-600`}
                        title="Not helpful"
                        aria-label="Mark as not helpful"
                      >
                        <ThumbsDown className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                aria-label="Type your message"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {/* Analytics summary */}
        <div className="p-2 border-t border-gray-100 text-xs text-gray-500 bg-gray-50 flex flex-wrap gap-4 justify-between">
          <div>
            <b>Analytics:</b> You: {analytics.userMessages} | AI: {analytics.aiMessages} | 👍 {analytics.feedbackUp} | 👎 {analytics.feedbackDown}
          </div>
          <div className="hidden sm:block">AI Resume Assistant &copy; {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface; 