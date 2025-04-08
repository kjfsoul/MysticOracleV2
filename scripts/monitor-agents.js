#!/usr/bin/env node

/**
 * Monitor Agents Script for Mystic Arcana
 * 
 * This script monitors the autonomous agents and restarts them if they're not running.
 */

import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration paths
const AGENT_LOG_PATH = path.join(projectRoot, 'cline_docs/agent-logs');
const MCP_PID_FILE = path.join(AGENT_LOG_PATH, 'mcp-agent-pids.json');
const AGENT_PID_FILE = path.join(AGENT_LOG_PATH, 'agent-pids.json');

// Check if a process is running
function isProcessRunning(pid) {
  return new Promise((resolve) => {
    if (!pid) {
      resolve(false);
      return;
    }
    
    exec(`ps -p ${pid}`, (error) => {
      resolve(!error);
    });
  });
}

// Start MCP agents
function startMcpAgents() {
  console.log('Starting MCP agents...');
  const startProcess = spawn('node', [path.join(projectRoot, 'scripts/start-mcp-agents.js')], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve) => {
    startProcess.on('close', (code) => {
      console.log(`MCP agents start process exited with code ${code}`);
      resolve();
    });
  });
}

// Start autonomous agents
function startAgents() {
  console.log('Starting autonomous agents...');
  const startProcess = spawn('node', [path.join(projectRoot, 'scripts/start-agents.js')], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve) => {
    startProcess.on('close', (code) => {
      console.log(`Autonomous agents start process exited with code ${code}`);
      resolve();
    });
  });
}

// Main monitoring function
async function monitorAgents() {
  console.log('Monitoring agents...');
  
  // Check MCP agents
  let mcpAgentsRunning = false;
  if (fs.existsSync(MCP_PID_FILE)) {
    try {
      const mcpPidData = JSON.parse(fs.readFileSync(MCP_PID_FILE, 'utf8'));
      mcpAgentsRunning = await isProcessRunning(mcpPidData.pid);
    } catch (error) {
      console.error('Error checking MCP agent status:', error);
    }
  }
  
  // Check autonomous agents
  let agentsRunning = false;
  if (fs.existsSync(AGENT_PID_FILE)) {
    try {
      const agentPidData = JSON.parse(fs.readFileSync(AGENT_PID_FILE, 'utf8'));
      // Check if at least one agent is running
      for (const [name, pid] of Object.entries(agentPidData.pids || {})) {
        if (await isProcessRunning(pid)) {
          agentsRunning = true;
          break;
        }
      }
    } catch (error) {
      console.error('Error checking autonomous agent status:', error);
    }
  }
  
  // Restart agents if needed
  if (!mcpAgentsRunning) {
    console.log('MCP agents are not running. Restarting...');
    await startMcpAgents();
  } else {
    console.log('MCP agents are running.');
  }
  
  if (!agentsRunning) {
    console.log('Autonomous agents are not running. Restarting...');
    await startAgents();
  } else {
    console.log('Autonomous agents are running.');
  }
  
  console.log('Monitoring complete.');
}

// Run the monitor
monitorAgents().catch(error => {
  console.error('Error in agent monitoring:', error);
});
