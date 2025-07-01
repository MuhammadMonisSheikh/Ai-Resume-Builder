// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { useState } from 'react';
import { ArrowLeft, Target, CheckCircle, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ResumeForm from '../components/ResumeForm';

const ResumeForFreshers = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    objective: '',
    education: '',
    projects: '',
    skills: '',
    certifications: '',
    languages: '',
    internships: '',
    volunteerWork: '',
    achievements: ''
  });

  const [atsScore, setAtsScore] = useState(0);
  const [resumeContent, setResumeContent] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateATSScore = () => {
    let score = 0;
    if (formData.name) score += 10;
    if (formData.email) score += 10;
    if (formData.phone) score += 10;
    if (formData.location) score += 10;
    if (formData.objective) score += 15;
    if (formData.education) score += 15;
    if (formData.projects) score += 15;
    if (formData.skills) score += 15;
    setAtsScore(Math.min(score, 100));
  };

  const generateFresherResume = () => {
    calculateATSScore();
    setResumeContent(JSON.stringify(formData));
  };

  const generateATSResume = (data) => {
    return `
      <div class="resume-container" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
        <!-- Header Section -->
        <div class="header" style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #2563eb; margin: 0 0 10px 0;">${data.name || 'Your Name'}</h1>
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Fresh Graduate | Entry Level Professional</div>
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">
            ${data.email || 'email@example.com'} | ${data.phone || '(555) 123-4567'}
          </div>
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">
            ${data.location || 'City, State'} 
            ${data.linkedin ? `| LinkedIn: ${data.linkedin}` : ''}
            ${data.github ? `| GitHub: ${data.github}` : ''}
          </div>
          ${data.portfolio ? `<div style="font-size: 14px; color: #666;">Portfolio: ${data.portfolio}</div>` : ''}
        </div>

        <!-- Career Objective -->
        <div class="section" style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">
            CAREER OBJECTIVE
          </h2>
          <p style="margin: 0; text-align: justify;">
            ${data.objective || 'Motivated and enthusiastic fresh graduate seeking an entry-level position to apply academic knowledge and develop professional skills. Eager to contribute to organizational success while gaining valuable industry experience and continuous learning opportunities.'}
          </p>
        </div>

        <!-- Education -->
        <div class="section" style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">
            EDUCATION
          </h2>
          <div style="margin-bottom: 20px;">
            ${data.education ? data.education.split('\n').map(line => 
              line.trim() ? `<p style="margin: 0 0 8px 0;">${line}</p>` : ''
            ).join('') : `
              <p style="margin: 0 0 8px 0;"><strong>Bachelor's Degree in Computer Science</strong></p>
              <p style="margin: 0 0 8px 0;">University Name, Graduation Year: 2024</p>
              <p style="margin: 0 0 8px 0;">GPA: 3.8/4.0 | Relevant Coursework: Data Structures, Algorithms, Web Development, Database Systems</p>
            `}
          </div>
        </div>

        <!-- Technical Skills -->
        <div class="section" style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">
            TECHNICAL SKILLS
          </h2>
          <p style="margin: 0;">
            <strong>Programming Languages:</strong> ${data.skills || 'Java, Python, JavaScript, HTML/CSS, SQL'}
          </p>
          ${data.certifications ? `<p style="margin: 10px 0 0 0;"><strong>Certifications:</strong> ${data.certifications}</p>` : ''}
          ${data.languages ? `<p style="margin: 10px 0 0 0;"><strong>Languages:</strong> ${data.languages}</p>` : ''}
        </div>

        <!-- Projects -->
        <div class="section" style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">
            ACADEMIC PROJECTS
          </h2>
          <div style="margin-bottom: 20px;">
            ${data.projects ? data.projects.split('\n').map(line => 
              line.trim() ? `<p style="margin: 0 0 8px 0;">${line}</p>` : ''
            ).join('') : `
              <p style="margin: 0 0 8px 0;"><strong>E-Commerce Website</strong> - Full-stack web application</p>
              <p style="margin: 0 0 8px 0;">• Developed using React.js, Node.js, and MongoDB</p>
              <p style="margin: 0 0 8px 0;">• Implemented user authentication and payment integration</p>
              <p style="margin: 0 0 8px 0;">• Collaborated with team of 4 students to deliver project on time</p>
            `}
          </div>
        </div>

        <!-- Internships -->
        ${data.internships ? `
          <div class="section" style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">
              INTERNSHIPS
            </h2>
            <div style="margin-bottom: 20px;">
              ${data.internships.split('\n').map(line => 
                line.trim() ? `<p style="margin: 0 0 8px 0;">${line}</p>` : ''
              ).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Volunteer Work -->
        ${data.volunteerWork ? `
          <div class="section" style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">
              VOLUNTEER WORK & LEADERSHIP
            </h2>
            <div style="margin-bottom: 20px;">
              ${data.volunteerWork.split('\n').map(line => 
                line.trim() ? `<p style="margin: 0 0 8px 0;">${line}</p>` : ''
              ).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Achievements -->
        ${data.achievements ? `
          <div class="section" style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">
              ACHIEVEMENTS & AWARDS
            </h2>
            <div style="margin-bottom: 20px;">
              ${data.achievements.split('\n').map(line => 
                line.trim() ? `<p style="margin: 0 0 8px 0;">${line}</p>` : ''
              ).join('')}
            </div>
          </div>
        ` : ''}

        <!-- ATS Optimization Note -->
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin-top: 30px; font-size: 12px; color: #0369a1;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <CheckCircle style="width: 16px; height: 16px; margin-right: 8px;" />
            <strong>ATS-Optimized Fresh Graduate Resume</strong>
          </div>
          <p style="margin: 0; line-height: 1.4;">
            This resume is specifically designed for fresh graduates and entry-level candidates. 
            It emphasizes academic achievements, projects, and transferable skills while maintaining 
            ATS compatibility for maximum visibility in automated screening systems.
          </p>
        </div>
      </div>
    `;
  };

  const formatResumeContent = (content) => {
    try {
      const data = JSON.parse(content);
      return generateATSResume(data);
    } catch (error) {
      return `<div class="resume-content">${content.replace(/\n/g, '<br>')}</div>`;
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ATS-Friendly Fresh Graduate Resume</title>
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
              @media print {
                .ats-note { display: none; }
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${formatResumeContent(resumeContent)}
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
            <title>ATS-Friendly Fresh Graduate Resume - ${new Date().toLocaleDateString()}</title>
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
            ${formatResumeContent(resumeContent)}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <Helmet>
        <title>Resume for Freshers | Free ATS Resume Builder for New Graduates</title>
        <meta name="description" content="Create a professional, ATS-optimized resume for freshers and new graduates. Use our free AI-powered builder to land your first job with expert templates and keyword optimization." />
        <meta name="keywords" content="fresher resume, resume for freshers, graduate cv, entry-level resume, ats resume, free resume builder, job application, new graduate cv" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ai-resume-pro.com/resume-for-freshers" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-resume-pro.com/resume-for-freshers" />
        <meta property="og:title" content="Resume for Freshers | Free ATS Resume Builder for New Graduates" />
        <meta property="og:description" content="Create a professional, ATS-optimized resume for freshers and new graduates. Use our free AI-powered builder to land your first job with expert templates and keyword optimization." />
        <meta property="og:image" content="https://ai-resume-pro.com/og-image.png" />
        <meta property="og:site_name" content="AI Resume Pro" />
        <meta property="og:locale" content="en_US" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ai-resume-pro.com/resume-for-freshers" />
        <meta property="twitter:title" content="Resume for Freshers | Free ATS Resume Builder for New Graduates" />
        <meta property="twitter:description" content="Create a professional, ATS-optimized resume for freshers and new graduates. Use our free AI-powered builder to land your first job with expert templates and keyword optimization." />
        <meta property="twitter:image" content="https://ai-resume-pro.com/og-image.png" />
        <meta property="twitter:site" content="@monis_vohra" />
        <meta property="twitter:creator" content="@monis_vohra" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">Resume Builder for Freshers</h1>
        <p className="text-center text-gray-600 mb-8">Create a resume that highlights your skills and education, even with no work experience.</p>
        <ResumeForm />
      </div>
    </>
  );
};

export default ResumeForFreshers;