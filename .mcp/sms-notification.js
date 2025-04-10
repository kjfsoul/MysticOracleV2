/**
 * SMS Notification System
 * 
 * This script provides functionality for sending SMS notifications using Twilio.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Get the directory name
const __dirname = path.dirname(require.main ? require.main.filename : '.');
const rootDir = path.join(__dirname, '..');

// Configuration
const config = {
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || 'ACf1ac6048cf5a71c338717d8358c51e69',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '12bbebf53a9083d7f384ce033f187612',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '+18554905313',
  userPhoneNumber: process.env.USER_PHONE_NUMBER || '+18638994416',
  logPath: path.join(rootDir, '.mcp', 'logs', 'sms.log')
};

// Ensure log directory exists
const logDir = path.dirname(config.logPath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Simple logging
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(config.logPath, logMessage);
}

// Send SMS using Twilio API
async function sendSMS(message, to = config.userPhoneNumber) {
  return new Promise((resolve, reject) => {
    log(`Sending SMS to ${to}: ${message}`);
    
    // Prepare the request data
    const data = new URLSearchParams();
    data.append('To', to);
    data.append('From', config.twilioPhoneNumber);
    data.append('Body', message);
    
    const options = {
      hostname: 'api.twilio.com',
      port: 443,
      path: `/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64')
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          log('SMS sent successfully');
          try {
            const response = JSON.parse(responseData);
            resolve(response);
          } catch (error) {
            log(`Error parsing response: ${error.message}`);
            resolve({ status: 'sent', sid: 'unknown' });
          }
        } else {
          log(`Error sending SMS: ${res.statusCode} ${responseData}`);
          reject(new Error(`Failed to send SMS: ${res.statusCode} ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      log(`Error sending SMS: ${error.message}`);
      reject(error);
    });
    
    req.write(data.toString());
    req.end();
  });
}

// Send deployment notification
async function sendDeploymentNotification(projectName, success, details = '') {
  const status = success ? 'SUCCESS' : 'FAILED';
  const emoji = success ? '✅' : '❌';
  
  const message = `${emoji} DEPLOYMENT ${status}: ${projectName}\n\nTime: ${new Date().toLocaleString()}\n${details}`;
  
  try {
    const result = await sendSMS(message);
    log(`Deployment notification sent for ${projectName}`);
    return result;
  } catch (error) {
    log(`Error sending deployment notification: ${error.message}`);
    throw error;
  }
}

// Send status update
async function sendStatusUpdate(projectName, status) {
  const message = `📊 STATUS UPDATE: ${projectName}\n\nStatus: ${status}\nTime: ${new Date().toLocaleString()}`;
  
  try {
    const result = await sendSMS(message);
    log(`Status update sent for ${projectName}`);
    return result;
  } catch (error) {
    log(`Error sending status update: ${error.message}`);
    throw error;
  }
}

// Send error notification
async function sendErrorNotification(projectName, error) {
  const message = `⚠️ ERROR: ${projectName}\n\nError: ${error}\nTime: ${new Date().toLocaleString()}`;
  
  try {
    const result = await sendSMS(message);
    log(`Error notification sent for ${projectName}`);
    return result;
  } catch (error) {
    log(`Error sending error notification: ${error.message}`);
    throw error;
  }
}

// If this script is run directly, send a test message
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'test';
  const projectName = args[1] || 'Test Project';
  
  if (command === 'test') {
    sendSMS('This is a test message from your Autonomous Agent System.')
      .then(() => {
        log('Test message sent successfully');
        process.exit(0);
      })
      .catch(error => {
        log(`Error sending test message: ${error.message}`);
        process.exit(1);
      });
  } else if (command === 'deploy') {
    sendDeploymentNotification(projectName, true, 'Deployment completed successfully')
      .then(() => {
        log('Deployment notification sent successfully');
        process.exit(0);
      })
      .catch(error => {
        log(`Error sending deployment notification: ${error.message}`);
        process.exit(1);
      });
  } else if (command === 'status') {
    sendStatusUpdate(projectName, 'Running')
      .then(() => {
        log('Status update sent successfully');
        process.exit(0);
      })
      .catch(error => {
        log(`Error sending status update: ${error.message}`);
        process.exit(1);
      });
  } else if (command === 'error') {
    sendErrorNotification(projectName, 'An error occurred')
      .then(() => {
        log('Error notification sent successfully');
        process.exit(0);
      })
      .catch(error => {
        log(`Error sending error notification: ${error.message}`);
        process.exit(1);
      });
  } else {
    log('Usage: node sms-notification.js [test|deploy|status|error] [projectName]');
    process.exit(1);
  }
}

// Export functions
module.exports = {
  sendSMS,
  sendDeploymentNotification,
  sendStatusUpdate,
  sendErrorNotification
};
