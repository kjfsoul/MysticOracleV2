#!/usr/bin/env node

/**
 * Refactoring Agent Manager
 * 
 * This script provides commands to manage the refactoring agent:
 * - start: Start the refactoring scheduler
 * - stop: Stop the refactoring scheduler
 * - status: Check the status of the refactoring scheduler
 * - run: Run the refactoring agent once
 * - configure: Configure the refactoring agent
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, exec } from 'child_process';
import readline from 'readline';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Configuration paths
const CONFIG_PATH = path.join(projectRoot, 'cline_docs/refactoring');
const LOG_PATH = path.join(CONFIG_PATH, 'logs');
const HISTORY_PATH = path.join(CONFIG_PATH, 'history');
const PID_FILE = path.join(CONFIG_PATH, 'scheduler.pid');
const CONFIG_FILE = path.join(CONFIG_PATH, 'config.json');
const SCHEDULER_CONFIG_FILE = path.join(CONFIG_PATH, 'scheduler-config.json');

// Ensure directories exist
[CONFIG_PATH, LOG_PATH, HISTORY_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Parse command line arguments
const command = process.argv[2] || 'help';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Execute the requested command
switch (command) {
  case 'start':
    startScheduler();
    break;
  case 'stop':
    stopScheduler();
    break;
  case 'status':
    checkStatus();
    break;
  case 'run':
    runOnce();
    break;
  case 'configure':
    configure();
    break;
  case 'help':
  default:
    showHelp();
    break;
}

// Start the refactoring scheduler
function startScheduler() {
  console.log('Starting refactoring scheduler...');
  
  // Check if already running
  if (isRunning()) {
    console.log('Refactoring scheduler is already running.');
    process.exit(0);
  }
  
  // Start the scheduler process
  const schedulerProcess = spawn('node', [path.join(__dirname, 'refactoring-scheduler.js')], {
    stdio: 'ignore',
    detached: true
  });
  
  // Unref the process to allow the parent to exit
  schedulerProcess.unref();
  
  console.log(`Refactoring scheduler started with PID ${schedulerProcess.pid}`);
  console.log('Use "node scripts/agents/refactoring-manager.js status" to check status');
  
  process.exit(0);
}

// Stop the refactoring scheduler
function stopScheduler() {
  console.log('Stopping refactoring scheduler...');
  
  // Check if running
  if (!isRunning()) {
    console.log('Refactoring scheduler is not running.');
    process.exit(0);
  }
  
  // Read PID from file
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
  
  // Send SIGTERM to the process
  try {
    process.kill(pid, 'SIGTERM');
    console.log(`Sent SIGTERM to process with PID ${pid}`);
    
    // Wait a bit and check if it's still running
    setTimeout(() => {
      if (isProcessRunning(pid)) {
        console.log(`Process with PID ${pid} is still running. Sending SIGKILL...`);
        try {
          process.kill(pid, 'SIGKILL');
          console.log(`Sent SIGKILL to process with PID ${pid}`);
        } catch (error) {
          console.error(`Error sending SIGKILL: ${error.message}`);
        }
      } else {
        console.log('Refactoring scheduler stopped successfully.');
      }
      
      // Remove PID file if it still exists
      if (fs.existsSync(PID_FILE)) {
        fs.unlinkSync(PID_FILE);
      }
      
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(`Error stopping scheduler: ${error.message}`);
    
    // Remove PID file if it exists
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
    
    process.exit(1);
  }
}

// Check the status of the refactoring scheduler
function checkStatus() {
  console.log('Checking refactoring scheduler status...');
  
  if (isRunning()) {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
    console.log(`Refactoring scheduler is running with PID ${pid}`);
    
    // Load configurations
    let config = {};
    let schedulerConfig = {};
    
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      }
      
      if (fs.existsSync(SCHEDULER_CONFIG_FILE)) {
        schedulerConfig = JSON.parse(fs.readFileSync(SCHEDULER_CONFIG_FILE, 'utf8'));
      }
      
      console.log('\nScheduler Configuration:');
      console.log(`- Schedule: ${schedulerConfig.schedule || 'Not configured'}`);
      console.log(`- Max Concurrent Runs: ${schedulerConfig.maxConcurrentRuns || 1}`);
      console.log(`- Timeout: ${schedulerConfig.timeoutMinutes || 60} minutes`);
      
      console.log('\nRefactoring Configuration:');
      console.log(`- Enabled: ${config.enabled !== false ? 'Yes' : 'No'}`);
      console.log(`- Refactoring Types: ${config.refactoringTypes ? config.refactoringTypes.join(', ') : 'Not configured'}`);
      console.log(`- Dry Run: ${config.dryRun ? 'Yes' : 'No'}`);
      console.log(`- Auto Commit: ${config.autoCommit ? 'Yes' : 'No'}`);
      console.log(`- Create Pull Requests: ${config.createPullRequests ? 'Yes' : 'No'}`);
      
      // Get recent history
      const historyFiles = fs.readdirSync(HISTORY_PATH)
        .filter(file => file.endsWith('.json'))
        .sort()
        .reverse()
        .slice(0, 5);
      
      if (historyFiles.length > 0) {
        console.log('\nRecent Refactoring Runs:');
        
        historyFiles.forEach(file => {
          try {
            const history = JSON.parse(fs.readFileSync(path.join(HISTORY_PATH, file), 'utf8'));
            console.log(`- ${history.timestamp}: ${history.summary.filesRefactored} files refactored, ${history.summary.totalChanges} changes`);
          } catch (error) {
            console.log(`- ${file}: Error reading history file`);
          }
        });
      } else {
        console.log('\nNo recent refactoring runs found.');
      }
    } catch (error) {
      console.error(`Error reading configuration: ${error.message}`);
    }
  } else {
    console.log('Refactoring scheduler is not running.');
  }
  
  process.exit(0);
}

// Run the refactoring agent once
function runOnce() {
  console.log('Running refactoring agent once...');
  
  const agentProcess = spawn('node', [path.join(__dirname, 'refactoring-agent.js')], {
    stdio: 'inherit'
  });
  
  agentProcess.on('close', (code) => {
    console.log(`Refactoring agent completed with code ${code}`);
    process.exit(code);
  });
}

// Configure the refactoring agent
function configure() {
  console.log('Configuring refactoring agent...');
  
  // Load existing configurations
  let config = {};
  let schedulerConfig = {};
  
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
    
    if (fs.existsSync(SCHEDULER_CONFIG_FILE)) {
      schedulerConfig = JSON.parse(fs.readFileSync(SCHEDULER_CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error(`Error loading configuration: ${error.message}`);
  }
  
  // Show current configuration
  console.log('\nCurrent Configuration:');
  console.log(JSON.stringify(config, null, 2));
  console.log('\nCurrent Scheduler Configuration:');
  console.log(JSON.stringify(schedulerConfig, null, 2));
  
  // Ask for configuration options
  console.log('\nEnter new configuration values (press Enter to keep current value):');
  
  // Helper function to ask questions
  function askQuestion(question, defaultValue) {
    return new Promise(resolve => {
      rl.question(`${question} (${defaultValue}): `, answer => {
        resolve(answer.trim() || defaultValue);
      });
    });
  }
  
  // Helper function to ask yes/no questions
  async function askYesNo(question, defaultValue) {
    const result = await askQuestion(`${question} (y/n)`, defaultValue ? 'y' : 'n');
    return result.toLowerCase() === 'y';
  }
  
  // Configure the agent
  async function configureAgent() {
    // Refactoring configuration
    config.enabled = await askYesNo('Enable refactoring agent', config.enabled !== false);
    
    const refactoringTypesStr = await askQuestion(
      'Refactoring types (comma-separated)',
      (config.refactoringTypes || ['duplication', 'complexity', 'naming', 'structure']).join(',')
    );
    config.refactoringTypes = refactoringTypesStr.split(',').map(t => t.trim());
    
    const excludedPathsStr = await askQuestion(
      'Excluded paths (comma-separated)',
      (config.excludedPaths || ['node_modules', 'dist', 'build', '.git']).join(',')
    );
    config.excludedPaths = excludedPathsStr.split(',').map(p => p.trim());
    
    config.maxFilesPerRun = parseInt(await askQuestion(
      'Max files per run',
      config.maxFilesPerRun || 10
    ), 10);
    
    config.maxChangesPerFile = parseInt(await askQuestion(
      'Max changes per file',
      config.maxChangesPerFile || 5
    ), 10);
    
    config.dryRun = await askYesNo('Dry run (no actual changes)', config.dryRun || false);
    config.autoCommit = await askYesNo('Auto commit changes', config.autoCommit || false);
    config.createPullRequests = await askYesNo('Create pull requests', config.createPullRequests || false);
    
    if (config.autoCommit || config.createPullRequests) {
      config.branchPrefix = await askQuestion(
        'Branch prefix',
        config.branchPrefix || 'refactor/'
      );
      
      config.commitMessagePrefix = await askQuestion(
        'Commit message prefix',
        config.commitMessagePrefix || '[Refactor]'
      );
    }
    
    // Scheduler configuration
    schedulerConfig.enabled = await askYesNo('Enable scheduler', schedulerConfig.enabled !== false);
    
    schedulerConfig.schedule = await askQuestion(
      'Schedule (cron syntax)',
      schedulerConfig.schedule || '0 0 * * *'
    );
    
    schedulerConfig.maxConcurrentRuns = parseInt(await askQuestion(
      'Max concurrent runs',
      schedulerConfig.maxConcurrentRuns || 1
    ), 10);
    
    schedulerConfig.timeoutMinutes = parseInt(await askQuestion(
      'Timeout (minutes)',
      schedulerConfig.timeoutMinutes || 60
    ), 10);
    
    schedulerConfig.runOnStart = await askYesNo('Run on start', schedulerConfig.runOnStart || false);
    
    // Save configurations
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    fs.writeFileSync(SCHEDULER_CONFIG_FILE, JSON.stringify(schedulerConfig, null, 2));
    
    console.log('\nConfiguration saved successfully!');
    
    // Ask if scheduler should be restarted
    if (isRunning() && await askYesNo('Restart scheduler to apply changes', true)) {
      stopScheduler();
      setTimeout(() => {
        startScheduler();
      }, 3000);
    }
    
    rl.close();
  }
  
  configureAgent().catch(error => {
    console.error(`Error during configuration: ${error.message}`);
    rl.close();
    process.exit(1);
  });
}

// Show help
function showHelp() {
  console.log(`
Refactoring Agent Manager

Usage:
  node scripts/agents/refactoring-manager.js <command>

Commands:
  start       Start the refactoring scheduler
  stop        Stop the refactoring scheduler
  status      Check the status of the refactoring scheduler
  run         Run the refactoring agent once
  configure   Configure the refactoring agent
  help        Show this help message
`);
  process.exit(0);
}

// Check if the scheduler is running
function isRunning() {
  if (!fs.existsSync(PID_FILE)) {
    return false;
  }
  
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
    return isProcessRunning(pid);
  } catch (error) {
    return false;
  }
}

// Check if a process is running
function isProcessRunning(pid) {
  try {
    // The signal 0 doesn't actually send a signal, but it checks if the process exists
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return false;
  }
}
