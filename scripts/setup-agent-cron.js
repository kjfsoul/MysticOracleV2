#!/usr/bin/env node

/**
 * Setup Agent Cron Script for Mystic Arcana
 * 
 * This script sets up a cron job to monitor and restart agents if needed.
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Create crontab entry
const cronCommand = `*/15 * * * * cd ${projectRoot} && node ${path.join(projectRoot, 'scripts/monitor-agents.js')} >> ${path.join(projectRoot, 'cline_docs/agent-logs/cron.log')} 2>&1`;

// Write to a temporary file
const tempFile = path.join(projectRoot, '.temp-crontab');
fs.writeFileSync(tempFile, cronCommand + '\n');

// Add to crontab
console.log('Setting up cron job to monitor agents...');
const cronProcess = spawn('crontab', [tempFile], {
  stdio: 'inherit'
});

cronProcess.on('close', (code) => {
  // Remove temporary file
  fs.unlinkSync(tempFile);
  
  if (code === 0) {
    console.log('Cron job set up successfully!');
    console.log('Agents will be monitored every 15 minutes.');
    console.log(`Cron command: ${cronCommand}`);
  } else {
    console.error(`Failed to set up cron job. Exit code: ${code}`);
  }
});
