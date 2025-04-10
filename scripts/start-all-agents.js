/**
 * Start All Agents Script
 * 
 * This script automatically starts all autonomous agents,
 * and ensures they continue running even when the user is away.
 */

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

// Configuration
const AWAY_MODE = process.env.AGENT_AWAY_MODE === 'true';
const STATUS_UPDATE_INTERVAL = parseInt(process.env.AGENT_STATUS_INTERVAL || '30', 10);
const LOG_DIR = path.join(rootDir, '.mcp', 'logs');

// ANSI color codes for terminal output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Log file paths
const mainLogFile = path.join(LOG_DIR, 'all-agents.log');
const statusLogFile = path.join(LOG_DIR, 'agent-status.log');

// Logger
const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(mainLogFile, logMessage);
  },
  success: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [SUCCESS] ${message}\n`;
    console.log(`${COLORS.green}${message}${COLORS.reset}`);
    fs.appendFileSync(mainLogFile, logMessage);
  },
  warning: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [WARNING] ${message}\n`;
    console.log(`${COLORS.yellow}${message}${COLORS.reset}`);
    fs.appendFileSync(mainLogFile, logMessage);
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    const errorMessage = error ? `${error.message}\n${error.stack}` : '';
    const logMessage = `[${timestamp}] [ERROR] ${message}\n${errorMessage}\n`;
    console.error(`${COLORS.red}${message}${COLORS.reset}`);
    if (error) console.error(error);
    fs.appendFileSync(mainLogFile, logMessage);
  }
};

