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
    
    // For demo purposes, we'll generate a cover letter template
    // In production, you would call OpenAI API here
    const coverLetter = generateCoverLetterTemplate(data);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coverLetter })
    };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate cover letter' })
    };
  }
};

function generateCoverLetterTemplate(data) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
${data.name}
${data.email}

${currentDate}

Dear Hiring Manager,

I am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. With my background in ${data.experience}, I am excited about the opportunity to contribute to your team's success and help drive ${data.companyName}'s continued growth.

Based on the job description you've provided, I believe my skills and experience align perfectly with your requirements. My expertise includes:

• Strong foundation in the key areas mentioned in your job posting
• Proven ability to work effectively in dynamic, fast-paced environments  
• Excellent problem-solving skills and attention to detail
• Strong communication abilities and collaborative mindset

What particularly attracts me to ${data.companyName} is your commitment to excellence and innovation. I am eager to bring my passion for ${data.jobTitle.toLowerCase()} work and my dedication to delivering high-quality results to your organization.

I am confident that my background and enthusiasm make me an ideal candidate for this role. I would welcome the opportunity to discuss how my skills and experience can contribute to ${data.companyName}'s objectives.

Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
${data.name}
  `.trim();
}