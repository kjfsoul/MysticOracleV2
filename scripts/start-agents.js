#!/usr/bin/env node

/**
 * Start Agents
 * 
 * This script starts the autonomous agent system.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure log directory exists
const logDir = path.join(process.cwd(), '.mcp', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log file
const logFile = path.join(logDir, 'agents.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  logStream.write(logMessage);
}

// Start the interactive SME agent
log('Starting Interactive SME Agent...');

const smeAgentPath = path.join(process.cwd(), 'scripts', 'interactive-sme-agent.js');

const smeAgent = spawn('node', [smeAgentPath], {
  stdio: 'inherit'
});

smeAgent.on('error', (error) => {
  log(`Error starting Interactive SME Agent: ${error.message}`);
});

smeAgent.on('exit', (code) => {
  log(`Interactive SME Agent exited with code ${code}`);
});

log('Agent started successfully. Press Ctrl+C to exit.');
