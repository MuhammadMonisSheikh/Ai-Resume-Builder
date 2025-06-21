import fs from 'fs';
import { createCanvas } from 'canvas';

// Template configurations with realistic layouts
const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    color: '#3B82F6',
    style: 'modern'
  },
  {
    id: 'classic',
    name: 'Classic Traditional',
    color: '#6B7280',
    style: 'classic'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    color: '#10B981',
    style: 'minimal'
  },
  {
    id: 'executive',
    name: 'Executive Summary',
    color: '#8B5CF6',
    style: 'executive'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    color: '#EC4899',
    style: 'creative'
  },
  {
    id: 'tech',
    name: 'Tech/Developer',
    color: '#6366F1',
    style: 'tech'
  },
  {
    id: 'modern-sidebar',
    name: 'Modern Sidebar',
    style: 'modern-sidebar'
  },
  {
    id: 'creative-timeline',
    name: 'Creative Timeline',
    style: 'creative-timeline'
  },
  {
    id: 'professional-accent',
    name: 'Professional Accent',
    style: 'professional-accent'
  },
  {
    id: 'professional-modern',
    name: 'Professional Modern',
    style: 'professional-modern'
  },
  {
    id: 'executive-dark',
    name: 'Executive Dark',
    style: 'executive-dark'
  }
];

// Create directory if it doesn't exist
const dir = './public/images/templates';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const createModernTemplate = (ctx, width, height) => {
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Header with accent color
  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(0, 0, width, 80);

  // Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('JOHN DOE', width/2, 35);

  // Title
  ctx.font = '16px Arial';
  ctx.fillText('Software Developer', width/2, 55);

  // Contact info
  ctx.font = '12px Arial';
  ctx.fillText('john.doe@email.com • (555) 123-4567 • New York, NY', width/2, 70);

  // Content sections
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('PROFESSIONAL SUMMARY', 20, 110);
  
  ctx.fillStyle = '#6B7280';
  ctx.font = '12px Arial';
  ctx.fillText('Experienced software developer with 5+ years in web development...', 20, 130);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('SKILLS', 20, 160);
  
  ctx.fillStyle = '#6B7280';
  ctx.font = '12px Arial';
  ctx.fillText('JavaScript, React, Node.js, Python, SQL, AWS, Git', 20, 180);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('EXPERIENCE', 20, 210);
  
  ctx.fillStyle = '#6B7280';
  ctx.font = '12px Arial';
  ctx.fillText('Senior Developer - Tech Corp (2020-2024)', 20, 230);
  ctx.fillText('• Led development of 3 major web applications', 25, 245);
  ctx.fillText('• Improved performance by 40%', 25, 260);
};

const createClassicTemplate = (ctx, width, height) => {
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 28px Times New Roman';
  ctx.textAlign = 'center';
  ctx.fillText('JOHN DOE', width/2, 40);

  // Contact info
  ctx.font = '14px Times New Roman';
  ctx.fillText('john.doe@email.com | (555) 123-4567 | New York, NY', width/2, 60);

  // Divider
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 80);
  ctx.lineTo(width - 20, 80);
  ctx.stroke();

  // Sections
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 18px Times New Roman';
  ctx.textAlign = 'left';
  ctx.fillText('EDUCATION', 20, 110);
  
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 14px Times New Roman';
  ctx.fillText('Bachelor of Science in Computer Science', 20, 130);
  ctx.font = '12px Times New Roman';
  ctx.fillText('University of Technology, 2018-2022', 20, 145);

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 18px Times New Roman';
  ctx.fillText('EXPERIENCE', 20, 180);
  
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 14px Times New Roman';
  ctx.fillText('Software Developer, Tech Solutions Inc.', 20, 200);
  ctx.font = '12px Times New Roman';
  ctx.fillText('January 2022 - Present', 20, 215);
  ctx.fillText('• Developed and maintained web applications', 25, 235);
  ctx.fillText('• Collaborated with cross-functional teams', 25, 250);
};

