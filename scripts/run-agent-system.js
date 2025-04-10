/**
 * Run Agent System
 * 
 * This script runs the agent system in the background.
 */

const { spawn } = require('child_process');
const path = require('path');

// Start the agent runner
console.log('Starting agent system...');
const agentRunner = spawn('node', [path.join(__dirname, '..', '.mcp', 'start-agents.js')], {
  stdio: 'ignore',
  detached: true
});

// Unref the child process so it can run independently
agentRunner.unref();

console.log('Agent system started in the background');
console.log('Run "npm run agents:status" to check status');
