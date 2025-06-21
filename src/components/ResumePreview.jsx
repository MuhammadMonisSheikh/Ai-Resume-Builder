import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, CheckCircle, Eye, EyeOff, Smartphone, Monitor, Share2, Mail, Linkedin, Twitter, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResumePreview = ({ content, onDownload }) => {
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [showATSNotes, setShowATSNotes] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const shareMenuRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const resumePreviewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDownload = async (format) => {
    if (!resumePreviewRef.current) return;
    setIsDownloading(true);
    setShowDownloadOptions(false);

    const canvas = await html2canvas(resumePreviewRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const a = document.createElement('a');

    switch (format) {
      case 'png':
        a.href = canvas.toDataURL('image/png');
        a.download = 'resume.png';
        a.click();
        break;
      case 'jpeg':
        a.href = canvas.toDataURL('image/jpeg', 0.9);
        a.download = 'resume.jpeg';
        a.click();
        break;
      case 'pdf':
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('resume.pdf');
        break;
      default:
        setIsDownloading(false);
        return;
    }
    
    setIsDownloading(false);
  };

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
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button onClick={() => setShowATSNotes(!showATSNotes)} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
              {showATSNotes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showATSNotes ? 'Hide' : 'Show'} ATS Notes</span>
            </button>
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareOptions(prev => !prev)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button onClick={() => handleShare('email')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Email</button>
                  <button onClick={() => handleShare('linkedin')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">LinkedIn</button>
                  <button onClick={() => handleShare('twitter')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Twitter</button>
                </div>
              )}
            </div>
            <button onClick={handlePrint} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <div className="relative" ref={downloadMenuRef}>
              <button
                onClick={() => setShowDownloadOptions(prev => !prev)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
              >
                <FileDown className="h-4 w-4" />
                <span>Download</span>
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Download as PDF</button>
                  <button onClick={() => handleDownload('png')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Download as PNG</button>
                  <button onClick={() => handleDownload('jpeg')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Download as JPEG</button>
                </div>
              )}
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
    <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden relative">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">Resume Preview</h3>
        <div className="flex items-center gap-2">
          {/* Action buttons here */}
          <div ref={downloadMenuRef} className="relative">
            <button onClick={() => setShowDownloadOptions(p => !p)} className="flex items-center gap-2 bg-white/20 p-2 rounded-md">
              <FileDown className="h-4 w-4" /> <span>Download</span>
            </button>
            {showDownloadOptions && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20">
                <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">As PDF</button>
                <button onClick={() => handleDownload('png')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">As PNG</button>
                <button onClick={() => handleDownload('jpeg')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">As JPEG</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative">
        <div ref={resumePreviewRef} dangerouslySetInnerHTML={{ __html: generateResumeHTML(content || {}) }} />
        {isDownloading && (
          <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
            <p>Downloading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;