const createMinimalTemplate = (ctx, width, height) => {
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Name
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 26px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('John Doe', 20, 40);

  // Title
  ctx.fillStyle = '#6B7280';
  ctx.font = '16px Arial';
  ctx.fillText('Software Developer', 20, 60);

  // Contact
  ctx.font = '12px Arial';
  ctx.fillText('john.doe@email.com • (555) 123-4567 • New York, NY', 20, 80);

  // Sections with minimal styling
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('SUMMARY', 20, 110);
  
  ctx.fillStyle = '#374151';
  ctx.font = '12px Arial';
  ctx.fillText('Software developer with expertise in modern web technologies.', 20, 130);

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('SKILLS', 20, 160);
  
  ctx.fillStyle = '#374151';
  ctx.font = '12px Arial';
  ctx.fillText('JavaScript, React, Node.js, Python, SQL', 20, 180);

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('EXPERIENCE', 20, 210);
  
  ctx.fillStyle = '#374151';
  ctx.font = '12px Arial';
  ctx.fillText('Software Developer - Tech Company (2022-2024)', 20, 230);
  ctx.fillText('• Built scalable web applications', 25, 245);
  ctx.fillText('• Optimized database queries', 25, 260);
};

const createExecutiveTemplate = (ctx, width, height) => {
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Header with dark background
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(0, 0, width, 100);

  // Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('JOHN DOE', width/2, 45);

  // Title
  ctx.font = '18px Arial';
  ctx.fillText('Chief Technology Officer', width/2, 70);

  // Contact
  ctx.font = '14px Arial';
  ctx.fillText('john.doe@email.com • (555) 123-4567 • New York, NY', width/2, 90);

  // Executive Summary
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('EXECUTIVE SUMMARY', 20, 130);
  
  ctx.fillStyle = '#374151';
  ctx.font = '12px Arial';
  ctx.fillText('Strategic technology leader with 15+ years of experience...', 20, 150);

  // Key Achievements
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('KEY ACHIEVEMENTS', 20, 180);
  
  ctx.fillStyle = '#374151';
  ctx.font = '12px Arial';
  ctx.fillText('• Led digital transformation initiatives', 20, 200);
  ctx.fillText('• Managed $50M technology budget', 20, 215);
  ctx.fillText('• Increased team productivity by 60%', 20, 230);
};

const createCreativeTemplate = (ctx, width, height) => {
  // Background with gradient effect
  ctx.fillStyle = '#FDF2F8';
  ctx.fillRect(0, 0, width, height);

  // Creative header
  ctx.fillStyle = '#EC4899';
  ctx.fillRect(0, 0, width, 90);

  // Name with creative font
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('JOHN DOE', width/2, 40);

  // Creative title
  ctx.font = 'italic 16px Arial';
  ctx.fillText('Creative Developer & Designer', width/2, 65);

  // Contact
  ctx.font = '12px Arial';
  ctx.fillText('john.doe@email.com • (555) 123-4567 • New York, NY', width/2, 85);

  // Portfolio section
  ctx.fillStyle = '#831843';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('PORTFOLIO', 20, 120);
  
  ctx.fillStyle = '#9D174D';
  ctx.font = '12px Arial';
  ctx.fillText('• E-commerce Website Redesign', 20, 140);
  ctx.fillText('• Mobile App UI/UX Design', 20, 155);
  ctx.fillText('• Brand Identity Package', 20, 170);

  // Skills with icons (represented by colored circles)
  ctx.fillStyle = '#EC4899';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('SKILLS', 20, 200);
  
  ctx.fillStyle = '#9D174D';
  ctx.font = '12px Arial';
  ctx.fillText('Figma, Adobe Creative Suite, React, UI/UX Design', 20, 220);
};

