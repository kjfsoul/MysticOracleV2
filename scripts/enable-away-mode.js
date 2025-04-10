/**
 * Enable Away Mode Script
 * 
 * This script enables away mode for the autonomous agent system.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

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

// Display banner
console.log(`${COLORS.bgGreen}${COLORS.black}${COLORS.bright}                                                                                ${COLORS.reset}`);
console.log(`${COLORS.bgGreen}${COLORS.black}${COLORS.bright}                      ENABLING AWAY MODE FOR AUTONOMOUS AGENTS                  ${COLORS.reset}`);
console.log(`${COLORS.bgGreen}${COLORS.black}${COLORS.bright}                                                                                ${COLORS.reset}`);
console.log('');

// Update .env file
try {
  // Load environment variables
  dotenv.config({ path: path.join(rootDir, '.env') });
  
  // Read existing .env file
  let envContent = '';
  const envPath = path.join(rootDir, '.env');
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update AGENT_AWAY_MODE variable
  const regex = /^AGENT_AWAY_MODE=.*$/m;
  
  if (envContent.match(regex)) {
    // Update existing variable
    envContent = envContent.replace(regex, 'AGENT_AWAY_MODE=true');
  } else {
    // Add new variable
    envContent += '\nAGENT_AWAY_MODE=true';
  }
  
  // Write updated .env file
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  
  console.log(`${COLORS.green}Environment variables updated successfully.${COLORS.reset}`);
} catch (error) {
  console.error(`${COLORS.red}Failed to update environment variables: ${error.message}${COLORS.reset}`);
  process.exit(1);
}

// Update away-mode.json
try {
  const awayModePath = path.join(rootDir, '.mcp', 'away-mode.json');
  let awayModeConfig = {};
  
  if (fs.existsSync(awayModePath)) {
    awayModeConfig = JSON.parse(fs.readFileSync(awayModePath, 'utf8'));
  } else {
    awayModeConfig = {
      enabled: false,
      startTime: '18:00',
      endTime: '09:00',
      weekendMode: true,
      taskPriority: 'high',
      notifyOnCompletion: true,
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
  }
  
  // Enable away mode
  awayModeConfig.enabled = true;
  
  // Save away mode configuration
  fs.writeFileSync(awayModePath, JSON.stringify(awayModeConfig, null, 2));
  
  console.log(`${COLORS.green}Away mode configuration updated successfully.${COLORS.reset}`);
} catch (error) {
  console.error(`${COLORS.red}Failed to update away mode configuration: ${error.message}${COLORS.reset}`);
  process.exit(1);
}

// Restart agents
console.log(`${COLORS.yellow}Restarting agents with away mode enabled...${COLORS.reset}`);

try {
  const startProcess = spawn('node', [path.join(rootDir, 'src', 'start-all-agents.js')], {
    stdio: 'inherit'
  });
  
  startProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`${COLORS.red}Failed to restart agents (exit code ${code}).${COLORS.reset}`);
      process.exit(code);
    }
  });
} catch (error) {
  console.error(`${COLORS.red}Failed to restart agents: ${error.message}${COLORS.reset}`);
  process.exit(1);
}
