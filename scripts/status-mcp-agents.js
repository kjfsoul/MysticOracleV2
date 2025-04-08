#!/usr/bin/env node

/**
 * Check MCP Agents Status Script for Mystic Arcana
 * 
 * This script checks the status of the MCP-based autonomous agents.
 */

import { execSync } from 'child_process';

console.log('Checking MCP-based autonomous agents status...');

try {
  // Find MCP agent processes
  const result = execSync("pgrep -f '.vscode/mcp-agent-runner.js' || echo 'No MCP agents running'").toString().trim();
  
  if (result === 'No MCP agents running') {
    console.log('No MCP-based autonomous agents are currently running.');
  } else {
    const pids = result.split('\n');
    
    console.log(`MCP-based autonomous agents are running with ${pids.length} process(es):`);
    
    for (const pid of pids) {
      if (pid && !isNaN(parseInt(pid))) {
        console.log(`- MCP agent process PID: ${pid}`);
        
        // Get process info
        try {
          const processInfo = execSync(`ps -p ${pid} -o lstart,etime`).toString().trim();
          console.log(`  ${processInfo.split('\n')[1]}`);
        } catch (error) {
          console.log(`  Process info not available`);
        }
      }
    }
  }
} catch (error) {
  console.error(`Error checking MCP agent status: ${error.message}`);
  process.exit(1);
}
