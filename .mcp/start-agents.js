/**
 * Start Agents Script
 * 
 * This script starts the agent runner and sets up a process monitor to restart it if it crashes.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const logFile = path.join(logsDir, 'agent-runner.log');
const errorLogFile = path.join(logsDir, 'agent-runner-error.log');

// Create log streams
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
const errorLogStream = fs.createWriteStream(errorLogFile, { flags: 'a' });

// Function to start the agent runner
function startAgentRunner() {
  console.log('Starting agent runner...');
  
  // Log the start time
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] Starting agent runner\n`);
  
  // Spawn the agent runner process
  const agentRunner = spawn('node', [path.join(__dirname, 'agent-runner.js')], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });
  
  // Pipe stdout and stderr to log files
  agentRunner.stdout.pipe(logStream);
  agentRunner.stderr.pipe(errorLogStream);
  
  // Log process ID
  logStream.write(`[${timestamp}] Agent runner started with PID ${agentRunner.pid}\n`);
  
  // Handle process exit
  agentRunner.on('exit', (code, signal) => {
    const exitTimestamp = new Date().toISOString();
    logStream.write(`[${exitTimestamp}] Agent runner exited with code ${code} and signal ${signal}\n`);
    
    // Restart the agent runner after a delay
    console.log(`Agent runner exited with code ${code}. Restarting in 5 seconds...`);
    setTimeout(startAgentRunner, 5000);
  });
  
  // Handle process error
  agentRunner.on('error', (error) => {
    const errorTimestamp = new Date().toISOString();
    errorLogStream.write(`[${errorTimestamp}] Agent runner error: ${error.message}\n`);
    console.error('Agent runner error:', error);
  });
  
  return agentRunner;
}

// Start the agent runner
const runner = startAgentRunner();

// Handle script termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down...');
  process.exit(0);
});

console.log('Agent monitor started. Press Ctrl+C to exit.');
