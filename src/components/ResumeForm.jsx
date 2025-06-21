import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, GraduationCap, Award, Loader2, Target, FileText, CheckCircle, Star, Lightbulb, TrendingUp, ChevronDown, Plus, X, Monitor, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import ResumePreview from './ResumePreview';
import Modal from './Modal';

const ResumeForm = () => {
  const { saveOfflineData, getOfflineData, isOnline } = usePWA();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
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

  const [atsScore, setAtsScore] = useState(0);
  const [keywordMatches, setKeywordMatches] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [showKeywordAnalysis, setShowKeywordAnalysis] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-sidebar');
  const [resumeLength, setResumeLength] = useState({ words: 0, characters: 0 });
  const [lengthFeedback, setLengthFeedback] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatedResumeData, setGeneratedResumeData] = useState(null);
  const [previewMode, setPreviewMode] = useState('Desktop');

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

  // Resume templates
  const resumeTemplates = [
    {
      id: 'modern-sidebar',
      name: 'Modern Sidebar',
      description: 'Two-column layout with a colored sidebar for contact info and links.',
      color: 'blue',
      atsFriendly: true
    },
    {
      id: 'creative-timeline',
      name: 'Creative Timeline',
      description: 'A single-column layout that uses a timeline format for experience.',
      color: 'purple',
      atsFriendly: false
    },
    {
      id: 'professional-accent',
      name: 'Professional Accent',
      description: 'A clean design with a subtle color accent bar.',
      color: 'green',
      atsFriendly: true
    },
    {
      id: 'professional-modern',
      name: 'Professional Modern',
      description: 'A clean, two-column layout with a modern header and skill bars.',
      color: 'cyan',
      atsFriendly: true
    },
    {
      id: 'executive-dark',
      name: 'Executive Dark',
      description: 'A striking design with a dark header, perfect for senior roles.',
      color: 'gray',
      atsFriendly: true
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, distraction-free layout for maximum ATS compatibility',
      color: 'green',
      atsFriendly: true
    },
    {
      id: 'tech',
      name: 'Tech/Developer',
      description: 'Focuses on technical skills, projects, and GitHub links.',
      color: 'indigo',
      atsFriendly: true
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateATSScore();
    
    // Save final form data
    saveOfflineData('resumeForm', formData);
    
    // If offline, show offline message
    if (!isOnline) {
      alert('You\'re currently offline. Your resume will be generated when you\'re back online.');
      // Save for later processing
      saveOfflineData('pendingResume', formData);
      return;
    }
    
    // This is a placeholder for where the generation logic would go.
    setIsLoading(true);
    setTimeout(() => {
      setGeneratedResumeData(formData);
      setShowPreviewModal(true);
      setIsLoading(false);
    }, 1000);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
        saveOfflineData('resumeForm', { ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
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

  const handleTemplatePreview = (template) => {
    setPreviewTemplate(template);
    setShowTemplateModal(true);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setShowTemplateModal(false);
  };

  const handleExperienceChange = (index, e) => {
    const newExperience = [...formData.experience];
    newExperience[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experience: newExperience });
  };

  const addExperienceField = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { jobTitle: '', company: '', dates: '', description: '' }
      ]
    });
  };

  const removeExperienceField = (index) => {
    const newExperience = [...formData.experience];
    newExperience.splice(index, 1);
    setFormData({ ...formData, experience: newExperience });
  };

  const handleLanguageChange = (index, e) => {
    const newLanguages = [...formData.languages];
    newLanguages[index][e.target.name] = e.target.value;
    setFormData({ ...formData, languages: newLanguages });
  };

  const addLanguageField = () => {
    setFormData({
      ...formData,
      languages: [
        ...formData.languages,
        { name: '', level: 3 }
      ]
    });
  };

  const removeLanguageField = (index) => {
    const newLanguages = [...formData.languages];
    newLanguages.splice(index, 1);
    setFormData({ ...formData, languages: newLanguages });
  };

  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setGeneratedResumeData(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Fields Section (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Create Your Resume</h2>
              
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 my-4">Select Template</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {resumeTemplates.map((template) => (
                    <div 
                      key={template.id} 
                      onClick={() => handleTemplatePreview(template)} 
                      className={`cursor-pointer border-2 ${selectedTemplate === template.id ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-2 hover:border-blue-400 transition-all relative group bg-white shadow-sm`}
                    >
                      <img src={`/images/templates/${template.id}.png`} alt={`${template.name} resume template preview`} className="w-full h-auto rounded-md" onError={(e) => e.target.src = '/images/templates/placeholder.png'} />
                      <p className="text-center text-sm mt-2 font-semibold text-gray-700">{template.name}</p>
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300 rounded-md">
                        <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                          Preview
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
              {/* Personal Details */}
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
                  />
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills *</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="JavaScript, React, Node.js, Python, SQL, AWS, Git, Docker..."
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
                        onChange={(e) => handleLanguageChange(index, e)}
                        placeholder="Language"
                        className="w-full sm:w-auto flex-grow px-4 py-3 border border-gray-300 rounded-lg"
                      />
                      <select
                        name="level"
                        value={lang.level}
                        onChange={(e) => handleLanguageChange(index, e)}
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
                          onClick={() => removeLanguageField(index)}
                          className="text-red-500 p-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLanguageField}
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
                          onChange={(e) => handleExperienceChange(index, e)}
                          placeholder="Job Title"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, e)}
                          placeholder="Company"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dates</label>
                      <input
                        type="text"
                        name="dates"
                        value={exp.dates}
                        onChange={(e) => handleExperienceChange(index, e)}
                        placeholder="Dates (e.g., Jan 2020 - Dec 2022)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, e)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                    {formData.experience.length > 1 && (
                      <button type="button" onClick={() => removeExperienceField(index)} className="text-red-500 font-semibold">Remove</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addExperienceField} className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors">Add Experience</button>
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
                  />
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
            </div>
          </div>

          {/* Sidebar Section (Right) */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-8 space-y-6">

              {/* ATS Preview Card */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="h-6 w-6" />
                  <h3 className="text-xl font-bold">ATS-Friendly Resume Preview</h3>
                </div>
                <div className="flex justify-center bg-blue-900 bg-opacity-30 rounded-lg p-1">
                  <button type="button" onClick={() => setPreviewMode('Desktop')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${previewMode === 'Desktop' ? 'bg-white text-blue-600' : 'bg-transparent'}`}>
                    <Monitor className="inline-block h-4 w-4 mr-1"/> Desktop
                  </button>
                  <button type="button" onClick={() => setPreviewMode('Mobile')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${previewMode === 'Mobile' ? 'bg-white text-blue-600' : 'bg-transparent'}`}>
                    <Smartphone className="inline-block h-4 w-4 mr-1"/> Mobile
                  </button>
                </div>
              </div>

              {/* ATS Optimization Tips Card */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">ATS Optimization Tips</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-2"/>What Works Well</h4>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      <li>Standard fonts</li>
                      <li>Clear section headers</li>
                      <li>Keyword-rich content</li>
                      <li>Simple formatting</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 flex items-center"><X className="h-4 w-4 mr-2"/>Avoid These</h4>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      <li>Complex graphics</li>
                      <li>Tables or columns</li>
                      <li>Unusual fonts</li>
                      <li>Headers/footers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <Modal 
        isOpen={showPreviewModal} 
        onClose={handleCloseModal} 
        title="Your Generated Resume"
      >
        {generatedResumeData && <ResumePreview content={generatedResumeData} />}
      </Modal>

      {/* Template Preview Modal */}
      {showTemplateModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-800">{previewTemplate.name}</h3>
                  <button onClick={() => setShowTemplateModal(false)} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="bg-gray-100 p-2 rounded-lg">
                  <img src={`/images/templates/${previewTemplate.id}.png`} alt={`${previewTemplate.name} resume template larger preview`} className="w-full h-auto rounded-md shadow-md bg-white" onError={(e) => e.target.src = '/images/templates/placeholder.png'}/>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Description</h4>
                  <p className="text-gray-600 text-sm">{previewTemplate.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Best for</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    {previewTemplate.id === 'modern-sidebar' && (
                      <>
                        <li>• Technology and startup companies</li>
                        <li>• Marketing and creative roles</li>
                        <li>• Recent graduates</li>
                      </>
                    )}
                    {previewTemplate.id === 'creative-timeline' && (
                      <>
                        <li>• Design and creative roles</li>
                        <li>• Portfolio showcases</li>
                        <li>• Freelance work</li>
                      </>
                    )}
                    {previewTemplate.id === 'professional-accent' && (
                      <>
                        <li>• Marketing and creative roles</li>
                        <li>• Recent graduates</li>
                      </>
                    )}
                    {previewTemplate.id === 'professional-modern' && (
                      <>
                        <li>• Project Managers</li>
                        <li>• IT Professionals</li>
                        <li>• Consultants</li>
                      </>
                    )}
                    {previewTemplate.id === 'executive-dark' && (
                      <>
                        <li>• Executives (CEO, CTO, etc.)</li>
                        <li>• Senior Management</li>
                        <li>• Human Resources</li>
                      </>
                    )}
                    {previewTemplate.id === 'minimal' && (
                      <>
                        <li>• Maximum ATS compatibility</li>
                        <li>• Career changers</li>
                        <li>• Entry-level positions</li>
                      </>
                    )}
                    {previewTemplate.id === 'tech' && (
                      <>
                        <li>• Software developers</li>
                        <li>• IT professionals</li>
                        <li>• Technical roles</li>
                      </>
                    )}
                  </ul>
                </div>
                {previewTemplate.atsFriendly && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">ATS Friendly</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-end items-center gap-3">
              <button onClick={() => setShowTemplateModal(false)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={() => handleTemplateSelect(previewTemplate.id)} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Select this Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;