import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, CheckCircle, Eye, EyeOff, Smartphone, Monitor, Share2, Mail, Linkedin, Twitter } from 'lucide-react';

const ResumePreview = ({ content, onDownload }) => {
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [showATSNotes, setShowATSNotes] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareMenuRef = useRef(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatResumeContent = (content) => {
    if (typeof content !== 'string') {
      // If content is not a string (e.g., it's the formData object), return an empty string or handle appropriately.
      // For now, we'll return an empty string to prevent crashes.
      return '';
    }
    // Simple formatting for demonstration. In a real app, you might use a library like marked.
    return content
      .replace(/\n/g, '<br />')
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  };

  const generateResumeHTML = (data) => {
    const { template, ...resumeData } = data;
    const templateId = template || 'modern-sidebar';

    const getSectionHTML = (title, content, itemClass = '', titleClass = '') => {
      if (!content) return '';
      return `
        <div class="section ${itemClass}">
          <h2 class="section-title ${titleClass}">${title}</h2>
          <div class="section-content">${content}</div>
        </div>
      `;
    };

    const getWorkExperienceHTML = (experience, template) => {
      if (!experience || experience.length === 0) return '';
      
      const styles = {
        'creative-timeline': `
          .exp-item { margin-bottom: 20px; }
          .exp-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .exp-title { font-size: 16px; font-weight: bold; color: #2D3748; }
          .exp-date { font-size: 14px; color: #E53E3E; font-weight: bold; }
          .exp-company { font-size: 14px; font-style: italic; color: #718096; }
          .exp-details { padding-left: 20px; margin-top: 5px; }
        `,
        'default': `
          .exp-item { margin-bottom: 15px; }
          .exp-title { font-weight: bold; }
        `
      };

      const items = experience.map(exp => {
        const descriptionPoints = exp.description ? `<ul>${exp.description.split('\n').map(point => `<li>${point}</li>`).join('')}</ul>` : '';
        if (template === 'creative-timeline') {
          return `
            <div class="exp-item">
              <div class="exp-header">
                <div>
                  <div class="exp-title">${exp.jobTitle}</div>
                  <div class="exp-company">${exp.company}</div>
                </div>
                <div class="exp-date">${exp.dates}</div>
              </div>
              <div class="exp-details">${descriptionPoints}</div>
            </div>
          `;
        }
        return `
          <div class="exp-item">
            <div class="exp-title">${exp.jobTitle} at ${exp.company} (${exp.dates})</div>
            <div class="exp-details">${descriptionPoints}</div>
          </div>
        `;
      }).join('');

      return `<style>${styles[template] || styles['default']}</style>${items}`;
    };

    const getSkillsHTML = (skillsString, template) => {
      if (!skillsString) return '';
      const skills = skillsString.split(',').map(skill => skill.trim());
      
      if (template === 'professional-modern') {
        return skills.map(skill => `<div class="skill-item">${skill}</div>`).join('');
      }

      return skills.map(skill => `
        <div class="skill-item">
          <span class="skill-dot"></span>
          <span>${skill}</span>
        </div>
      `).join('');
    };

    const getSkillsAsTags = (skillsString) => {
      if (!skillsString) return '';
      const skills = skillsString.split(',').map(skill => skill.trim());
      return skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    };

    const getStrengthsHTML = (strengthsString) => {
      if (!strengthsString) return '';
      const strengths = strengthsString.split(',').map(strength => strength.trim());
      return strengths.map(strength => `<div class="strength-item"><span>&#10003;</span> ${strength}</div>`).join('');
    };

    const getLanguagesHTML = (languages) => {
      if (!languages || languages.length === 0) return '';
      return languages.map(lang => `
        <div class="lang-item">
          <span>${lang.name}</span>
          <div class="lang-dots">${[...Array(5)].map((_, i) => `<span class="dot ${i < lang.level ? 'filled' : ''}"></span>`).join('')}</div>
        </div>
      `).join('');
    };

    const getLanguagesWithLevels = (languages) => {
      if (!languages || languages.length === 0) return '';
      const levelMap = { 5: 'Native', 4: 'Fluent', 3: 'Conversational', 2: 'Intermediate', 1: 'Beginner' };
      return languages.map(lang => `
        <div class="lang-item-executive">
          <strong>${lang.name}</strong> - ${levelMap[lang.level] || 'Beginner'}
        </div>
      `).join('');
    }

    switch(templateId) {
      case 'executive-dark':
        return `
          <style>
            .resume-container { font-family: 'Arial', sans-serif; background: #FFF; color: #555; max-width: 800px; margin: auto; }
            .header-dark { background-color: #2D3748; color: #FFF; padding: 25px; display: flex; justify-content: space-between; align-items: flex-start; }
            .header-dark .name-title { flex-grow: 1; }
            .header-dark .name { font-size: 28px; font-weight: bold; }
            .header-dark .title { font-size: 14px; color: #A0AEC0; margin-top: 4px; }
            .header-dark .contact-info { text-align: right; font-size: 12px; }
            .header-dark .contact-info div { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 5px; }
            .header-dark .contact-info svg { width: 12px; height: 12px; margin-right: 8px; }
            .summary-section { padding: 25px; display: flex; align-items: center; border-bottom: 1px solid #E2E8F0; }
            .summary-section .photo { width: 90px; height: 90px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.15); margin-right: 25px; }
            .summary-section p { font-size: 13px; line-height: 1.6; color: #4A5568; }
            .content-body { display: flex; }
            .main-content { width: 60%; padding: 25px; border-right: 1px solid #E2E8F0; }
            .sidebar { width: 40%; padding: 25px; }
            .section { margin-bottom: 20px; }
            .section-title-icon { display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #2D3748; text-transform: uppercase; margin-bottom: 15px; }
            .section-title-icon svg { width: 20px; height: 20px; margin-right: 10px; color: #4A5568; }
            .skill-tag { display: inline-block; background-color: #E2E8F0; color: #4A5568; padding: 4px 10px; border-radius: 4px; margin: 2px; font-size: 12px; }
            .lang-item-executive { margin-bottom: 5px; font-size: 13px; }
          </style>
          <div class="resume-container">
            <div class="header-dark">
              <div class="name-title">
                <div class="name">${resumeData.name || 'Rachel Johnson'}</div>
                <div class="title">${resumeData.jobTitle || 'HR Professional'}</div>
              </div>
              <div class="contact-info">
                <div><span>${resumeData.email || 'rachel@example.com'}</span></div>
                <div><span>${resumeData.phone || '123-456-7890'}</span></div>
                <div><span>${resumeData.location || 'Washington, PA'}</span></div>
                <div><span>${resumeData.linkedin || 'linkedin.com/in/rachel'}</span></div>
              </div>
            </div>
            <div class="summary-section">
              ${resumeData.photo ? `<img src="${resumeData.photo}" alt="Profile" class="photo"/>` : ''}
              <p>${resumeData.summary || 'A talented and exceptionally dedicated professional...'}</p>
            </div>
            <div class="content-body">
              <div class="main-content">
                <div class="section">
                  <div class="section-title-icon">WORK EXPERIENCE</div>
                  ${getWorkExperienceHTML(resumeData.experience, 'default')}
                </div>
              </div>
              <div class="sidebar">
                <div class="section"><div class="section-title-icon">SKILLS & COMPETENCIES</div>${getSkillsAsTags(resumeData.skills)}</div>
                <div class="section"><div class="section-title-icon">CONFERENCES & COURSES</div><p>${resumeData.conferences || ''}</p></div>
                <div class="section"><div class="section-title-icon">CERTIFICATES</div><p>${resumeData.certifications || ''}</p></div>
                <div class="section"><div class="section-title-icon">EDUCATION</div><p>${resumeData.education || ''}</p></div>
                <div class="section"><div class="section-title-icon">LANGUAGES</div>${getLanguagesWithLevels(resumeData.languages)}</div>
              </div>
            </div>
          </div>
        `;
      case 'professional-modern':
        return `
          <style>
            .resume-container { font-family: 'Lato', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #4A5568; }
            .header { text-align: center; margin-bottom: 40px; }
            .name { font-size: 36px; font-weight: bold; color: #2D3748; letter-spacing: 2px; }
            .contact-info { font-size: 14px; color: #718096; margin-top: 5px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 16px; font-weight: bold; color: #E53E3E; margin-bottom: 20px; border-bottom: 2px solid #E53E3E; padding-bottom: 5px; text-transform: uppercase; }
            .exp-item { margin-bottom: 20px; }
            .exp-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .exp-title { font-size: 16px; font-weight: bold; color: #2D3748; }
            .exp-date { font-size: 14px; color: #E53E3E; font-weight: bold; }
            .exp-company { font-size: 14px; font-style: italic; color: #718096; }
            .exp-details ul { padding-left: 20px; margin-top: 5px; }
          </style>
          <div class="resume-container">
            <div class="header">
              <div class="name">${resumeData.name || 'Mandy Colbert'}</div>
              <div class="contact-info">${resumeData.email || 'your.email@example.com'} | ${resumeData.phone || '(555) 123-4567'} | ${resumeData.location || 'City, State'}</div>
            </div>
            ${getSectionHTML('SUMMARY', resumeData.summary)}
            ${getSectionHTML('EXPERIENCE', getWorkExperienceHTML(resumeData.experience, 'default'))}
            <div class="section">
              <h2 class="section-title">EDUCATION</h2>
              <div class="section-content">${resumeData.education}</div>
            </div>
            <div class="section">
              <h2 class="section-title">SKILLS</h2>
              <div class="section-content">${getSkillsHTML(resumeData.skills, 'professional-modern')}</div>
            </div>
            <div class="section">
              <h2 class="section-title">STRENGTHS</h2>
              <div class="section-content">${getStrengthsHTML(resumeData.strengths)}</div>
            </div>
            <div class="section">
              <h2 class="section-title">LANGUAGES</h2>
              <div class="section-content">${getLanguagesHTML(resumeData.languages)}</div>
            </div>
          </div>
        `;

      case 'creative-timeline':
        return `
          <style>
            .resume-container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #4A5568; }
            .header { text-align: center; margin-bottom: 40px; }
            .name { font-size: 36px; font-weight: bold; color: #2D3748; letter-spacing: 2px; }
            .contact-info { font-size: 14px; color: #718096; margin-top: 5px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 16px; font-weight: bold; color: #E53E3E; margin-bottom: 20px; border-bottom: 2px solid #E53E3E; padding-bottom: 5px; text-transform: uppercase; }
            .exp-item { margin-bottom: 20px; }
            .exp-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .exp-title { font-size: 16px; font-weight: bold; color: #2D3748; }
            .exp-date { font-size: 14px; color: #E53E3E; font-weight: bold; }
            .exp-company { font-size: 14px; font-style: italic; color: #718096; }
            .exp-details ul { padding-left: 20px; margin-top: 5px; }
          </style>
          <div class="resume-container">
            <div class="header">
              <div class="name">${resumeData.name || 'Mandy Colbert'}</div>
              <div class="contact-info">${resumeData.email || 'your.email@example.com'} | ${resumeData.phone || '(555) 123-4567'} | ${resumeData.location || 'City, State'}</div>
            </div>
            ${getSectionHTML('CAREER OBJECTIVE', resumeData.summary)}
            <div class="section">
              <h2 class="section-title">WORK EXPERIENCE</h2>
              <div class="section-content">${getWorkExperienceHTML(resumeData.experience, 'creative-timeline')}</div>
            </div>
            ${getSectionHTML('EDUCATION', resumeData.education)}
            ${getSectionHTML('SKILLS', getSkillsHTML(resumeData.skills, 'modern-sidebar'))}
          </div>
        `;

      case 'professional-accent':
        return `
          <style>
            .resume-container { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; color: #333; }
            .header { background-color: #F8F9FA; padding: 40px; text-align: left; }
            .name { font-size: 42px; font-weight: bold; color: #212529; }
            .title { font-size: 18px; color: #6C757D; margin-top: 5px; }
            .contact-info { font-size: 14px; margin-top: 10px; }
            .content-wrapper { display: flex; }
            .main-content { padding: 40px; width: 100%; }
            .accent-bar { width: 8px; background-color: #198754; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; color: #198754; border-bottom: 2px solid #F1F3F5; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; }
          </style>
          <div class="resume-container">
            <div class="header">
              <div class="name">${resumeData.name || 'Emily Miller'}</div>
              <div class="title">${resumeData.jobTitle || 'Creative Director'}</div>
              <div class="contact-info">${resumeData.email || 'your.email@example.com'} | ${resumeData.phone || '(555) 123-4567'}</div>
            </div>
            <div class="content-wrapper">
              <div class="accent-bar"></div>
              <div class="main-content">
                ${getSectionHTML('CAREER OBJECTIVE', resumeData.summary)}
                ${getSectionHTML('WORK EXPERIENCE', getWorkExperienceHTML(resumeData.experience, 'default'))}
                ${getSectionHTML('EDUCATION', resumeData.education)}
                ${getSectionHTML('SKILLS', getSkillsHTML(resumeData.skills, 'professional-modern'))}
              </div>
            </div>
          </div>
        `;

      case 'modern-sidebar':
      default:
        return `
          <style>
            .resume-container { display: flex; max-width: 800px; margin: 0 auto; font-family: 'Lato', sans-serif; min-height: 100vh; background: #FFF; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .sidebar { width: 280px; background-color: #2C3E50; color: #ECF0F1; padding: 30px; }
            .photo-container { text-align: center; margin-bottom: 20px; }
            .photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 5px solid #34495E; }
            .sidebar .section { margin-bottom: 25px; }
            .sidebar .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; color: #1ABC9C; }
            .sidebar .section-content { font-size: 14px; line-height: 1.6; }
            .main-content { padding: 40px; width: 100%; }
            .header { margin-bottom: 30px; }
            .main-content .name { font-size: 48px; font-weight: 900; color: #2C3E50; }
            .main-content .title { font-size: 20px; color: #34495E; margin-top: 5px; }
            .main-content .section-title { font-size: 18px; font-weight: bold; color: #2C3E50; border-bottom: 3px solid #1ABC9C; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; }
            .skill-item { margin-bottom: 10px; }
            .skill-bar { height: 8px; background-color: #BDC3C7; border-radius: 4px; overflow: hidden; }
            .skill-level { height: 100%; background-color: #1ABC9C; }
          </style>
          <div class="resume-container">
            <div class="sidebar">
              ${resumeData.photo ? `<div class="photo-container"><img src="${resumeData.photo}" alt="Profile" class="photo"/></div>` : ''}
              ${getSectionHTML('LINKS', resumeData.linkedin, 'sidebar-section')}
              ${getSectionHTML('LANGUAGES', resumeData.languages, 'sidebar-section')}
              ${getSectionHTML('REFERENCES', resumeData.references, 'sidebar-section')}
              ${getSectionHTML('HOBBIES', resumeData.hobbies, 'sidebar-section')}
            </div>
            <div class="main-content">
              <div class="header">
                <div class="name">${resumeData.name || 'Don Draper'}</div>
                <div class="title">${resumeData.jobTitle || 'ATS Templates Specialist'}</div>
              </div>
              ${getSectionHTML('ABOUT ME', resumeData.summary)}
              ${getSectionHTML('WORK EXPERIENCE', getWorkExperienceHTML(resumeData.experience, 'default'))}
              ${getSectionHTML('EDUCATION', resumeData.education)}
              <div class="section">
                <h2 class="section-title">SKILLS</h2>
                <div class="section-content">${getSkillsHTML(resumeData.skills, 'modern-sidebar')}</div>
              </div>
            </div>
          </div>
        `;
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ATS-Friendly Resume</title>
            <style>
              body { 
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            ${formatResumeContent(content)}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ATS-Friendly Resume - ${new Date().toLocaleDateString()}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
              }
              h1 { 
                color: #2563eb; 
                border-bottom: 2px solid #2563eb; 
                padding-bottom: 10px; 
                font-size: 28px;
                margin-bottom: 20px;
              }
              h2 { 
                color: #1f2937; 
                margin-top: 30px; 
                margin-bottom: 15px; 
                font-size: 18px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 5px;
              }
              p { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            ${formatResumeContent(content)}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = (platform) => {
    const resumeText = "Check out my ATS-optimized resume created with AI Resume Pro!";
    const url = window.location.href;
    
    let shareUrl = '';
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent('My ATS-Friendly Resume')}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(resumeText)}&url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('My ATS-Friendly Resume')}&body=${encodeURIComponent(`${resumeText}\n\n${url}`)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'My ATS-Friendly Resume',
            text: resumeText,
            url: url
          });
          return;
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6" />
            <h2 className="text-xl font-bold">ATS-Friendly Resume Preview</h2>
          </div>
          <div className="flex space-x-2">
            {/* Preview Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
                  previewMode === 'desktop' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span className="text-sm">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
                  previewMode === 'mobile' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">Mobile</span>
              </button>
            </div>
            
            {/* ATS Notes Toggle */}
            <button
              onClick={() => setShowATSNotes(!showATSNotes)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
            >
              {showATSNotes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="text-sm">ATS Notes</span>
            </button>
            
            {/* Share Button */}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Share</span>
              </button>
              
              {showShareOptions && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10 min-w-[200px]">
                  <div className="space-y-1">
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Share on LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Share on Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Share via Email</span>
                    </button>
                    <button
                      onClick={() => handleShare('native')}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">More Options</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className={`p-6 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
        <div 
          className="resume-preview"
          style={{
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            color: '#333',
            maxWidth: previewMode === 'mobile' ? '100%' : '800px',
            margin: '0 auto',
            fontSize: previewMode === 'mobile' ? '14px' : '16px'
          }}
          dangerouslySetInnerHTML={{ __html: formatResumeContent(content) }}
        />
      </div>

      {/* ATS Tips */}
      {showATSNotes && (
        <div className="bg-blue-50 border-t border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">ATS Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">✓ What Works Well:</h4>
              <ul className="space-y-1">
                <li>• Standard fonts (Arial, Calibri, Times New Roman)</li>
                <li>• Clear section headers</li>
                <li>• Keyword-rich content</li>
                <li>• Simple formatting</li>
                <li>• Proper contact information</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✗ Avoid These:</h4>
              <ul className="space-y-1">
                <li>• Complex graphics or images</li>
                <li>• Tables or columns</li>
                <li>• Unusual fonts</li>
                <li>• Headers/footers</li>
                <li>• Colorful backgrounds</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;