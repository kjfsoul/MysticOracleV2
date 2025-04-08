#!/usr/bin/env node

/**
 * Start MCP Agents Script for Mystic Arcana
 * 
 * This script starts the MCP-based autonomous agents as background processes.
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration paths
const AGENT_LOG_PATH = path.join(projectRoot, 'cline_docs/agent-logs');
const MCP_AGENT_RUNNER_PATH = path.join(projectRoot, '.vscode/mcp-agent-runner.js');

// Ensure log directory exists
if (!fs.existsSync(AGENT_LOG_PATH)) {
  fs.mkdirSync(AGENT_LOG_PATH, { recursive: true });
}

// Start the MCP agent runner
console.log('Starting MCP-based autonomous agents...');

// Create log files
const stdoutLog = fs.openSync(path.join(AGENT_LOG_PATH, 'mcp-agent-stdout.log'), 'a');
const stderrLog = fs.openSync(path.join(AGENT_LOG_PATH, 'mcp-agent-stderr.log'), 'a');

// Spawn the MCP agent runner process
const agentProcess = spawn('node', [MCP_AGENT_RUNNER_PATH], {
  detached: true,
  stdio: ['ignore', stdoutLog, stderrLog]
});

// Detach the process
agentProcess.unref();

console.log(`MCP-based autonomous agents started with PID: ${agentProcess.pid}`);
console.log('Use "npm run mcp-agents:status" to check agent status');
console.log('Use "npm run mcp-agents:stop" to stop agents');
