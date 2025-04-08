#!/usr/bin/env node

/**
 * Check Autonomous Agents Status Script for Mystic Arcana
 * 
 * This script checks the status of the autonomous agents.
 */

import { execSync } from 'child_process';

console.log('Checking autonomous agents status...');

try {
  // Find agent processes
  const result = execSync("pgrep -f '.mcp/agent-runner.js' || echo 'No agents running'").toString().trim();
  
  if (result === 'No agents running') {
    console.log('No autonomous agents are currently running.');
  } else {
    const pids = result.split('\n');
    
    console.log(`Autonomous agents are running with ${pids.length} process(es):`);
    
    for (const pid of pids) {
      if (pid && !isNaN(parseInt(pid))) {
        console.log(`- Agent process PID: ${pid}`);
        
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
  console.error(`Error checking agent status: ${error.message}`);
  process.exit(1);
}