const createTechTemplate = (ctx, width, height) => {
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Header with tech accent
  ctx.fillStyle = '#6366F1';
  ctx.fillRect(0, 0, width, 80);

  // Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Courier New"';
  ctx.textAlign = 'center';
  ctx.fillText('JOHN DOE', width/2, 35);

  // Title
  ctx.font = '16px "Courier New"';
  ctx.fillText('Full Stack Developer', width/2, 55);

  // Contact
  ctx.font = '12px "Courier New"';
  ctx.fillText('john.doe@email.com • (555) 123-4567 • New York, NY', width/2, 70);

  // Tech skills section
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 16px "Courier New"';
  ctx.textAlign = 'left';
  ctx.fillText('TECHNICAL SKILLS', 20, 110);
  
  ctx.fillStyle = '#374151';
  ctx.font = '12px "Courier New"';
  ctx.fillText('Languages: JavaScript, Python, TypeScript, SQL', 20, 130);
  ctx.fillText('Frameworks: React, Node.js, Express, Django', 20, 145);
  ctx.fillText('Tools: Git, Docker, AWS, CI/CD', 20, 160);

  // Projects section
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 16px "Courier New"';
  ctx.fillText('PROJECTS', 20, 190);
  
  ctx.fillStyle = '#374151';
  ctx.font = '12px "Courier New"';
  ctx.fillText('• E-commerce Platform (React + Node.js)', 20, 210);
  ctx.fillText('• API Gateway (Express + MongoDB)', 20, 225);
  ctx.fillText('• CI/CD Pipeline (GitHub Actions)', 20, 240);
};

const createModernSidebarTemplate = (ctx, width, height) => {
  // Sidebar
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(0, 0, 120, height);

  // Photo
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(60, 50, 30, 0, Math.PI * 2, true);
  ctx.fill();

  // Sidebar sections
  ctx.fillStyle = '#1ABC9C';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('LINKS', 15, 110);
  ctx.fillText('LANGUAGES', 15, 160);
  ctx.fillText('REFERENCES', 15, 210);

  ctx.fillStyle = '#ECF0F1';
  ctx.font = '10px Arial';
  ctx.fillText('linkedin.com/...', 15, 125);
  ctx.fillText('English, Spanish', 15, 175);
  ctx.fillText('Available upon...', 15, 225);

  // Main content
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(120, 0, width - 120, height);
  
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('DON DRAPER', 140, 40);
  
  ctx.fillStyle = '#34495E';
  ctx.font = '16px Arial';
  ctx.fillText('ATS Templates Specialist', 140, 60);

  ctx.font = 'bold 14px Arial';
  ctx.fillText('ABOUT ME', 140, 100);
  ctx.fillText('WORK EXPERIENCE', 140, 160);
  ctx.fillText('SKILLS', 140, 220);
};

const createCreativeTimelineTemplate = (ctx, width, height) => {
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  
  // Header
  ctx.fillStyle = '#2D3748';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('MANDY COLBERT', width/2, 40);
  ctx.font = '12px Arial';
  ctx.fillText('mandy.colbert@email.com | (555) 123-4567 | New York, NY', width/2, 60);

  // Section titles with red accent
  ctx.fillStyle = '#E53E3E';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('WORK EXPERIENCE', 20, 100);
  ctx.fillText('EDUCATION', 20, 180);

  // Timeline content
  ctx.fillStyle = '#2D3748';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('Company Name Here', 20, 120);
  ctx.textAlign = 'right';
  ctx.fillText('Sep 2015 - Present', width - 20, 120);

  ctx.textAlign = 'left';
  ctx.font = '10px Arial';
  ctx.fillText('• Lorem ipsum dolor sit amet...', 25, 135);
};

const createProfessionalAccentTemplate = (ctx, width, height) => {
  // Header background
  ctx.fillStyle = '#F8F9FA';
  ctx.fillRect(0, 0, width, 80);

  // Header text
  ctx.fillStyle = '#212529';
  ctx.font = 'bold 24px Georgia';
  ctx.textAlign = 'left';
  ctx.fillText('EMILY MILLER', 20, 40);
  ctx.font = '16px Georgia';
  ctx.fillText('Creative Director', 20, 60);
  
  // Main background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 80, width, height - 80);

  // Accent bar
  ctx.fillStyle = '#198754';
  ctx.fillRect(0, 80, 8, height - 80);

  // Section titles
  ctx.fillStyle = '#198754';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('CAREER OBJECTIVE', 20, 120);
  ctx.fillText('WORK EXPERIENCE', 20, 180);
};

