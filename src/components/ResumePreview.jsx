// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, Eye, EyeOff, Smartphone, Monitor, Share2, FileDown, Linkedin, Twitter, Mail } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResumePreview = ({ content, aiContent }) => {
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showATSNotes, setShowATSNotes] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const shareMenuRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const resumePreviewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) setShowShareOptions(false);
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) setShowDownloadOptions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (format) => {
    if (!resumePreviewRef.current) return;
    setIsDownloading(true);
    setShowDownloadOptions(false);
    const canvas = await html2canvas(resumePreviewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const a = document.createElement('a');
    switch (format) {
      case 'png': a.href = canvas.toDataURL('image/png'); a.download = 'resume.png'; break;
      case 'jpeg': a.href = canvas.toDataURL('image/jpeg', 0.9); a.download = 'resume.jpeg'; break;
      case 'pdf':
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('resume.pdf');
        setIsDownloading(false);
        return;
    }
    a.click();
    setIsDownloading(false);
  };

  const handleShare = (platform) => { /* Share logic placeholder */ console.log(platform); setShowShareOptions(false); };
  const handlePrint = () => { /* Print logic placeholder */ window.print(); };
  
  // This function is now clean and only generates the resume's HTML content
  const generateResumeHTML = (data) => {
    const { template, ...resumeData } = data;
    switch (data.selectedTemplate || template) {
      case 'elegant-orange':
        return `
          <style>
            .elegant-orange { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #222; border-radius: 12px; box-shadow: 0 2px 8px #f59e4233; overflow: hidden; }
            .elegant-orange .header { background: linear-gradient(90deg, #ff9800 60%, #fff3e0 100%); color: #fff; padding: 32px 24px 16px 24px; border-bottom: 4px solid #ff9800; }
            .elegant-orange .name { font-size: 2.2rem; font-weight: bold; letter-spacing: 1px; }
            .elegant-orange .title { font-size: 1.1rem; color: #fffde7; margin-top: 4px; }
            .elegant-orange .section { padding: 20px 24px; border-bottom: 1px solid #ffe0b2; }
            .elegant-orange .section:last-child { border-bottom: none; }
            .elegant-orange .section-title { color: #ff9800; font-weight: 600; font-size: 1.1rem; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
            .elegant-orange .item-title { font-weight: 500; color: #222; }
            .elegant-orange .item-sub { color: #ff9800; font-size: 0.95rem; }
            .elegant-orange .skills { margin-top: 8px; }
            .elegant-orange .skills span { background: #fff3e0; color: #ff9800; border-radius: 6px; padding: 2px 8px; margin-right: 6px; font-size: 0.95rem; display: inline-block; margin-bottom: 4px; }
          </style>
          <div class="elegant-orange">
            <div class="header">
              <div class="name">${resumeData.name || 'Your Name'}</div>
              <div class="title">${resumeData.jobTitle || 'Your Title'}</div>
              <div style="margin-top:8px; font-size:0.95rem; color:#fffde7;">${resumeData.email || ''} ${resumeData.phone ? ' | ' + resumeData.phone : ''}</div>
              <div style="font-size:0.95rem; color:#fffde7;">${resumeData.location || ''}</div>
            </div>
            <div class="section">
              <div class="section-title">Summary</div>
              <div>${resumeData.summary || 'A brief summary about yourself.'}</div>
            </div>
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills">${(resumeData.skills || '').split(',').map(skill => skill.trim() ? `<span>${skill.trim()}</span>` : '').join('')}</div>
            </div>
            <div class="section">
              <div class="section-title">Experience</div>
              ${(resumeData.experience || []).map(exp =>
                `<div style="margin-bottom:12px;">
                  <div class="item-title">${exp.jobTitle || ''} ${exp.company ? 'at ' + exp.company : ''}</div>
                  <div class="item-sub">${exp.dates || ''}</div>
                  <div>${exp.description || ''}</div>
                </div>`
              ).join('')}
            </div>
            <div class="section">
              <div class="section-title">Education</div>
              <div>${resumeData.education || ''}</div>
            </div>
            <div class="section">
              <div class="section-title">Achievements</div>
              <div>${resumeData.achievements || ''}</div>
            </div>
          </div>
        `;
      case 'custom-modern':
        return `
          <style>
            .custom-modern { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; border-radius: 12px; box-shadow: 0 2px 8px #64748b22; overflow: hidden; max-width: 800px; margin: auto; }
            .custom-modern .header { background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%); color: #fff; padding: 32px 32px 20px 32px; border-bottom: 4px solid #2563eb; }
            .custom-modern .name { font-size: 2.5rem; font-weight: bold; letter-spacing: 1px; }
            .custom-modern .title { font-size: 1.2rem; color: #dbeafe; margin-top: 4px; }
            .custom-modern .contact { margin-top: 12px; font-size: 1rem; color: #dbeafe; }
            .custom-modern .section { padding: 24px 32px; border-bottom: 1px solid #e2e8f0; }
            .custom-modern .section:last-child { border-bottom: none; }
            .custom-modern .section-title { color: #2563eb; font-weight: 700; font-size: 1.1rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .custom-modern .item-title { font-weight: 600; color: #1e293b; }
            .custom-modern .item-sub { color: #2563eb; font-size: 0.98rem; }
            .custom-modern .skills { margin-top: 8px; }
            .custom-modern .skills span { background: #dbeafe; color: #2563eb; border-radius: 6px; padding: 2px 10px; margin-right: 8px; font-size: 1rem; display: inline-block; margin-bottom: 4px; }
            @media (max-width: 600px) {
              .custom-modern .header, .custom-modern .section { padding: 16px 8px; }
              .custom-modern { font-size: 0.98rem; }
            }
          </style>
          <div class="custom-modern">
            <div class="header">
              <div class="name">${resumeData.name || 'Your Name'}</div>
              <div class="title">${resumeData.jobTitle || 'Your Title'}</div>
              <div class="contact">
                ${resumeData.email || ''}${resumeData.phone ? ' | ' + resumeData.phone : ''}${resumeData.location ? ' | ' + resumeData.location : ''}
              </div>
              ${resumeData.linkedin ? `<div class="contact">${resumeData.linkedin}</div>` : ''}
            </div>
            <div class="section">
              <div class="section-title">Summary</div>
              <div>${resumeData.summary || 'A brief summary about yourself.'}</div>
            </div>
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills">${(resumeData.skills || '').split(',').map(skill => skill.trim() ? `<span>${skill.trim()}</span>` : '').join('')}</div>
            </div>
            <div class="section">
              <div class="section-title">Experience</div>
              ${(resumeData.experience || []).map(exp =>
                `<div style="margin-bottom:16px;">
                  <div class="item-title">${exp.jobTitle || ''} ${exp.company ? 'at ' + exp.company : ''}</div>
                  <div class="item-sub">${exp.dates || ''}</div>
                  <div>${exp.description || ''}</div>
                </div>`
              ).join('')}
            </div>
            <div class="section">
              <div class="section-title">Education</div>
              <div>${resumeData.education || ''}</div>
            </div>
            <div class="section">
              <div class="section-title">Achievements</div>
              <div>${resumeData.achievements || ''}</div>
            </div>
            ${resumeData.certifications ? `<div class="section"><div class="section-title">Certifications</div><div>${resumeData.certifications}</div></div>` : ''}
            ${resumeData.languages && resumeData.languages.length ? `<div class="section"><div class="section-title">Languages</div><div>${resumeData.languages.map(l => l.name ? `${l.name} (${l.level || ''})` : '').join(', ')}</div></div>` : ''}
          </div>
        `;
      default:
        return `<div><h1>${resumeData.name || 'Your Name'}</h1><p>${resumeData.summary || 'Your summary...'}</p></div>`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl w-full mx-auto p-0 border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Resume Preview</h2>
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="relative" ref={downloadMenuRef}>
              <button onClick={() => setShowDownloadOptions(p => !p)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
                <FileDown className="h-4 w-4" /><span>Download</span>
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">As PDF</button>
                  <button onClick={() => handleDownload('png')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">As PNG</button>
                  <button onClick={() => handleDownload('jpeg')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">As JPEG</button>
                </div>
              )}
            </div>

            <div className="relative" ref={shareMenuRef}>
              <button onClick={() => setShowShareOptions(p => !p)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
                <Share2 className="h-4 w-4" /><span>Share</span>
              </button>
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <button onClick={() => handleShare('linkedin')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">On LinkedIn</button>
                  <button onClick={() => handleShare('twitter')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">On Twitter</button>
                  <button onClick={() => handleShare('email')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">By Email</button>
                </div>
              )}
            </div>

            <button onClick={handlePrint} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
                <Printer className="h-4 w-4" /><span>Print</span>
            </button>

          </div>
        </div>
      </div>

      <div className="relative p-6">
        {aiContent
          ? <div ref={resumePreviewRef} dangerouslySetInnerHTML={{ __html: aiContent }} />
          : <div ref={resumePreviewRef} dangerouslySetInnerHTML={{ __html: generateResumeHTML(content || {}) }} />
        }
        {isDownloading && (
          <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
            <p className="text-lg font-semibold">Downloading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;