#!/usr/bin/env node

/**
 * Stop MCP Agents Script for Mystic Arcana
 * 
 * This script stops the MCP-based autonomous agents.
 */

import { execSync } from 'child_process';

console.log('Stopping MCP-based autonomous agents...');

try {
  // Find and kill MCP agent processes
  const result = execSync("pgrep -f '.vscode/mcp-agent-runner.js' || echo 'No MCP agents running'").toString().trim();
  
  if (result === 'No MCP agents running') {
    console.log('No MCP-based autonomous agents are currently running.');
  } else {
    const pids = result.split('\n');
    
    for (const pid of pids) {
      if (pid && !isNaN(parseInt(pid))) {
        console.log(`Stopping MCP agent process with PID: ${pid}`);
        execSync(`kill ${pid}`);
      }
    }
    
    console.log('All MCP-based autonomous agents stopped successfully!');
  }
} catch (error) {
  console.error(`Error stopping MCP agents: ${error.message}`);
  process.exit(1);
}

console.log('Use "npm run mcp-agents:start" to start MCP agents again.');
