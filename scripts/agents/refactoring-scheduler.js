#!/usr/bin/env node

/**
 * Refactoring Agent Scheduler
 * 
 * This script schedules the refactoring agent to run at regular intervals.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import cron from 'node-cron';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Configuration paths
const CONFIG_PATH = path.join(projectRoot, 'cline_docs/refactoring');
const LOG_PATH = path.join(CONFIG_PATH, 'logs');
const PID_FILE = path.join(CONFIG_PATH, 'scheduler.pid');

// Ensure directories exist
[CONFIG_PATH, LOG_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Default scheduler configuration
let schedulerConfig = {
  enabled: true,
  schedule: '0 0 * * *', // Daily at midnight (cron syntax)
  maxConcurrentRuns: 1,
  timeoutMinutes: 60,
  runOnStart: false
};

// Load configuration
const schedulerConfigPath = path.join(CONFIG_PATH, 'scheduler-config.json');
if (fs.existsSync(schedulerConfigPath)) {
  try {
    const loadedConfig = JSON.parse(fs.readFileSync(schedulerConfigPath, 'utf8'));
    schedulerConfig = { ...schedulerConfig, ...loadedConfig };
  } catch (error) {
    console.error('Error loading scheduler configuration:', error);
  }
} else {
  // Create default config
  fs.writeFileSync(schedulerConfigPath, JSON.stringify(schedulerConfig, null, 2));
  console.log(`Created default scheduler configuration at ${schedulerConfigPath}`);
}

// Initialize logging
const logFile = path.join(LOG_PATH, 'scheduler.log');
const logger = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}`;
  console.log(logMessage);
  logger.write(logMessage + '\n');
}

// Save PID to file
fs.writeFileSync(PID_FILE, process.pid.toString());
log(`Scheduler started with PID ${process.pid}`);

// Track running processes
const runningProcesses = new Set();

// Function to run the refactoring agent
function runRefactoringAgent() {
  // Check if we can start a new run
  if (runningProcesses.size >= schedulerConfig.maxConcurrentRuns) {
    log(`Maximum concurrent runs (${schedulerConfig.maxConcurrentRuns}) reached. Skipping this run.`);
    return;
  }
  
  log('Starting refactoring agent...');
  
  const agentProcess = spawn('node', [path.join(__dirname, 'refactoring-agent.js')], {
    stdio: 'pipe',
    detached: false
  });
  
  const processId = agentProcess.pid;
  runningProcesses.add(processId);
  
  log(`Refactoring agent started with PID ${processId}`);
  
  // Set timeout
  const timeoutMs = schedulerConfig.timeoutMinutes * 60 * 1000;
  const timeout = setTimeout(() => {
    log(`Refactoring agent (PID ${processId}) timed out after ${schedulerConfig.timeoutMinutes} minutes`);
    agentProcess.kill();
    runningProcesses.delete(processId);
  }, timeoutMs);
  
  // Handle process output
  agentProcess.stdout.on('data', (data) => {
    logger.write(`[Agent ${processId}] ${data}`);
  });
  
  agentProcess.stderr.on('data', (data) => {
    logger.write(`[Agent ${processId} ERROR] ${data}`);
  });
  
  // Handle process completion
  agentProcess.on('close', (code) => {
    clearTimeout(timeout);
    runningProcesses.delete(processId);
    log(`Refactoring agent (PID ${processId}) completed with code ${code}`);
  });
}

// Schedule the refactoring agent
if (schedulerConfig.enabled) {
  log(`Scheduling refactoring agent with cron schedule: ${schedulerConfig.schedule}`);
  
  cron.schedule(schedulerConfig.schedule, () => {
    log('Cron schedule triggered');
    runRefactoringAgent();
  });
  
  // Run on start if configured
  if (schedulerConfig.runOnStart) {
    log('Running refactoring agent on start (as configured)');
    runRefactoringAgent();
  }
  
  log('Scheduler is running. Press Ctrl+C to stop.');
} else {
  log('Scheduler is disabled in configuration. Exiting.');
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', () => {
  log('Received SIGINT. Shutting down...');
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM. Shutting down...');
  cleanup();
  process.exit(0);
});

// Cleanup function
function cleanup() {
  log(`Stopping ${runningProcesses.size} running processes...`);
  
  // Kill all running processes
  for (const pid of runningProcesses) {
    try {
      process.kill(pid);
      log(`Killed process with PID ${pid}`);
    } catch (error) {
      log(`Error killing process with PID ${pid}: ${error.message}`);
    }
  }
  
  // Remove PID file
  try {
    fs.unlinkSync(PID_FILE);
  } catch (error) {
    log(`Error removing PID file: ${error.message}`);
  }
  
  log('Cleanup complete');
}
