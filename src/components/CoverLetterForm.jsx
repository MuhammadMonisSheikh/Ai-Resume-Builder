import React, { useState, useEffect } from 'react';
import { FileText, Loader2, CheckCircle, X, Target, Lightbulb } from 'lucide-react';
import CoverLetterPreview from './CoverLetterPreview';
import Modal from './Modal';

const coverLetterTemplates = [
    { id: 'modern', name: 'Modern', description: 'A clean, modern design with a clear header.' },
    { id: 'classic', name: 'Classic', description: 'A timeless, traditional format for formal applications.' },
    { id: 'professional', name: 'Professional', description: 'A bold design with a color header to stand out.' },
    { id: 'minimalist', name: 'Minimalist', description: 'A simple, elegant design with plenty of white space.' },
];

const CoverLetterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    experience: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [keywordAnalysis, setKeywordAnalysis] = useState({ matches: [], missing: [] });
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
    const content = generateCoverLetterHTML(formData, selectedTemplate);
    setGeneratedCoverLetter(content);
  }, [formData, selectedTemplate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        setGeneratedCoverLetter(generateCoverLetterHTML(formData, selectedTemplate));
        setShowPreviewModal(true);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTemplatePreview = (template) => {
    setPreviewTemplate(template);
    setShowTemplateModal(true);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setShowTemplateModal(false);
  };

  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setGeneratedCoverLetter('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Form Section */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">ATS-Friendly Cover Letter</h2>
          </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select a Template</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coverLetterTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    onClick={() => handleTemplatePreview(template)} 
                    className={`cursor-pointer border-2 ${selectedTemplate === template.id ? 'border-green-500' : 'border-gray-200'} rounded-lg p-2 hover:border-green-400 transition-all relative group bg-gray-50`}
                  >
                    <img src={`/images/templates/cover-letter-${template.id}.png`} alt={template.name} className="w-full h-auto rounded-md bg-white shadow-sm" onError={(e) => e.target.src = '/images/templates/placeholder.png'}/>
                    <p className="text-center text-xs mt-2 font-semibold text-gray-600">{template.name}</p>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 rounded-md">
                      <span className="text-white font-bold opacity-0 group-hover:opacity-100">Preview</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience & Skills</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={8}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Describe your relevant experience and skills, making sure to include keywords from the job description."
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

      {/* Template Preview Modal */}
      {showTemplateModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-800">{previewTemplate.name}</h3>
                  <button onClick={() => setShowTemplateModal(false)} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="bg-gray-100 p-2 rounded-lg">
                <img src={`/images/templates/cover-letter-${previewTemplate.id}.png`} alt={`${previewTemplate.name} Preview`} className="w-full h-auto rounded-md shadow-md bg-white" onError={(e) => e.target.src = '/images/templates/placeholder.png'}/>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Description</h4>
                  <p className="text-gray-600 text-sm">{previewTemplate.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end items-center gap-4">
              <button onClick={() => setShowTemplateModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={() => handleTemplateSelect(previewTemplate.id)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                Select this Template
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal 
        isOpen={showPreviewModal} 
        onClose={handleCloseModal} 
        title="Your Generated Cover Letter"
      >
        <CoverLetterPreview content={generatedCoverLetter} />
      </Modal>
    </div>
  );
};

export default CoverLetterForm;