const createProfessionalModernTemplate = (ctx, width, height) => {
  // Header
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, 80);
  
  ctx.fillStyle = '#06B6D4';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('ANDREW CLARK', 20, 40);
  
  ctx.fillStyle = '#6B7280';
  ctx.font = '12px Arial';
  ctx.fillText('Experienced Project Manager | IT | Leadership', 20, 60);

  // Photo
  ctx.fillStyle = '#E5E7EB';
  ctx.beginPath();
  ctx.arc(width - 50, 40, 30, 0, Math.PI * 2, true);
  ctx.fill();

  // Main content body
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 80, width, height - 80);

  // Main content (left column)
  ctx.fillStyle = '#06B6D4';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('SUMMARY', 20, 110);
  ctx.fillText('EXPERIENCE', 20, 170);

  // Sidebar (right column)
  const sidebarX = 250;
  ctx.fillText('SKILLS', sidebarX, 110);
  ctx.fillText('STRENGTHS', sidebarX, 170);
  ctx.fillText('LANGUAGES', sidebarX, 230);
};

const createExecutiveDarkTemplate = (ctx, width, height) => {
  // Dark Header
  ctx.fillStyle = '#2D3748';
  ctx.fillRect(0, 0, width, 60);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('RACHEL JOHNSON', 15, 30);
  ctx.font = '12px Arial';
  ctx.fillStyle = '#A0AEC0';
  ctx.fillText('HR Professional', 15, 48);

  // Body
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 60, width, height - 60);

  // Photo
  const photoX = width / 2;
  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.arc(photoX, 85, 30, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Columns
  const mainX = 15;
  const sidebarX = width * 0.6;
  ctx.fillStyle = '#2D3748';
  ctx.font = 'bold 10px Arial';
  ctx.fillText('WORK EXPERIENCE', mainX, 140);
  ctx.fillText('SKILLS & COMPETENCIES', sidebarX, 140);
  ctx.fillText('EDUCATION', sidebarX, 220);
};

templates.forEach(template => {
  const canvas = createCanvas(400, 300);
  const ctx = canvas.getContext('2d');

  switch(template.style) {
    case 'modern':
      createModernTemplate(ctx, 400, 300);
      break;
    case 'classic':
      createClassicTemplate(ctx, 400, 300);
      break;
    case 'minimal':
      createMinimalTemplate(ctx, 400, 300);
      break;
    case 'executive':
      createExecutiveTemplate(ctx, 400, 300);
      break;
    case 'creative':
      createCreativeTemplate(ctx, 400, 300);
      break;
    case 'tech':
      createTechTemplate(ctx, 400, 300);
      break;
    case 'modern-sidebar':
      createModernSidebarTemplate(ctx, 400, 300);
      break;
    case 'creative-timeline':
      createCreativeTimelineTemplate(ctx, 400, 300);
      break;
    case 'professional-accent':
      createProfessionalAccentTemplate(ctx, 400, 300);
      break;
    case 'professional-modern':
      createProfessionalModernTemplate(ctx, 400, 300);
      break;
    case 'executive-dark':
      createExecutiveDarkTemplate(ctx, 400, 300);
      break;
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`${dir}/${template.id}.png`, buffer);
  console.log(`Generated ${template.id}.png`);
});

// Create a generic placeholder
const canvas = createCanvas(400, 300);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#F1F5F9';
ctx.fillRect(0, 0, 400, 300);

ctx.fillStyle = '#94A3B8';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Template Preview', 200, 150);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(`${dir}/placeholder.png`, buffer);
console.log('Generated placeholder.png');

console.log('All template images generated successfully!'); 