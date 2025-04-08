#!/usr/bin/env node

/**
 * Stop Autonomous Agents Script for Mystic Arcana
 * 
 * This script stops the autonomous agents.
 */

import { execSync } from 'child_process';

console.log('Stopping autonomous agents...');

try {
  // Find and kill agent processes
  const result = execSync("pgrep -f '.mcp/agent-runner.js' || echo 'No agents running'").toString().trim();
  
  if (result === 'No agents running') {
    console.log('No autonomous agents are currently running.');
  } else {
    const pids = result.split('\n');
    
    for (const pid of pids) {
      if (pid && !isNaN(parseInt(pid))) {
        console.log(`Stopping agent process with PID: ${pid}`);
        execSync(`kill ${pid}`);
      }
    }
    
    console.log('All autonomous agents stopped successfully!');
  }
} catch (error) {
  console.error(`Error stopping agents: ${error.message}`);
  process.exit(1);
}

console.log('Use "npm run agents:start" to start agents again.');
