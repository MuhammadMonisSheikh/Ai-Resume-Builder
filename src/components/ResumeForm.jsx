// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

// ResumeForm component - Auth system removed
import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, GraduationCap, Award, Loader2, Target, FileText, CheckCircle, Star, Lightbulb, TrendingUp, ChevronDown, Plus, X, Monitor, Smartphone, Sparkles, Code, Lock } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useNavigate } from 'react-router-dom';
import ResumePreview from './ResumePreview';
import Modal from './Modal';
import CustomEditor from './CustomEditor';
import AICommandPortal from './AICommandPortal';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import AdPlaceholder from './AdPlaceholder';

const ResumeForm = () => {
  const { saveOfflineData, getOfflineData, isOnline } = usePWA();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    location: user ? user.location : '',
    linkedin: '',
    jobTitle: '',
    targetIndustry: '',
    experienceLevel: 'entry',
    skills: '',
    education: '',
    experience: [
      {
        jobTitle: '',
        company: '',
        dates: '',
        description: ''
      }
    ],
    strengths: '',
    languages: [
      { name: 'English', level: 5 }
    ],
    certifications: '',
    conferences: '',
    jobDescription: '',
    achievements: '',
    summary: '',
    hobbies: '',
    references: '',
    photo: ''
  });

  const [atsScore, setAtsScore] = useState(0);
  const [keywordMatches, setKeywordMatches] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [showKeywordAnalysis, setShowKeywordAnalysis] = useState(false);
  const [resumeLength, setResumeLength] = useState({ words: 0, characters: 0 });
  const [lengthFeedback, setLengthFeedback] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatedResumeData, setGeneratedResumeData] = useState(null);
  const [previewMode, setPreviewMode] = useState('Desktop');
  const [aiLoading, setAiLoading] = useState({ summary: false, achievements: false, skills: false, ai: false });
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');
  const [designPreference, setDesignPreference] = useState('auto');
  const [generationCount, setGenerationCount] = useState(1);
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [showAICommandPortal, setShowAICommandPortal] = useState(false);
  const [aiCommandField, setAiCommandField] = useState('');
  const [aiCommandIndex, setAiCommandIndex] = useState(null);
  const previewRef = useRef(null);

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = getOfflineData('resumeForm');
    if (savedData) {
      setFormData(savedData);
      calculateResumeLength();
    }
  }, []);

  // ATS-friendly industries
  const industries = [
    'Technology/Software',
    'Healthcare',
    'Finance/Banking',
    'Education',
    'Marketing/Advertising',
    'Sales',
    'Engineering',
    'Design/Creative',
    'Consulting',
    'Manufacturing',
    'Retail',
    'Non-profit',
    'Government',
    'Other'
  ];

  // Common ATS keywords by industry
  const industryKeywords = {
    'Technology/Software': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Agile', 'Git', 'API', 'DevOps'],
    'Healthcare': ['Patient Care', 'HIPAA', 'Electronic Health Records', 'Clinical', 'Medical Terminology', 'CPR', 'Vital Signs'],
    'Finance/Banking': ['Financial Analysis', 'Excel', 'Risk Management', 'Compliance', 'Accounting', 'QuickBooks', 'Audit'],
    'Education': ['Curriculum Development', 'Student Assessment', 'Classroom Management', 'Lesson Planning', 'Educational Technology'],
    'Marketing/Advertising': ['Digital Marketing', 'SEO', 'Social Media', 'Google Analytics', 'Content Creation', 'Campaign Management']
  };

  // Action verbs for achievements
  const actionVerbs = [
    'Developed', 'Implemented', 'Managed', 'Led', 'Created', 'Improved', 'Increased', 'Reduced', 'Designed', 'Coordinated',
    'Analyzed', 'Optimized', 'Streamlined', 'Launched', 'Generated', 'Maintained', 'Trained', 'Mentored', 'Collaborated', 'Delivered'
  ];

  // Notification for login required using react-toastify
  function notifyLoginRequired() {
    toast.info('Please create an account or log in first!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      notifyLoginRequired();
      return;
    }
    calculateATSScore();
    saveOfflineData('resumeForm', formData);
    if (!isOnline) {
      alert("You're currently offline. Your resume will be generated when you're back online.");
      saveOfflineData('pendingResume', formData);
      return;
    }
    setIsLoading(true);
    setAiGeneratedContent('');
    
    // Create a comprehensive prompt for dynamic design generation
    const hasImage = formData.photo ? 'User has uploaded a profile photo that should be included in the design.' : 'No profile photo provided.';
    const experienceLevel = formData.experienceLevel;
    const industry = formData.targetIndustry;
    const hasCertifications = formData.certifications ? 'User has certifications that should be highlighted.' : '';
    const hasLanguages = formData.languages && formData.languages.length > 1 ? 'User has multiple languages that should be featured.' : '';
    const hasAchievements = formData.achievements ? 'User has specific achievements that should be prominently displayed.' : '';
    
    // Design style instructions based on preference
    const designStyleInstructions = {
      'auto': 'Choose the most appropriate design style based on the industry and content.',
      'modern': 'Use a modern, clean design with contemporary typography and subtle gradients.',
      'professional': 'Use a traditional, professional design with conservative colors and layout.',
      'creative': 'Use a creative, colorful design with bold colors and artistic elements.',
      'minimalist': 'Use a minimalist design with lots of white space and simple typography.',
      'tech': 'Use a tech-focused design with blue/purple colors and modern tech aesthetics.'
    };
    
    const prompt = `Generate ${generationCount} professional, modern resume${generationCount > 1 ? 's' : ''} in HTML with dynamic design that adapts to the content. 

Requirements:
- Job Title: ${formData.jobTitle}
- Experience Level: ${experienceLevel}
- Industry: ${industry}
- Design Style: ${designStyleInstructions[designPreference]}
- ${hasImage}
- ${hasCertifications}
- ${hasLanguages}
- ${hasAchievements}

Design Guidelines:
1. If user has a photo, create a layout that incorporates the image professionally (sidebar or header placement)
2. Choose colors and styling that match the industry (tech=blue/purple, healthcare=green/blue, finance=navy/gold, etc.)
3. Adapt layout based on content length and type
4. Use modern, clean typography and spacing
5. Make it ATS-friendly with clear section headers
6. Include responsive design for mobile devices
7. Use professional color schemes and gradients
8. If user has many skills, use a grid or tag layout
9. If user has achievements, make them stand out with icons or special formatting
10. Include the user's photo as a base64 image if provided: ${formData.photo ? 'data:image/jpeg;base64,' + formData.photo.split(',')[1] : 'No image'}
11. Follow the design style preference: ${designStyleInstructions[designPreference]}

${generationCount > 1 ? `Generate ${generationCount} different design variations. Each should be clearly separated with a comment like <!-- DESIGN 1 -->, <!-- DESIGN 2 -->, etc.` : ''}

User Data: ${JSON.stringify(formData)}

Generate complete HTML resume${generationCount > 1 ? 's' : ''} with embedded CSS that look${generationCount > 1 ? '' : 's'} professional and modern. Include all the user's information in an organized, visually appealing layout.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: generationCount > 1 ? 3000 : 2000,
        temperature: 0.8
      })
    });
    const result = await response.json();
    setAiGeneratedContent(result.choices?.[0]?.message?.content || 'AI failed to generate content.');
    setShowPreviewModal(true);
    setIsLoading(false);
  };

  const handleCreateAnother = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      jobTitle: '',
      targetIndustry: '',
      experienceLevel: 'entry',
      skills: '',
      education: '',
      experience: [
        {
          jobTitle: '',
          company: '',
          dates: '',
          description: ''
        }
      ],
      strengths: '',
      languages: [
        { name: 'English', level: 5 }
      ],
      certifications: '',
      conferences: '',
      jobDescription: '',
      achievements: '',
      summary: '',
      hobbies: '',
      references: '',
      photo: ''
    });
  };

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    
    setFormData(newFormData);
    
    // Save form data offline
    saveOfflineData('resumeForm', newFormData);
    
    // Calculate length when content changes
    setTimeout(() => calculateResumeLength(), 100);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB. Please choose a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a canvas to compress the image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set maximum dimensions
          const maxWidth = 300;
          const maxHeight = 300;
          
          let { width, height } = img;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
          
          setFormData(prev => ({ ...prev, photo: compressedImage }));
          saveOfflineData('resumeForm', { ...formData, photo: compressedImage });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
    saveOfflineData('resumeForm', { ...formData, photo: '' });
  };

  const calculateATSScore = () => {
    let score = 0;
    const matches = [];
    const missing = [];

    // Check for required fields
    if (formData.name) score += 10;
    if (formData.email) score += 10;
    if (formData.phone) score += 10;
    if (formData.location) score += 10;
    if (formData.jobTitle) score += 10;
    if (formData.skills) score += 15;
    if (formData.education) score += 15;
    if (formData.experience) score += 20;

    // Check for keyword matches if job description is provided
    if (formData.jobDescription && formData.targetIndustry) {
      const keywords = industryKeywords[formData.targetIndustry] || [];
      const jobDescLower = formData.jobDescription.toLowerCase();
      const skillsLower = formData.skills.toLowerCase();

      keywords.forEach(keyword => {
        if (jobDescLower.includes(keyword.toLowerCase()) && skillsLower.includes(keyword.toLowerCase())) {
          matches.push(keyword);
          score += 2;
        } else if (jobDescLower.includes(keyword.toLowerCase()) && !skillsLower.includes(keyword.toLowerCase())) {
          missing.push(keyword);
        }
      });

      // Extract additional keywords from job description
      const commonKeywords = [
        'management', 'leadership', 'communication', 'teamwork', 'problem solving',
        'analytical', 'strategic', 'planning', 'organization', 'time management',
        'customer service', 'sales', 'marketing', 'development', 'design',
        'testing', 'quality assurance', 'project management', 'agile', 'scrum',
        'database', 'cloud', 'security', 'networking', 'mobile', 'web',
        'machine learning', 'artificial intelligence', 'data analysis', 'research'
      ];

      commonKeywords.forEach(keyword => {
        if (jobDescLower.includes(keyword) && !skillsLower.includes(keyword) && !missing.includes(keyword)) {
          missing.push(keyword);
        }
      });
    }

    setAtsScore(Math.min(score, 100));
    setKeywordMatches(matches);
    setMissingKeywords(missing);
    setKeywordSuggestions(missing.slice(0, 5)); // Show top 5 suggestions
  };

  const analyzeJobDescription = () => {
    if (formData.jobDescription) {
      calculateATSScore();
      setShowKeywordAnalysis(true);
    }
  };

  const calculateResumeLength = () => {
    const allText = [
      formData.name,
      formData.jobTitle,
      formData.skills,
      formData.education,
      formData.experience,
      formData.achievements,
      formData.certifications
    ].join(' ');

    const words = allText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = allText.length;

    setResumeLength({ words, characters });

    // Provide feedback based on length
    if (words < 200) {
      setLengthFeedback('Your resume is quite short. Consider adding more details about your experience and achievements.');
    } else if (words > 800) {
      setLengthFeedback('Your resume is quite long. Consider condensing to keep it concise and focused.');
    } else {
      setLengthFeedback('Good length! Your resume has an appropriate amount of content.');
    }
  };

  const getATSFeedback = () => {
    if (atsScore >= 80) return { color: 'text-green-600', message: 'Excellent ATS compatibility!' };
    if (atsScore >= 60) return { color: 'text-yellow-600', message: 'Good ATS compatibility. Consider adding more keywords.' };
    return { color: 'text-red-600', message: 'Needs improvement for ATS optimization.' };
  };

  const feedback = getATSFeedback();

  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setGeneratedResumeData(null);
  };

  const handleAISuggest = (field, index = null) => {
    setAiCommandField(field);
    setAiCommandIndex(index);
    setShowAICommandPortal(true);
  };

  const handleAICommandGenerate = async (command, mode) => {
    setShowAICommandPortal(false);
    setAiLoading(prev => ({ ...prev, [aiCommandField + (aiCommandIndex !== null ? '_' + aiCommandIndex : '')]: true }));
    
    let prompt;
    const currentContent = aiCommandIndex !== null 
      ? formData.experience[aiCommandIndex]?.description || ''
      : formData[aiCommandField] || '';
    
    if (mode === 'write') {
      // Writing new content
      prompt = `${command}\n\nContext: ${JSON.stringify(formData)}\n\nGenerate professional content for the ${aiCommandField} field.`;
    } else {
      // Improving existing content
      prompt = `${command}\n\nCurrent content: ${currentContent}\n\nContext: ${JSON.stringify(formData)}\n\nImprove and enhance the existing content.`;
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
      
      if (aiCommandIndex !== null) {
        const newExperience = [...formData.experience];
        newExperience[aiCommandIndex].description = suggestion;
        setFormData({ ...formData, experience: newExperience });
      } else {
        setFormData(prev => ({ ...prev, [aiCommandField]: suggestion }));
      }
    } catch (e) {
      alert('AI suggestion failed. Please try again.');
    }
    
    setAiLoading(prev => ({ ...prev, [aiCommandField + (aiCommandIndex !== null ? '_' + aiCommandIndex : '')]: false }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiGeneratedContent);
  };

  // Modified Custom Editor open to require login
  const handleOpenCustomEditor = () => {
    if (!isAuthenticated) {
      notifyLoginRequired();
      return;
    }
    setShowCustomEditor(true);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              spellCheck={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="your.email@example.com"
              spellCheck={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="+1 (555) 123-4567"
              spellCheck={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="City, State"
              spellCheck={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://linkedin.com/in/yourprofile"
              spellCheck={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Software Developer"
              spellCheck={true}
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <button
            type="button"
            onClick={() => handleAISuggest('summary')}
            className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200"
          >
            <Sparkles className="h-3 w-3" />
            <span>AI Suggest</span>
          </button>
        </div>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Write a brief summary about yourself..."
        ></textarea>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="achievements" className="block text-sm font-medium text-gray-700">
            Achievements
          </label>
          <button
            type="button"
            onClick={() => handleAISuggest('achievements')}
            className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200"
          >
            <Sparkles className="h-3 w-3" />
            <span>AI Suggest</span>
          </button>
        </div>
        <textarea
          id="achievements"
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="List your key achievements..."
        ></textarea>
      </div>

      {/* Industry and Experience */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Industry *</label>
            <select
              name="targetIndustry"
              value={formData.targetIndustry}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6+ years)</option>
              <option value="executive">Executive Level (10+ years)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Skills & Competencies</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Technical Skills
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
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows={3}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="JavaScript, React, Node.js, Python, SQL, AWS, Git, Docker..."
            spellCheck={true}
          />
          <p className="text-xs text-gray-500 mt-1">Separate skills with commas. Include both technical and soft skills.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
          {formData.languages.map((lang, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
              <input
                type="text"
                name="name"
                value={lang.name}
                onChange={(e) => handleChange(e)}
                placeholder="Language"
                className="w-full sm:w-auto flex-grow px-4 py-3 border border-gray-300 rounded-lg"
                spellCheck={true}
              />
              <select
                name="level"
                value={lang.level}
                onChange={(e) => handleChange(e)}
                className="px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              {formData.languages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    const newLanguages = [...formData.languages];
                    newLanguages.splice(index, 1);
                    setFormData({ ...formData, languages: newLanguages });
                  }}
                  className="text-red-500 p-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={(e) => {
              setFormData({
                ...formData,
                languages: [
                  ...formData.languages,
                  { name: '', level: 3 }
                ]
              });
            }}
            className="w-full mt-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
          >
            Add Language
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
          <textarea
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="AWS Certified Solutions Architect, PMP, Google Analytics Certification..."
            spellCheck={true}
          />
        </div>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education Background *</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows={3}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Bachelor's in Computer Science, University Name, 2020-2024, GPA: 3.8"
            spellCheck={true}
          />
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        </div>

        {formData.experience.map((exp, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={exp.jobTitle}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index][e.target.name] = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                  placeholder="Job Title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  spellCheck={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  name="company"
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index][e.target.name] = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                  placeholder="Company"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  spellCheck={true}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dates</label>
              <input
                type="text"
                name="dates"
                value={exp.dates}
                onChange={(e) => {
                  const newExperience = [...formData.experience];
                  newExperience[index][e.target.name] = e.target.value;
                  setFormData({ ...formData, experience: newExperience });
                }}
                placeholder="Dates (e.g., Jan 2020 - Dec 2022)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                spellCheck={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={exp.description}
                onChange={(e) => {
                  const newExperience = [...formData.experience];
                  newExperience[index][e.target.name] = e.target.value;
                  setFormData({ ...formData, experience: newExperience });
                }}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Describe your responsibilities and achievements..."
                spellCheck={true}
              />
            </div>
            {formData.experience.length > 1 && (
              <button type="button" onClick={(e) => {
                const newExperience = [...formData.experience];
                newExperience.splice(index, 1);
                setFormData({ ...formData, experience: newExperience });
              }} className="text-red-500 font-semibold">Remove</button>
            )}
            <button
              type="button"
              className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1 text-xs"
              onClick={() => handleAISuggest('description', index)}
              disabled={aiLoading['description_' + index]}
            >
              <Sparkles className="h-4 w-4" />
              {aiLoading['description_' + index] ? 'Generating...' : 'AI Suggest'}
            </button>
          </div>
        ))}
        <button type="button" onClick={(e) => {
          setFormData({
            ...formData,
            experience: [
              ...formData.experience,
              { jobTitle: '', company: '', dates: '', description: '' }
            ]
          });
        }} className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors">Add Experience</button>
      </div>

      {/* Additional Sections */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Conferences & Courses</label>
        <textarea
          name="conferences"
          value={formData.conferences}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          placeholder="Data Handling BOOTCAMP, Center for Creative Leadership..."
          spellCheck={true}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Strengths</label>
          <textarea
            name="strengths"
            value={formData.strengths}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Creative Problem Solving, Strong Leadership, etc."
            spellCheck={true}
          />
        </div>
      </div>

      {/* Design Preferences */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Design Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
            <select
              value={designPreference}
              onChange={(e) => setDesignPreference(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="auto">Auto (AI chooses best)</option>
              <option value="modern">Modern & Clean</option>
              <option value="professional">Professional & Traditional</option>
              <option value="creative">Creative & Colorful</option>
              <option value="minimalist">Minimalist</option>
              <option value="tech">Tech-focused</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Generate Multiple Designs</label>
            <select
              value={generationCount}
              onChange={(e) => setGenerationCount(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value={1}>1 Design</option>
              <option value={2}>2 Designs</option>
              <option value={3}>3 Designs</option>
            </select>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Smart Design Features</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• AI adapts layout based on your content and industry</li>
                <li>• Professional color schemes that match your field</li>
                <li>• Responsive design for all devices</li>
                <li>• ATS-friendly formatting with modern styling</li>
                {formData.photo && <li>• Your photo will be professionally integrated</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Custom Editor Option */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Code className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">Want More Control?</h4>
              <p className="text-sm text-purple-700 mb-3">
                Use our custom editor to drag & drop elements, edit code, and create your perfect design from scratch.
              </p>
              <button
                type="button"
                onClick={handleOpenCustomEditor}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <Code className="h-4 w-4" />
                <span>Open Custom Editor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating ATS-Optimized Resume...</span>
          </div>
        ) : (
          'Generate ATS-Friendly Resume'
        )}
      </button>

      {/* Ad Placeholder - Only show in production */}
      {process.env.NODE_ENV === 'production' && (
        <div className="mt-6">
          <AdPlaceholder adSlot="resume-bottom-ad" />
        </div>
      )}

      {/* AI Command Portal */}
      {showAICommandPortal && (
        <AICommandPortal
          isOpen={showAICommandPortal}
          onClose={() => setShowAICommandPortal(false)}
          fieldName={aiCommandField}
          currentContent={aiCommandIndex !== null 
            ? formData.experience[aiCommandIndex]?.description || ''
            : formData[aiCommandField] || ''
          }
          onGenerate={handleAICommandGenerate}
          isLoading={aiLoading[aiCommandField + (aiCommandIndex !== null ? '_' + aiCommandIndex : '')]}
          context={{
            'Job Title': formData.jobTitle || 'Not specified',
            'Industry': formData.targetIndustry || 'Not specified',
            'Experience Level': formData.experienceLevel || 'Not specified',
            'Current Skills': formData.skills ? formData.skills.substring(0, 100) + '...' : 'Not specified'
          }}
        />
      )}
    </div>
  );
};

export default ResumeForm;