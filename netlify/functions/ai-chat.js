const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: 'OpenAI API key not set',
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: 'Invalid JSON',
    };
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      body: 'Missing or invalid messages array',
    };
  }

  // Add system prompt for command understanding and resume assistant behavior
  const systemPrompt = {
    role: 'system',
    content: `You are an AI resume assistant. You can generate resumes, cover letters, and answer career-related questions. If the user gives a command (e.g., 'generate a resume for a software engineer'), follow it. If they chat, respond conversationally. Always use context from previous messages.`
  };

  const openaiMessages = [systemPrompt, ...messages];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: openaiMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        statusCode: response.status,
        body: error,
      };
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiMessage }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.toString(),
    };
  }
}; 