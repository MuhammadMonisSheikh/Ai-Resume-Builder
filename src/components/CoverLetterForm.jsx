import React, { useState, useEffect, useRef } from 'react';
import { FileText, Loader2, CheckCircle, X, Target, Lightbulb, Sparkles, Code, Lock } from 'lucide-react';
import CoverLetterPreview from './CoverLetterPreview';
import Modal from './Modal';
import { usePWA } from '../hooks/usePWA';
import CustomEditor from './CustomEditor';
import AICommandPortal from './AICommandPortal';
import { useAuth } from '../contexts/AuthContext';

const CoverLetterForm = () => {
  const { saveOfflineData, getOfflineData } = usePWA();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    experience: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [keywordAnalysis, setKeywordAnalysis] = useState({ matches: [], missing: [] });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [showAICommandPortal, setShowAICommandPortal] = useState(false);
  const [aiCommandField, setAiCommandField] = useState('');
  const previewRef = useRef(null);

  const generateCoverLetterHTML = (data, templateId) => {
    const { name, email, jobTitle, companyName, experience } = data;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    switch(templateId) {
      case 'classic':
        return `
          <style>
            .cl-classic { font-family: serif; font-size: 12pt; line-height: 1.5; }
            .cl-classic .sender-info { text-align: right; }
            .cl-classic .recipient-info { margin-top: 30px; }
            .cl-classic .body { margin-top: 30px; }
          </style>
          <div class="cl-classic">
            <div class="sender-info">
              <strong>${name || 'Your Name'}</strong><br/>
              ${email || 'your.email@example.com'}
            </div>
            <div class="date" style="margin-top: 30px;">${today}</div>
            <div class="recipient-info">
              Hiring Manager<br/>
              <strong>${companyName || 'Company Name'}</strong>
            </div>
            <div class="body">
              <p>Dear Hiring Manager,</p>
              <p>${experience || 'Your experience...'}</p>
              <p>Sincerely,<br/>${name || 'Your Name'}</p>
            </div>
          </div>
        `;
      case 'professional':
        return `
          <style>
            .cl-professional { font-family: sans-serif; }
            .cl-professional .header { background-color: #2563EB; color: white; padding: 20px; }
            .cl-professional .header h2 { font-size: 24px; margin: 0; }
            .cl-professional .body { padding: 20px; }
          </style>
          <div class="cl-professional">
            <div class="header"><h2>${name || 'Your Name'}</h2></div>
            <div class="body">
              <p><strong>To:</strong> Hiring Manager, ${companyName || 'Company Name'}</p>
              <p><strong>Date:</strong> ${today}</p>
              <br/>
              <p>${experience || 'Your experience...'}</p>
              <br/>
              <p>Sincerely,<br/>${name || 'Your Name'}</p>
            </div>
          </div>
        `;
      case 'minimalist':
        return `
          <style>
            .cl-minimalist { font-family: sans-serif; text-align: center; }
            .cl-minimalist .header { margin-bottom: 40px; }
            .cl-minimalist .name { font-size: 28px; letter-spacing: 4px; }
            .cl-minimalist .title { color: #888; }
            .cl-minimalist .body { text-align: left; max-width: 600px; margin: auto; }
          </style>
          <div class="cl-minimalist">
            <div class="header">
              <div class="name">${name || 'Your Name'}</div>
              <div class="title">${jobTitle || 'Your Title'}</div>
            </div>
            <div class="body">
              <p>Dear Hiring Manager,</p>
              <p>${experience || 'Your experience...'}</p>
              <p>Sincerely,<br/>${name || 'Your Name'}</p>
            </div>
          </div>
        `;
      case 'modern':
      default:
        return `
          <style>
            .cl-modern { font-family: sans-serif; }
            .cl-modern .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E5E7EB; padding-bottom: 15px; }
            .cl-modern .name { font-size: 28px; font-weight: bold; }
            .cl-modern .contact-info { text-align: right; color: #4B5563; }
            .cl-modern .body { margin-top: 20px; line-height: 1.6; }
          </style>
          <div class="cl-modern">
            <div class="header">
              <div>
                <div class="name">${name || 'Your Name'}</div>
                <div>${jobTitle || 'Your Title'}</div>
              </div>
              <div class="contact-info">
                ${email || 'your.email@example.com'}
              </div>
            </div>
            <div class="body">
              <p><strong>${today}</strong></p>
              <p>Hiring Manager<br/><strong>${companyName || 'Company Name'}</strong></p>
              <br/>
              <p>${experience || 'Your experience...'}</p>
              <br/>
              <p>Sincerely,<br/>${name || 'Your Name'}</p>
            </div>
          </div>
        `;
    }
  }

  useEffect(() => {
    const analyzeKeywords = () => {
        if (!formData.jobDescription || !formData.experience) {
            setKeywordAnalysis({ matches: [], missing: [] });
            return;
        }

        const jobDescWords = new Set(formData.jobDescription.toLowerCase().match(/\b(\w+)\b/g) || []);
        const experienceWords = new Set(formData.experience.toLowerCase().match(/\b(\w+)\b/g) || []);
        
        const commonWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'i', 'you', 'me', 'my', 'is', 'are', 'was', 'were']);
        
        const relevantKeywords = [...jobDescWords].filter(word => !commonWords.has(word) && isNaN(word));
        
        const matches = relevantKeywords.filter(keyword => experienceWords.has(keyword));
        const missing = relevantKeywords.filter(keyword => !experienceWords.has(keyword));

        setKeywordAnalysis({ matches: matches.slice(0, 5), missing: missing.slice(0, 5) });
    };

    const debounce = setTimeout(analyzeKeywords, 500);
    return () => clearTimeout(debounce);
  }, [formData.jobDescription, formData.experience]);

  useEffect(() => {
    const content = generateCoverLetterHTML(formData, 'modern');
    setGeneratedCoverLetter(content);
  }, [formData]);

  // Load saved form data on mount
  useEffect(() => {
    const saved = getOfflineData('coverLetterForm');
    if (saved) setFormData(saved);
  }, []);

  // Auto-save on change
  useEffect(() => {
    saveOfflineData('coverLetterForm', formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAiGeneratedContent('');
    
    // Create a comprehensive prompt for dynamic cover letter design generation
    const industry = formData.companyName ? 'Target company: ' + formData.companyName : 'General application';
    const jobType = formData.jobTitle ? 'Position: ' + formData.jobTitle : 'Professional position';
    const hasExperience = formData.experience ? 'User has provided detailed experience and skills.' : 'User needs to add more experience details.';
    
    const prompt = `Generate a professional, modern cover letter in HTML with dynamic design that adapts to the content and industry.

Requirements:
- ${jobType}
- ${industry}
- ${hasExperience}

Design Guidelines:
1. Choose colors and styling that match the industry (tech=blue/purple, healthcare=green/blue, finance=navy/gold, etc.)
2. Create a modern, clean layout with professional typography
3. Use appropriate spacing and visual hierarchy
4. Include responsive design for mobile devices
5. Make the cover letter engaging and visually appealing
6. Use professional color schemes and subtle gradients
7. Include proper letter formatting with date, address, and signature sections
8. Highlight key skills and experience prominently
9. Use modern CSS with clean, readable fonts
10. Ensure the design complements the content length and type

User Data: ${JSON.stringify(formData)}

Generate a complete HTML cover letter with embedded CSS that looks professional and modern. The design should be visually appealing while maintaining readability and professionalism.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.8
      })
    });
    const result = await response.json();
    setAiGeneratedContent(result.choices?.[0]?.message?.content || 'AI failed to generate content.');
    setShowPreviewModal(true);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setGeneratedCoverLetter('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiGeneratedContent);
  };

  const handleAISuggest = async () => {
    setAiCommandField('experience');
    setShowAICommandPortal(true);
  };

  const handleAICommandGenerate = async (command, mode) => {
    setShowAICommandPortal(false);
    setAiLoading(true);
    
    let prompt;
    const currentContent = formData.experience || '';
    
    if (mode === 'write') {
      // Writing new content
      prompt = `${command}\n\nContext: ${JSON.stringify(formData)}\n\nGenerate professional content for the experience section of a cover letter.`;
    } else {
      // Improving existing content
      prompt = `${command}\n\nCurrent content: ${currentContent}\n\nContext: ${JSON.stringify(formData)}\n\nImprove and enhance the existing content for a cover letter.`;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      const result = await response.json();
      const suggestion = result.choices?.[0]?.message?.content || '';
      setFormData(prev => ({ ...prev, experience: suggestion }));
    } catch (e) {
      alert('AI suggestion failed. Please try again.');
    }
    
    setAiLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">ATS-Friendly Cover Letter</h2>
            </div>

            {/* Load button above the form */}
            <button
              type="button"
              className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
              onClick={() => {
                const saved = getOfflineData('coverLetterForm');
                if (saved) {
                  setFormData(saved);
                  alert('Loaded last saved cover letter!');
                } else {
                  alert('No saved cover letter found.');
                }
              }}
            >
              Load Last Saved
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your full name"
                  spellCheck={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="your.email@example.com"
                  spellCheck={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Software Developer"
                  spellCheck={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Company Name"
                  spellCheck={true}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Paste the job description here for keyword analysis..."
                spellCheck={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Your Experience & Skills
                <button
                  type="button"
                  className="ml-2 px-2 py-1 bg-gray-100 text-gray-500 rounded flex items-center gap-1 text-xs cursor-not-allowed"
                  disabled
                  title="Sign in to use AI suggestions"
                >
                  <Lock className="h-4 w-4" />
                  AI Suggest
                </button>
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={8}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Describe your relevant experience and skills, making sure to include keywords from the job description."
                spellCheck={true}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating Cover Letter...</span>
                </div>
              ) : (
                'Generate AI Cover Letter'
              )}
            </button>

            {/* Custom Editor Option */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Code className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-purple-800 mb-1">Want More Control?</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Use our custom editor to drag & drop elements, edit code, and create your perfect cover letter from scratch.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCustomEditor(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <Code className="h-4 w-4" />
                    <span>Open Custom Editor</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Sidebar Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-yellow-500"/> ATS Optimization Tips</h3>
                  
                  {keywordAnalysis.matches.length > 0 && (
                      <div className="mb-4">
                          <h4 className="font-semibold text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-2"/>Matched Keywords</h4>
                          <div className="flex flex-wrap gap-1 mt-2">
                              {keywordAnalysis.matches.map(k => <span key={k} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{k}</span>)}
                          </div>
                      </div>
                  )}

                  {keywordAnalysis.missing.length > 0 && (
                      <div>
                          <h4 className="font-semibold text-red-600 flex items-center"><Target className="h-4 w-4 mr-2"/>Missing Keywords</h4>
                          <p className="text-xs text-gray-500 mb-2">Try to include these in your text:</p>
                          <div className="flex flex-wrap gap-1">
                              {keywordAnalysis.missing.map(k => <span key={k} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{k}</span>)}
                          </div>
                      </div>
                  )}
                  
                  {(keywordAnalysis.matches.length === 0 && keywordAnalysis.missing.length === 0) && (
                      <p className="text-sm text-gray-500">Start typing your experience to see keyword analysis.</p>
                  )}
              </div>
          </div>
        </div>

        <Modal 
          isOpen={showPreviewModal} 
          onClose={handleCloseModal} 
          title="Your Generated Cover Letter"
        >
          <div className="flex justify-end mb-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm mr-2"
            >Copy</button>
          </div>
          <div ref={previewRef} dangerouslySetInnerHTML={{ __html: aiGeneratedContent }} className="bg-white rounded-xl shadow-lg p-4" />
          {aiLoading && <div className="text-center py-4">Generating with AI...</div>}
        </Modal>

        {/* Custom Editor */}
        {showCustomEditor && (
          <CustomEditor
            formData={formData}
            onClose={() => setShowCustomEditor(false)}
            documentType="cover-letter"
          />
        )}

        {/* AI Command Portal */}
        {showAICommandPortal && (
          <AICommandPortal
            isOpen={showAICommandPortal}
            onClose={() => setShowAICommandPortal(false)}
            fieldName={aiCommandField}
            currentContent={formData[aiCommandField] || ''}
            onGenerate={handleAICommandGenerate}
            isLoading={aiLoading}
            context={{
              'Job Title': formData.jobTitle || 'Not specified',
              'Company': formData.companyName || 'Not specified',
              'Job Description': formData.jobDescription ? formData.jobDescription.substring(0, 100) + '...' : 'Not specified'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CoverLetterForm;