const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'analytics-log.json');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
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

  const { eventType, message, feedback, timestamp, userId } = body;
  if (!eventType || !timestamp) {
    return {
      statusCode: 400,
      body: 'Missing required fields',
    };
  }

  // Log event to file
  let log = [];
  try {
    if (fs.existsSync(LOG_FILE)) {
      log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    }
  } catch (e) {
    log = [];
  }
  log.push({ eventType, message, feedback, timestamp, userId });
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
  } catch (e) {
    return {
      statusCode: 500,
      body: 'Failed to write log',
    };
  }

  return {
    statusCode: 200,
    body: 'Event logged',
  };
}; 