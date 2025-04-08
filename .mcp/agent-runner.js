#!/usr/bin/env node

/**
 * Agent Runner Script for Mystic Arcana
 * 
 * This script runs the autonomous agents in the background.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration paths
const AGENT_CONFIG_PATH = path.join(__dirname, 'agents.json');
const AGENT_LOG_PATH = path.join(projectRoot, 'cline_docs/agent-logs');
const AGENT_LOG_FILE = path.join(AGENT_LOG_PATH, `agent-runner-${new Date().toISOString().split('T')[0]}.log`);

// Ensure log directory exists
if (!fs.existsSync(AGENT_LOG_PATH)) {
  fs.mkdirSync(AGENT_LOG_PATH, { recursive: true });
}

// Create default agent configuration if it doesn't exist
if (!fs.existsSync(AGENT_CONFIG_PATH)) {
  const defaultConfig = {
    "agents": {
      "CodeAgent": {
        "description": "Handles code implementation and refactoring",
        "capabilities": ["component-implementation", "code-refactoring", "bug-fixing", "test-writing"],
        "schedule": "0 */4 * * *",
        "tasks": [
          {
            "name": "tarot-component",
            "description": "Implement and improve tarot card components",
            "schedule": "0 2 * * *",
            "command": "node scripts/augment-agent.js CodeAgent"
          },
          {
            "name": "auth-ui",
            "description": "Implement authentication UI components",
            "schedule": "0 4 * * *",
            "command": "node scripts/augment-agent.js CodeAgent"
          }
        ]
      },
      "DesignAgent": {
        "description": "Handles UI design and animations",
        "capabilities": ["ui-design", "animation", "responsive-layout", "accessibility"],
        "schedule": "0 */6 * * *",
        "tasks": [
          {
            "name": "card-animations",
            "description": "Implement card flip and spread animations",
            "schedule": "0 3 * * *",
            "command": "node scripts/augment-agent.js DesignAgent"
          }
        ]
      },
      "APIAgent": {
        "description": "Handles API implementation and serverless functions",
        "capabilities": ["api-implementation", "serverless-function", "database-query", "authentication"],
        "schedule": "0 */8 * * *",
        "tasks": [
          {
            "name": "daily-tarot-api",
            "description": "Implement daily tarot card API",
            "schedule": "0 1 * * *",
            "command": "node scripts/augment-agent.js APIAgent"
          },
          {
            "name": "auth-api",
            "description": "Implement authentication API endpoints",
            "schedule": "0 5 * * *",
            "command": "node scripts/augment-agent.js APIAgent"
          }
        ]
      },
      "ContentAgent": {
        "description": "Handles content generation",
        "capabilities": ["content-generation", "tarot-description", "astrology-interpretation", "blog-outline"],
        "schedule": "0 */12 * * *",
        "tasks": [
          {
            "name": "tarot-descriptions",
            "description": "Generate tarot card descriptions",
            "schedule": "0 0 * * *",
            "command": "node scripts/augment-agent.js ContentAgent"
          }
        ]
      },
      "TestAgent": {
        "description": "Handles testing and quality assurance",
        "capabilities": ["unit-test", "integration-test", "test-suite", "test-coverage"],
        "schedule": "0 */12 * * *",
        "tasks": [
          {
            "name": "component-tests",
            "description": "Write and run tests for components",
            "schedule": "0 6 * * *",
            "command": "node scripts/augment-agent.js TestAgent"
          }
        ]
      }
    },
    "workflows": {
      "daily-build": {
        "description": "Daily build and test workflow",
        "schedule": "0 0 * * *",
        "tasks": [
          "tarot-component",
          "card-animations",
          "component-tests"
        ]
      },
      "netlify-deploy": {
        "description": "Deploy to Netlify",
        "schedule": "0 12 * * 5",
        "tasks": [
          "component-tests",
          "deploy-netlify"
        ]
      }
    }
  };
  
  fs.writeFileSync(AGENT_CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
  log(`Created default agent configuration at ${AGENT_CONFIG_PATH}`);
}

