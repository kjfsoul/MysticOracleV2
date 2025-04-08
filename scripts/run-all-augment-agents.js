#!/usr/bin/env node

/**
 * Run All Augment Agents Script for Mystic Arcana
 * 
 * This script runs all Augment-based autonomous agents in parallel.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Agent types
const AGENT_TYPES = ['CodeAgent', 'DesignAgent', 'APIAgent', 'ContentAgent', 'TestAgent'];

// Run an agent
function runAgent(agentType) {
  console.log(`Starting ${agentType}...`);
  
  const process = spawn('node', [path.join(__dirname, 'augment-agent.js'), agentType], {
    stdio: 'inherit'
  });
  
  process.on('close', (code) => {
    console.log(`${agentType} exited with code ${code}`);
    
    // Restart the agent after a delay
    setTimeout(() => {
      runAgent(agentType);
    }, 5000);
  });
}

// Main function
function main() {
  console.log('Starting all Augment agents...');
  
  // Start all agents
  AGENT_TYPES.forEach(agentType => {
    runAgent(agentType);
  });
}

// Run the main function
main();
