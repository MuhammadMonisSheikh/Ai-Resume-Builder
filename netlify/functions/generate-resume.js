exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // For demo purposes, we'll generate a resume template
    // In production, you would call OpenAI API here
    const resume = generateResumeTemplate(data);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resume })
    };
  } catch (error) {
    console.error('Error generating resume:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate resume' })
    };
  }
};

function generateResumeTemplate(data) {
  const experienceMap = {
    'entry': 'Entry-level professional',
    'mid': 'Mid-level professional',
    'senior': 'Senior-level professional'
  };

  return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
  <header style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #2563eb;">
    <h1 style="color: #2563eb; font-size: 2.5em; margin: 0;">${data.name}</h1>
    <p style="font-size: 1.2em; color: #666; margin: 10px 0;">${data.jobTitle}</p>
    <p style="color: #666;">${data.email} | ${data.phone}</p>
  </header>

  <section style="margin-bottom: 25px;">
    <h2 style="color: #2563eb; border-bottom: 1px solid #2563eb; padding-bottom: 5px;">Professional Summary</h2>
    <p>${experienceMap[data.experienceLevel]} with expertise in ${data.jobTitle.toLowerCase()}. Passionate about delivering high-quality results and contributing to team success through strong technical skills and collaborative approach.</p>
  </section>

  <section style="margin-bottom: 25px;">
    <h2 style="color: #2563eb; border-bottom: 1px solid #2563eb; padding-bottom: 5px;">Core Skills</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      ${data.skills.split(',').map(skill => 
        `<span style="background: #f0f9ff; color: #2563eb; padding: 5px 12px; border-radius: 15px; font-size: 0.9em;">${skill.trim()}</span>`
      ).join('')}
    </div>
  </section>

  <section style="margin-bottom: 25px;">
    <h2 style="color: #2563eb; border-bottom: 1px solid #2563eb; padding-bottom: 5px;">Education</h2>
    <p>${data.education}</p>
  </section>

  ${data.experience ? `
  <section style="margin-bottom: 25px;">
    <h2 style="color: #2563eb; border-bottom: 1px solid #2563eb; padding-bottom: 5px;">Professional Experience</h2>
    <p>${data.experience}</p>
  </section>
  ` : ''}

  <section>
    <h2 style="color: #2563eb; border-bottom: 1px solid #2563eb; padding-bottom: 5px;">Key Strengths</h2>
    <ul>
      <li>Strong analytical and problem-solving abilities</li>
      <li>Excellent communication and teamwork skills</li>
      <li>Adaptable and eager to learn new technologies</li>
      <li>Detail-oriented with focus on quality delivery</li>
    </ul>
  </section>
</div>
  `.trim();
}