// Load agent configuration
const agentConfig = JSON.parse(fs.readFileSync(AGENT_CONFIG_PATH, 'utf8'));

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // Log to console
  console.log(logMessage);
  
  // Log to file
  fs.appendFileSync(AGENT_LOG_FILE, logMessage);
}

// Parse cron schedule and get next run time
function getNextRunTime(cronExpression) {
  // This is a simplified implementation
  // In a real implementation, use a cron parser library
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ');
  
  const now = new Date();
  const nextRun = new Date();
  
  // Set to next hour if using */n format
  if (hour.includes('*/')) {
    const interval = parseInt(hour.split('/')[1]);
    nextRun.setHours(Math.ceil(now.getHours() / interval) * interval);
    nextRun.setMinutes(0);
    nextRun.setSeconds(0);
    
    // If next run is in the past, add the interval
    if (nextRun <= now) {
      nextRun.setHours(nextRun.getHours() + interval);
    }
  } else if (hour === '*') {
    // If hour is *, run at the next minute specified
    nextRun.setHours(now.getHours());
    nextRun.setMinutes(parseInt(minute));
    nextRun.setSeconds(0);
    
    // If next run is in the past, add an hour
    if (nextRun <= now) {
      nextRun.setHours(nextRun.getHours() + 1);
    }
  } else {
    // Specific hour and minute
    nextRun.setHours(parseInt(hour));
    nextRun.setMinutes(parseInt(minute));
    nextRun.setSeconds(0);
    
    // If next run is in the past, add a day
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
  }
  
  return nextRun;
}

// Run a task
function runTask(agentName, task) {
  log(`Running task: ${task.name} (${task.description}) for agent: ${agentName}`);
  
  const taskProcess = spawn('node', [task.command.split(' ')[1], task.command.split(' ')[2]], {
    stdio: 'inherit'
  });
  
  taskProcess.on('close', (code) => {
    log(`Task ${task.name} completed with code: ${code}`);
  });
}

// Schedule tasks
function scheduleTasks() {
  log('Scheduling tasks...');
  
  // Schedule agent tasks
  for (const [agentName, agent] of Object.entries(agentConfig.agents)) {
    log(`Scheduling tasks for agent: ${agentName}`);
    
    for (const task of agent.tasks) {
      const nextRun = getNextRunTime(task.schedule);
      const delay = nextRun.getTime() - Date.now();
      
      log(`Scheduled task: ${task.name} to run at ${nextRun.toISOString()} (in ${Math.round(delay / 1000 / 60)} minutes)`);
      
      setTimeout(() => {
        runTask(agentName, task);
        
        // Reschedule the task
        scheduleTasks();
      }, delay);
    }
  }
  
  // Schedule workflows
  for (const [workflowName, workflow] of Object.entries(agentConfig.workflows)) {
    log(`Scheduling workflow: ${workflowName}`);
    
    const nextRun = getNextRunTime(workflow.schedule);
    const delay = nextRun.getTime() - Date.now();
    
    log(`Scheduled workflow: ${workflowName} to run at ${nextRun.toISOString()} (in ${Math.round(delay / 1000 / 60)} minutes)`);
    
    setTimeout(() => {
      log(`Running workflow: ${workflowName} (${workflow.description})`);
      
      // Run each task in the workflow
      for (const taskName of workflow.tasks) {
        // Find the task in the agent tasks
        for (const [agentName, agent] of Object.entries(agentConfig.agents)) {
          const task = agent.tasks.find(t => t.name === taskName);
          
          if (task) {
            runTask(agentName, task);
            break;
          }
        }
      }
      
      // Reschedule the workflow
      scheduleTasks();
    }, delay);
  }
}

// Main function
function main() {
  log('Agent runner started');
  
  // Schedule tasks
  scheduleTasks();
  
  // Keep the process running
  setInterval(() => {
    log('Agent runner is still running');
  }, 60 * 60 * 1000); // Log every hour
}

// Run the main function
main();