// Check if agents are already running
async function checkAgentsRunning() {
  return new Promise((resolve) => {
    exec('ps aux | grep "[a]gent-runner\\.js"', (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Start agents
async function startAgents() {
  logger.log('Starting autonomous agents...');
  
  try {
    const agentProcess = spawn('node', [path.join(__dirname, 'agent-runner.js')], {
      detached: true,
      stdio: 'ignore'
    });
    
    agentProcess.unref();
    logger.success(`Agents started with PID: ${agentProcess.pid}`);
    return true;
  } catch (error) {
    logger.error('Failed to start agents', error);
    return false;
  }
}

// Configure away mode if enabled
async function configureAwayMode() {
  if (!AWAY_MODE) {
    logger.log('Away mode is disabled');
    return;
  }
  
  logger.log('Configuring away mode for agents...');
  
  try {
    // Create away mode configuration
    const awayModeConfig = {
      enabled: true,
      startTime: process.env.AGENT_AWAY_START_TIME || '18:00',
      endTime: process.env.AGENT_AWAY_END_TIME || '09:00',
      weekendMode: process.env.AGENT_AWAY_WEEKEND_MODE === 'true',
      taskPriority: process.env.AGENT_AWAY_TASK_PRIORITY || 'high',
      notifyOnCompletion: process.env.AGENT_AWAY_NOTIFY === 'true',
      autoActivate: {
        enabled: true,
        inactivityThreshold: 30,
        detectTerminalClose: true
      },
      resourceLimits: {
        cpuUsageLimit: 80,
        memoryUsageLimit: 70,
        pauseOnBatteryBelow: 20
      },
      taskSettings: {
        maxConcurrentTasks: 3,
        priorityOrder: [
          "deployment",
          "testing",
          "development",
          "documentation"
        ],
        excludedTasks: []
      },
      notificationSettings: {
        email: false,
        desktop: true,
        logFile: true,
        summaryOnReturn: true
      }
    };
    
    // Save configuration
    const configPath = path.join(rootDir, '.mcp', 'away-mode.json');
    fs.writeFileSync(configPath, JSON.stringify(awayModeConfig, null, 2));
    
    logger.success('Away mode configured successfully');
  } catch (error) {
    logger.error('Failed to configure away mode', error);
  }
}

// Schedule status updates
async function scheduleStatusUpdates() {
  logger.log(`Scheduling status updates every ${STATUS_UPDATE_INTERVAL} minutes`);
  
  try {
    // Create status update configuration
    const statusConfig = {
      enabled: true,
      interval: STATUS_UPDATE_INTERVAL,
      logFile: statusLogFile,
      notifyInTerminal: true,
      includeTaskStatus: true,
      includeResourceUsage: true,
      format: {
        type: "detailed",
        includeTimestamp: true,
        colorOutput: true
      },
      retention: {
        maxLogSize: 10485760,
        maxLogFiles: 10,
        rotateLogs: true
      },
      alerts: {
        agentCrash: true,
        highResourceUsage: true,
        taskFailure: true,
        thresholds: {
          cpuUsage: 80,
          memoryUsage: 70,
          diskUsage: 90
        }
      },
      exportOptions: {
        json: true,
        csv: false,
        html: false
      }
    };
    
    // Save configuration
    const configPath = path.join(rootDir, '.mcp', 'status-updates.json');
    fs.writeFileSync(configPath, JSON.stringify(statusConfig, null, 2));
    
    // Schedule the first status update
    setTimeout(() => {
      const statusProcess = spawn('node', [path.join(__dirname, 'status-report.js')], {
        detached: true,
        stdio: 'ignore'
      });
      statusProcess.unref();
    }, 60000); // First status after 1 minute
    
    logger.success('Status updates scheduled successfully');
  } catch (error) {
    logger.error('Failed to schedule status updates', error);
  }
}

// Display welcome banner
function displayWelcomeBanner() {
  console.log(`${COLORS.bgBlue}${COLORS.white}${COLORS.bright}                                                                                ${COLORS.reset}`);
  console.log(`${COLORS.bgBlue}${COLORS.white}${COLORS.bright}                      AUTONOMOUS AGENT SYSTEM STARTER                           ${COLORS.reset}`);
  console.log(`${COLORS.bgBlue}${COLORS.white}${COLORS.bright}                                                                                ${COLORS.reset}`);
  console.log('');
  console.log(`${COLORS.cyan}${COLORS.bright}Project:${COLORS.reset} ${path.basename(rootDir)}`);
  console.log(`${COLORS.cyan}${COLORS.bright}Time:${COLORS.reset} ${new Date().toLocaleString()}`);
  console.log(`${COLORS.cyan}${COLORS.bright}Away Mode:${COLORS.reset} ${AWAY_MODE ? `${COLORS.green}ENABLED${COLORS.reset}` : `${COLORS.yellow}DISABLED${COLORS.reset}`}`);
  console.log('');
}

// Main function
async function main() {
  // Display welcome banner
  displayWelcomeBanner();
  
  logger.log('Starting Agent Manager...');
  
  // Check if agents are already running
  const agentsRunning = await checkAgentsRunning();
  if (agentsRunning) {
    logger.warning('Agents are already running. Checking status...');
    
    // Run status report
    const statusProcess = spawn('node', [path.join(__dirname, 'status-report.js')], {
      stdio: 'inherit'
    });
    
    statusProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Status report exited with code ${code}`);
      }
    });
    
    return;
  }
  
  // Start agents
  const started = await startAgents();
  
  if (started) {
    // Configure away mode
    await configureAwayMode();
    
    // Schedule status updates
    await scheduleStatusUpdates();
    
    logger.success('All agents started and configured successfully');
    
    // Run initial status report
    setTimeout(() => {
      const statusProcess = spawn('node', [path.join(__dirname, 'status-report.js')], {
        stdio: 'inherit'
      });
      
      statusProcess.on('close', (code) => {
        if (code !== 0) {
          logger.error(`Initial status report exited with code ${code}`);
        }
      });
    }, 5000); // Initial status after 5 seconds
  } else {
    logger.error('Failed to start agents');
  }
}

// Run the main function
main().catch((error) => {
  logger.error('Unhandled error in main function', error);
});
