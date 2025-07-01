// aiProviderService.js
// Multi-provider AI API utility for Hugging Face, OpenAI, DeepSeek, and Groq

const HUGGINGFACE_API_KEY = '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';
const OPENAI_API_KEY = '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';
const DEEPSEEK_API_KEY = 'gR6oZBQlUgvYzwTICq01udDGUWcsej9yemWxOdZz';
const GROQ_API_KEY = 'xai-YTXb7acmvMJqKV0IfuEgmzdgAHhrR0cXv6N8mRultwZuL5mbxx1HXXyCW7gDjYaM5yAXbp2Fd7dHcg3N';
const OPENAI_API_KEY_2 = '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';
const DEEPSEEK_API_KEY_2 = 'sk-54d14d15c36b4928b08b48b50f039199';

// Helper to call Hugging Face (main provider)
async function callHuggingFace(prompt, { max_tokens = 2000, temperature = 0.8 } = {}) {
  try {
    // Use a better model for text generation that can handle HTML
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: Math.min(max_tokens, 1000),
          temperature: Math.min(temperature, 0.9),
          do_sample: true,
          return_full_text: false,
          top_p: 0.9,
          repetition_penalty: 1.1
        }
      })
    });
    console.log('Hugging Face response status:', response.status);
    
    if (!response.ok) {
      console.log('Hugging Face error:', response.status, response.statusText);
      throw new Error(`Hugging Face API error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.log('Hugging Face fetch error:', error);
    throw error;
  }
}

// Helper to call OpenAI
async function callOpenAI(prompt, { max_tokens = 2000, temperature = 0.8 } = {}) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens,
      temperature
    })
  });
  return response;
}

// Helper to call OpenAI with the second key
async function callOpenAI2(prompt, { max_tokens = 2000, temperature = 0.8 } = {}) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY_2}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens,
      temperature
    })
  });
  return response;
}

// Helper to call DeepSeek
async function callDeepSeek(prompt, { max_tokens = 2000, temperature = 0.8 } = {}) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens,
      temperature
    })
  });
  return response;
}

// Helper to call DeepSeek with the second key
async function callDeepSeek2(prompt, { max_tokens = 2000, temperature = 0.8 } = {}) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY_2}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens,
      temperature
    })
  });
  return response;
}

// Helper to call Groq
async function callGroq(prompt, { max_tokens = 2000, temperature = 0.8 } = {}) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama2-70b-4096',
      messages: [{ role: 'user', content: prompt }],
      max_tokens,
      temperature
    })
  });
  return response;
}

// --- New: Intent extraction for better AI command understanding ---
function extractIntent(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('cover letter')) return 'cover_letter';
  if (lower.includes('resume') || lower.includes('cv')) return 'resume';
  if (lower.includes('summary')) return 'summary';
  if (lower.includes('skills')) return 'skills';
  if (lower.includes('experience')) return 'experience';
  if (lower.includes('achievements')) return 'achievements';
  if (lower.includes('profile')) return 'profile';
  if (lower.includes('objective')) return 'objective';
  return 'generic';
}

// --- Enhanced main function ---
export async function generateAIContent(prompt, options = {}) {
  // Detect user intent/command
  const intent = extractIntent(prompt);

  // Structure the prompt for the AI provider
  let structuredPrompt = prompt;
  switch (intent) {
    case 'cover_letter':
      structuredPrompt = `You are an expert career assistant. Generate a professional cover letter based on the following details. Output only the cover letter content.\n${prompt}`;
      break;
    case 'resume':
      structuredPrompt = `You are an expert resume writer. Generate a professional resume (CV) based on the following details. Output only the resume content.\n${prompt}`;
      break;
    case 'summary':
      structuredPrompt = `Write a professional summary for a resume.\n${prompt}`;
      break;
    case 'skills':
      structuredPrompt = `List relevant professional and technical skills for this profile.\n${prompt}`;
      break;
    case 'experience':
      structuredPrompt = `Describe professional work experience for a resume.\n${prompt}`;
      break;
    case 'achievements':
      structuredPrompt = `List key achievements for a resume.\n${prompt}`;
      break;
    case 'profile':
      structuredPrompt = `Write a professional profile section for a resume.\n${prompt}`;
      break;
    case 'objective':
      structuredPrompt = `Write a career objective for a resume.\n${prompt}`;
      break;
    default:
      structuredPrompt = `You are an expert career assistant. Respond to the following request in a professional, relevant way.\n${prompt}`;
  }

  // Check if this is an HTML generation request
  if (isHTMLGenerationRequest(prompt)) {
    console.log('HTML generation detected, using template-based system...');
    return generateHTMLTemplate(prompt);
  }

  // Try Hugging Face first (main provider)
  try {
    const hfRes = await callHuggingFace(structuredPrompt, options);
    if (hfRes.ok) {
      const data = await hfRes.json();
      const generatedText = data[0]?.generated_text || data[0]?.text || '';
      if (generatedText) {
        return generatedText;
      } else {
        throw new Error('No content generated from Hugging Face');
      }
    } else if (hfRes.status === 429) {
      const openaiRes = await callOpenAI(structuredPrompt, options);
      if (openaiRes.ok) {
        const data = await openaiRes.json();
        return data.choices?.[0]?.message?.content || '';
      } else if (openaiRes.status === 429) {
        const deepseekRes = await callDeepSeek(structuredPrompt, options);
        if (deepseekRes.ok) {
          const data = await deepseekRes.json();
          return data.choices?.[0]?.message?.content || '';
        } else if (deepseekRes.status === 429) {
          const groqRes = await callGroq(structuredPrompt, options);
          if (groqRes.ok) {
            const data = await groqRes.json();
            return data.choices?.[0]?.message?.content || '';
          } else if (groqRes.status === 429) {
            const openai2Res = await callOpenAI2(structuredPrompt, options);
            if (openai2Res.ok) {
              const data = await openai2Res.json();
              return data.choices?.[0]?.message?.content || '';
            } else if (openai2Res.status === 429) {
              const deepseek2Res = await callDeepSeek2(structuredPrompt, options);
              if (deepseek2Res.ok) {
                const data = await deepseek2Res.json();
                return data.choices?.[0]?.message?.content || '';
              } else {
                return generateFallbackContent(prompt);
              }
            } else {
              return generateFallbackContent(prompt);
            }
          } else {
            return generateFallbackContent(prompt);
          }
        } else {
          return generateFallbackContent(prompt);
        }
      } else {
        return generateFallbackContent(prompt);
      }
    } else {
      return generateFallbackContent(prompt);
    }
  } catch (e) {
    try {
      const openaiRes = await callOpenAI(structuredPrompt, options);
      if (openaiRes.ok) {
        const data = await openaiRes.json();
        return data.choices?.[0]?.message?.content || '';
      } else {
        return generateFallbackContent(prompt);
      }
    } catch (err) {
      return generateFallbackContent(prompt);
    }
  }
}

// Function to detect HTML generation requests
function isHTMLGenerationRequest(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  return (
    lowerPrompt.includes('html') ||
    lowerPrompt.includes('<!doctype') ||
    lowerPrompt.includes('<html>') ||
    lowerPrompt.includes('css') ||
    lowerPrompt.includes('template') ||
    lowerPrompt.includes('generate a complete html') ||
    lowerPrompt.includes('html document') ||
    lowerPrompt.includes('embedded css')
  );
}

// Function to generate HTML templates based on content type
function generateHTMLTemplate(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract user data from prompt
  const userData = extractUserDataFromPrompt(prompt);
  
  if (lowerPrompt.includes('cover letter')) {
    return generateCoverLetterHTML(userData);
  } else if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) {
    return generateResumeHTML(userData);
  } else {
    return generateGenericHTML(userData);
  }
}

// Function to extract user data from prompt
function extractUserDataFromPrompt(prompt) {
  const data = {
    name: '[Your Name]',
    email: '[Your Email]',
    jobTitle: '[Job Title]',
    companyName: '[Company Name]',
    experience: '[Your Experience]',
    skills: '[Your Skills]',
    summary: '[Your Summary]'
  };
  
  // Try to extract data from prompt
  const nameMatch = prompt.match(/name:\s*([^\n]+)/i);
  if (nameMatch) data.name = nameMatch[1].trim();
  
  const emailMatch = prompt.match(/email:\s*([^\n]+)/i);
  if (emailMatch) data.email = emailMatch[1].trim();
  
  const jobMatch = prompt.match(/job title:\s*([^\n]+)/i);
  if (jobMatch) data.jobTitle = jobMatch[1].trim();
  
  const companyMatch = prompt.match(/company:\s*([^\n]+)/i);
  if (companyMatch) data.companyName = companyMatch[1].trim();
  
  return data;
}

// Function to generate cover letter HTML template
function generateCoverLetterHTML(userData) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const templateHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Cover Letter - ${userData.name || '[Your Name]'}</title>
  <style>
    body {
      background: #f7fafd;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .cover-letter-container {
      max-width: 700px;
      margin: 40px auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 40px 32px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .name {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .title, .contact-info {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 2px;
    }
    .content { margin-top: 32px; }
    .date, .recipient, .body, .signature { margin-bottom: 24px; }
    .recipient strong { color: #2563eb; }
    .editable { border: none; background: transparent; outline: none; min-width: 40px; }
    .editable:focus { background: #f0f4ff; }
    @media (max-width: 600px) {
      .cover-letter-container { padding: 16px 4vw; }
    }
  </style>
</head>
<body>
  <div class="cover-letter-container">
    <div class="header">
      <div class="name editable" contenteditable="true">${userData.name || '[Your Name]'}</div>
      <div class="title editable" contenteditable="true">${userData.jobTitle || '[Job Title]'}</div>
      <div class="contact-info editable" contenteditable="true">${userData.email || '[Your Email]'}</div>
    </div>
    <div class="content">
      <div class="date editable" contenteditable="true">${today}</div>
      <div class="recipient editable" contenteditable="true">
        Hiring Manager<br>
        <strong>${userData.companyName || '[Company Name]'}</strong><br>
        [Company Address]
      </div>
      <div class="body editable" contenteditable="true">
        Dear Hiring Manager,<br><br>
        ${userData.body || `I am writing to express my strong interest in the <b>${userData.jobTitle || '[Job Title]'}</b> position at <b>${userData.companyName || '[Company Name]'}</b>. With a proven track record of delivering exceptional results and a passion for excellence, I am confident in my ability to make significant contributions to your team and help drive the company's continued success.<br><br>
        Throughout my career, I have demonstrated expertise in <b>${userData.skills || '[key skills/areas]'}</b> and a commitment to achieving measurable outcomes. My experience includes <b>${userData.experience || '[relevant experience]'}</b>, which I believe aligns perfectly with the requirements of this position.<br><br>
        I am particularly drawn to <b>${userData.companyName || '[Company Name]'}</b>'s reputation for <b>${userData.companyValues || '[company values/achievements]'}</b> and the opportunity to work with a team that shares my passion for <b>${userData.passion || '[relevant industry/field]'}</b>. I am excited about the possibility of contributing to your organization's continued growth and success.<br><br>
        I look forward to discussing how my skills, experience, and enthusiasm can benefit your team. Thank you for considering my application.`}
      </div>
      <div class="signature editable" contenteditable="true">
        Sincerely,<br>
        ${userData.name || '[Your Name]'}
      </div>
    </div>
  </div>
</body>
</html>`;

  return wrapWithPreviewAndEdit(templateHTML);
}

// Function to generate resume HTML template
function generateResumeHTML(userData) {
  // Multiple design variations for resumes
  const designVariations = [
    {
      name: 'Modern Blue',
      background: '#f5f5f5',
      headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accentColor: '#667eea',
      sectionColor: '#667eea'
    },
    {
      name: 'Professional Dark',
      background: '#f8f9fa',
      headerBg: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      accentColor: '#2c3e50',
      sectionColor: '#2c3e50'
    },
    {
      name: 'Creative Purple',
      background: '#fafafa',
      headerBg: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
      accentColor: '#9C27B0',
      sectionColor: '#9C27B0'
    },
    {
      name: 'Tech Green',
      background: '#f5f5f5',
      headerBg: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
      accentColor: '#4CAF50',
      sectionColor: '#4CAF50'
    },
    {
      name: 'Corporate Red',
      background: '#fafafa',
      headerBg: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
      accentColor: '#f44336',
      sectionColor: '#f44336'
    }
  ];
  
  // Randomly select a design variation
  const selectedDesign = designVariations[Math.floor(Math.random() * designVariations.length)];
  
  const templateHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Resume - ${userData.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: #f7fafd;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      min-height: 100vh;
      padding: 0;
    }
    
    .resume-container {
      margin: 0;
      padding: 0 2vw;
      max-width: 100vw;
      border-radius: 0;
      box-shadow: none;
      background: #fff;
    }
    
    .header {
      background: ${selectedDesign.headerBg};
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .name {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .title {
      font-size: 24px;
      opacity: 0.9;
      margin-bottom: 20px;
    }
    
    .contact-info {
      font-size: 16px;
      opacity: 0.8;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: ${selectedDesign.sectionColor};
      margin-bottom: 15px;
      border-bottom: 2px solid ${selectedDesign.sectionColor};
      padding-bottom: 5px;
    }
    
    .summary {
      font-size: 16px;
      line-height: 1.8;
      text-align: justify;
    }
    
    .experience-item {
      margin-bottom: 25px;
    }
    
    .job-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    
    .company {
      font-size: 18px;
      color: ${selectedDesign.accentColor};
      margin-bottom: 5px;
    }
    
    .dates {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .achievements {
      list-style: none;
      padding-left: 0;
    }
    
    .achievements li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    
    .achievements li:before {
      content: "•";
      color: ${selectedDesign.accentColor};
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .skill-tag {
      background: linear-gradient(135deg, ${selectedDesign.accentColor} 0%, ${selectedDesign.accentColor}dd 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    
    /* Editing styles */
    .editable {
      border: none !important;
      background: transparent !important;
      transition: box-shadow 0.2s;
    }
    
    .editable:focus, .editable:hover {
      outline: none;
      box-shadow: 0 0 0 2px ${selectedDesign.accentColor};
      background: #f0f4ff;
    }
    
    /* Edit mode toggle */
    .edit-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${selectedDesign.accentColor};
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .edit-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    /* Code editor panel */
    .code-editor {
      position: fixed;
      top: 0;
      right: -400px;
      width: 400px;
      height: 100vh;
      background: #1e1e1e;
      color: #fff;
      z-index: 2000;
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    
    .code-editor.open {
      right: 0;
    }
    
    .code-header {
      background: #333;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .code-content {
      flex: 1;
      padding: 15px;
    }
    
    .code-textarea {
      width: 100%;
      height: 100%;
      background: #1e1e1e;
      color: #fff;
      border: none;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      resize: none;
    }
    
    .code-close {
      background: #ff4757;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
    }
    
    @media (max-width: 600px) {
      .resume-container {
        padding: 0 2vw;
      }
      .control-buttons {
        right: 2vw;
        top: 2vw;
        gap: 4px;
      }
    }
  </style>
</head>
<body>
  <button class="edit-toggle" onclick="toggleEditMode()">✏️ Edit Mode</button>
  
  <div class="resume-container">
    <div class="header">
      <div class="name editable" contenteditable="true" data-field="name">${userData.name}</div>
      <div class="title editable" contenteditable="true" data-field="title">${userData.jobTitle}</div>
      <div class="contact-info editable" contenteditable="true" data-field="email">${userData.email}</div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary editable" contenteditable="true" data-field="summary">
          ${userData.summary || 'Results-driven professional with extensive experience in delivering high-impact solutions and driving organizational success. Demonstrated expertise in strategic planning, team leadership, and process optimization. Proven track record of exceeding targets, improving operational efficiency, and fostering collaborative environments.'}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Professional Experience</div>
        <div class="experience-item">
          <div class="job-title editable" contenteditable="true" data-field="job1_title">Senior Project Manager</div>
          <div class="company editable" contenteditable="true" data-field="job1_company">Tech Solutions Inc.</div>
          <div class="dates editable" contenteditable="true" data-field="job1_dates">2020 - Present</div>
          <ul class="achievements">
            <li class="editable" contenteditable="true" data-field="job1_achievement1">Led cross-functional teams of 15+ members to deliver complex projects 20% under budget and 2 weeks ahead of schedule</li>
            <li class="editable" contenteditable="true" data-field="job1_achievement2">Implemented innovative process improvements that increased operational efficiency by 35% and reduced costs by $500K annually</li>
            <li class="editable" contenteditable="true" data-field="job1_achievement3">Managed key client relationships resulting in 25% revenue growth and 95% client retention rate</li>
          </ul>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">
          <span class="skill-tag editable" contenteditable="true" data-field="skill1">Project Management</span>
          <span class="skill-tag editable" contenteditable="true" data-field="skill2">Team Leadership</span>
          <span class="skill-tag editable" contenteditable="true" data-field="skill3">Strategic Planning</span>
          <span class="skill-tag editable" contenteditable="true" data-field="skill4">Process Optimization</span>
          <span class="skill-tag editable" contenteditable="true" data-field="skill5">Client Relations</span>
          <span class="skill-tag editable" contenteditable="true" data-field="skill6">Agile Methodologies</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Code Editor Panel -->
  <div class="code-editor" id="codeEditor">
    <div class="code-header">
      <span>💻 HTML/CSS Editor</span>
      <button class="code-close" onclick="closeCodeEditor()">✕</button>
    </div>
    <div class="code-content">
      <textarea class="code-textarea" id="codeTextarea" placeholder="Edit HTML/CSS here..."></textarea>
    </div>
  </div>

  <script>
    let editMode = false;
    let originalHTML = '';
    
    // Toggle edit mode
    function toggleEditMode() {
      editMode = !editMode;
      const button = document.querySelector('.edit-toggle');
      const editables = document.querySelectorAll('.editable');
      
      if (editMode) {
        button.textContent = '💾 Save Mode';
        button.style.background = '#4CAF50';
        editables.forEach(el => {
          el.contentEditable = true;
          el.style.border = '2px dashed #667eea';
        });
      } else {
        button.textContent = '✏️ Edit Mode';
        button.style.background = '#667eea';
        editables.forEach(el => {
          el.contentEditable = false;
          el.style.border = '2px dashed transparent';
        });
        saveChanges();
      }
    }
    
    // Save changes
    function saveChanges() {
      const data = {};
      document.querySelectorAll('.editable').forEach(el => {
        data[el.dataset.field] = el.textContent;
      });
      localStorage.setItem('resumeData', JSON.stringify(data));
      console.log('Changes saved:', data);
    }
    
    // Load saved changes
    function loadSavedChanges() {
      const saved = localStorage.getItem('resumeData');
      if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(field => {
          const element = document.querySelector(\`[data-field="\${field}"]\`);
          if (element) {
            element.textContent = data[field];
          }
        });
      }
    }
    
    // Open code editor
    function openCodeEditor() {
      const editor = document.getElementById('codeEditor');
      const textarea = document.getElementById('codeTextarea');
      originalHTML = document.documentElement.outerHTML;
      textarea.value = originalHTML;
      editor.classList.add('open');
    }
    
    // Close code editor
    function closeCodeEditor() {
      document.getElementById('codeEditor').classList.remove('open');
    }
    
    // Apply code changes
    function applyCodeChanges() {
      const textarea = document.getElementById('codeTextarea');
      const newHTML = textarea.value;
      
      try {
        // Create a temporary container to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = newHTML;
        
        // Replace the current document content
        document.documentElement.innerHTML = temp.querySelector('html').innerHTML;
        
        // Re-initialize the page
        initializePage();
        closeCodeEditor();
      } catch (error) {
        alert('Invalid HTML/CSS. Please check your code.');
      }
    }
    
    // Initialize page
    function initializePage() {
      loadSavedChanges();
      
      // Add keyboard shortcuts
      document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'e') {
          e.preventDefault();
          toggleEditMode();
        }
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          saveChanges();
        }
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault();
          openCodeEditor();
        }
      });
    }
    
    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', initializePage);
    
    // Auto-save on edit
    document.addEventListener('input', function(e) {
      if (editMode && e.target.classList.contains('editable')) {
        setTimeout(saveChanges, 1000);
      }
    });
  </script>
</body>
</html>`;

  return wrapWithPreviewAndEdit(templateHTML);
}

// Function to generate generic HTML template
function generateGenericHTML(userData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Document</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      padding: 40px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #667eea;
    }
    
    .title {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .content {
      font-size: 16px;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">Professional Document</div>
    </div>
    
    <div class="content">
      <p>This is a professional document generated for ${userData.name}.</p>
      <p>Please customize this template according to your specific needs.</p>
    </div>
  </div>
</body>
</html>`;
}

// Fallback function that generates content using templates when AI providers fail
function generateFallbackContent(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Resume-related fallbacks
  if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv')) {
    if (lowerPrompt.includes('summary') || lowerPrompt.includes('objective')) {
      return `Results-driven professional with extensive experience in delivering high-impact solutions and driving organizational success. Demonstrated expertise in strategic planning, team leadership, and process optimization. Proven track record of exceeding targets, improving operational efficiency, and fostering collaborative environments. Committed to continuous learning and professional development while maintaining the highest standards of excellence in all endeavors.`;
    }
    if (lowerPrompt.includes('experience') || lowerPrompt.includes('work history')) {
      return `• Led cross-functional teams of 15+ members to deliver complex projects 20% under budget and 2 weeks ahead of schedule\n• Implemented innovative process improvements that increased operational efficiency by 35% and reduced costs by $500K annually\n• Managed key client relationships resulting in 25% revenue growth and 95% client retention rate\n• Developed and executed strategic initiatives that drove 40% business expansion and market penetration\n• Mentored junior team members and established best practices that improved team productivity by 30%`;
    }
    if (lowerPrompt.includes('skills')) {
      return `Technical Skills: JavaScript (ES6+), React.js, Node.js, Python, SQL, Git, AWS, Docker, REST APIs, GraphQL\nSoft Skills: Strategic Leadership, Cross-functional Collaboration, Problem Solving, Stakeholder Management, Change Management\nTools & Platforms: VS Code, Docker, AWS Cloud Services, Agile/Scrum, JIRA, Confluence, Slack, Zoom\nCertifications: AWS Certified Solutions Architect, PMP, Agile Scrum Master`;
    }
    if (lowerPrompt.includes('achievements')) {
      return `• Awarded "Employee of the Year" for exceptional performance and leadership in 2023\n• Successfully launched 3 major products generating $2M+ in revenue within first year\n• Reduced customer churn rate by 40% through implementation of customer success initiatives\n• Led digital transformation project that improved team productivity by 50% and reduced operational costs by 30%\n• Recognized as "Top Performer" for 3 consecutive quarters for exceeding sales targets by 150%`;
    }
  }
  
  // Cover letter fallbacks
  if (lowerPrompt.includes('cover letter') || lowerPrompt.includes('application letter')) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Professional Cover Letter</title>
  <style>
    .cover-letter {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(255,255,255,0.3);
    }
    .name {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 5px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .title {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    .contact-info {
      font-size: 14px;
      opacity: 0.8;
    }
    .date {
      margin: 30px 0;
      font-weight: 500;
    }
    .recipient {
      margin-bottom: 30px;
    }
    .body {
      line-height: 1.8;
      font-size: 16px;
      text-align: justify;
    }
    .signature {
      margin-top: 40px;
      font-weight: bold;
    }
    .highlight {
      background: rgba(255,255,255,0.2);
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="cover-letter">
    <div class="header">
      <div class="name">[Your Name]</div>
      <div class="title">[Your Professional Title]</div>
      <div class="contact-info">[Your Email] • [Your Phone] • [Your Location]</div>
    </div>
    
    <div class="date">[Current Date]</div>
    
    <div class="recipient">
      Hiring Manager<br>
      <strong>[Company Name]</strong><br>
      [Company Address]
    </div>
    
    <div class="body">
      <p>Dear Hiring Manager,</p>
      
      <p>I am writing to express my strong interest in the <span class="highlight">[Position Title]</span> role at <strong>[Company Name]</strong>. With my proven track record of delivering exceptional results and passion for excellence, I am confident in my ability to make significant contributions to your team and help drive the company's continued success.</p>
      
      <p>Throughout my career, I have demonstrated expertise in <span class="highlight">[relevant skills/areas]</span> and a commitment to achieving measurable outcomes. My experience includes <span class="highlight">[brief mention of relevant experience]</span>, which I believe aligns perfectly with the requirements of this position.</p>
      
      <p>I am particularly drawn to <strong>[Company Name]</strong>'s reputation for <span class="highlight">[company values/achievements]</span> and the opportunity to work with a team that shares my passion for <span class="highlight">[relevant industry/field]</span>. I am excited about the possibility of contributing to your organization's continued growth and success.</p>
      
      <p>I look forward to discussing how my skills, experience, and enthusiasm can benefit your team. Thank you for considering my application.</p>
    </div>
    
    <div class="signature">
      Sincerely,<br>
      [Your Name]
    </div>
  </div>
</body>
</html>`;
  }
  
  // Skills enhancement
  if (lowerPrompt.includes('skills') || lowerPrompt.includes('technical skills')) {
    return `Technical Skills:\n• Programming Languages: JavaScript (ES6+), TypeScript, Python, Java, C#\n• Frontend: React.js, Vue.js, Angular, HTML5, CSS3, SASS/SCSS, Bootstrap, Tailwind CSS\n• Backend: Node.js, Express.js, Django, ASP.NET Core, REST APIs, GraphQL\n• Databases: MySQL, PostgreSQL, MongoDB, Redis, SQL Server\n• Cloud & DevOps: AWS, Azure, Docker, Kubernetes, CI/CD, Jenkins, GitLab\n• Tools: VS Code, IntelliJ IDEA, Postman, Figma, Adobe Creative Suite\n\nSoft Skills:\n• Leadership & Management: Team Leadership, Project Management, Strategic Planning\n• Communication: Stakeholder Management, Client Relations, Technical Documentation\n• Problem Solving: Analytical Thinking, Creative Solutions, Root Cause Analysis\n• Collaboration: Cross-functional Teams, Agile Methodologies, Remote Work`;
  }
  
  // Professional summary enhancement
  if (lowerPrompt.includes('summary') || lowerPrompt.includes('professional summary')) {
    return `Accomplished professional with over 8 years of experience driving organizational success through strategic leadership and innovative solutions. Proven track record of leading cross-functional teams, optimizing operational processes, and delivering exceptional results that exceed business objectives. Expertise in project management, stakeholder relations, and implementing transformative initiatives that drive growth and efficiency. Recognized for strong analytical skills, creative problem-solving abilities, and commitment to continuous improvement. Passionate about mentoring team members and fostering collaborative environments that promote professional development and organizational excellence.`;
  }
  
  // Work experience enhancement
  if (lowerPrompt.includes('experience') || lowerPrompt.includes('work history') || lowerPrompt.includes('job description')) {
    return `Senior Project Manager | Tech Solutions Inc. | 2020 - Present\n• Led 5 concurrent projects with combined budget of $2.5M, delivering all on time and 15% under budget\n• Managed cross-functional teams of 25+ professionals across development, design, and QA departments\n• Implemented Agile methodologies that improved project delivery speed by 40% and team satisfaction by 60%\n• Established strategic partnerships with 3 key vendors, reducing procurement costs by $300K annually\n• Developed and executed risk mitigation strategies that prevented 95% of potential project delays\n\nProduct Manager | Innovation Corp | 2018 - 2020\n• Launched 2 successful products generating $1.8M in first-year revenue\n• Conducted market research and user interviews with 500+ customers to inform product strategy\n• Collaborated with engineering teams to define product requirements and prioritize feature development\n• Increased user engagement by 65% through data-driven optimization and A/B testing`;
  }
  
  // Default fallback with more helpful content
  return `I apologize, but I'm currently experiencing technical difficulties with the AI service. Here's a professional template to help you get started:\n\nFor Resume Summary:\n"Results-driven professional with proven expertise in [your field]. Demonstrated success in [key achievements]. Skilled in [relevant skills] with a track record of [measurable outcomes]."\n\nFor Work Experience:\n"• Led [specific project/team] resulting in [measurable outcome]\n• Implemented [specific initiative] that improved [metric] by [percentage]\n• Managed [responsibility] for [timeframe] achieving [results]"\n\nPlease try again in a few minutes, or contact support if the issue persists.`;
}

// --- Improved Floating Action Buttons for Template Editing ---
function wrapWithPreviewAndEdit(templateHTML) {
  return `
    <div id="ai-template-preview-container" style="max-width:1000px;margin:32px auto 0 auto;padding:0 2vw;position:relative;">
      <div id="ai-template-preview" style="box-shadow:0 4px 16px rgba(60,60,120,0.08);border-radius:12px;overflow:hidden;background:#fff;">
        ${templateHTML}
      </div>
    </div>
  `;
}

// --- Enhanced Modal with Mode Tabs ---
function wrapInModal(templateHTML, mode) {
  // mode can be 'edit', 'code', or 'ai'
  return `
  <div id="ai-template-modal-overlay" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(30,41,59,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;overflow:auto;animation:fadeIn 0.3s;">
    <div id="ai-template-modal-container" style="background:#fff;max-width:1000px;width:96vw;max-height:96vh;overflow:auto;box-shadow:0 8px 32px rgba(60,60,120,0.18);border-radius:18px;position:relative;animation:slideIn 0.3s;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 24px 0 24px;">
        <span style="font-size:20px;font-weight:600;color:#3730a3;">Edit Your Template</span>
        <button id="ai-template-modal-close" style="background:#f3f4f6;border:none;border-radius:50%;width:40px;height:40px;font-size:22px;cursor:pointer;z-index:10001;box-shadow:0 2px 8px rgba(60,60,120,0.10);">&times;</button>
      </div>
      <div style="display:flex;gap:0.5rem;padding:0 24px 0 24px;margin-top:12px;">
        <button class="modal-tab-btn" id="modal-tab-edit" style="background:${mode==='edit'?'#4f46e5':'#f3f4f6'};color:${mode==='edit'?'#fff':'#3730a3'};border:none;border-radius:16px 16px 0 0;padding:8px 24px;font-size:16px;cursor:pointer;">Edit</button>
        <button class="modal-tab-btn" id="modal-tab-code" style="background:${mode==='code'?'#6366f1':'#f3f4f6'};color:${mode==='code'?'#fff':'#3730a3'};border:none;border-radius:16px 16px 0 0;padding:8px 24px;font-size:16px;cursor:pointer;">Code</button>
        <button class="modal-tab-btn" id="modal-tab-ai" style="background:${mode==='ai'?'#10b981':'#f3f4f6'};color:${mode==='ai'?'#fff':'#3730a3'};border:none;border-radius:16px 16px 0 0;padding:8px 24px;font-size:16px;cursor:pointer;">AI</button>
      </div>
      <div id="modal-content" style="padding:0;">${templateHTML}</div>
    </div>
  </div>
  <style>
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateY(40px); opacity: 0; } to { transform: none; opacity: 1; } }
    .modal-tab-btn:focus { outline: 2px solid #6366f1; }
  </style>
  <script>
    document.body.style.overflow = 'hidden';
    document.getElementById('ai-template-modal-close').onclick = function() {
      document.getElementById('ai-template-modal-overlay').remove();
      document.body.style.overflow = '';
    };
    document.getElementById('ai-template-modal-overlay').onclick = function(e) {
      if (e.target === this) {
        document.getElementById('ai-template-modal-close').click();
      }
    };
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const btn = document.getElementById('ai-template-modal-close');
        if (btn) btn.click();
      }
    });
    // Tab switching
    document.getElementById('modal-tab-edit').onclick = function() {
      const modalHTML = window.wrapInModal(document.getElementById('modal-content').innerHTML, 'edit');
      document.getElementById('ai-template-modal-overlay').outerHTML = modalHTML;
    };
    document.getElementById('modal-tab-code').onclick = function() {
      const modalHTML = window.wrapInModal(document.getElementById('modal-content').innerHTML, 'code');
      document.getElementById('ai-template-modal-overlay').outerHTML = modalHTML;
    };
    document.getElementById('modal-tab-ai').onclick = function() {
      const modalHTML = window.wrapInModal(document.getElementById('modal-content').innerHTML, 'ai');
      document.getElementById('ai-template-modal-overlay').outerHTML = modalHTML;
    };
  </script>
  `;
} 