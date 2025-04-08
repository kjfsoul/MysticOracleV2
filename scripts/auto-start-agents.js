import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, '../.mcp/logs');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Function to start a process and log its output
function startProcess(scriptPath, logFileName) {
  const logFilePath = path.join(logDir, logFileName);
  const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
  
  // Log startup
  const timestamp = new Date().toISOString();
  logStream.write(`\n\n[${timestamp}] Starting process: ${scriptPath}\n`);
  
  // Spawn the process
  const process = spawn('node', [scriptPath], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Log process ID
  logStream.write(`[${timestamp}] Process ID: ${process.pid}\n`);
  
  // Pipe stdout and stderr to log file
  process.stdout.pipe(logStream);
  process.stderr.pipe(logStream);
  
  // Handle process exit
  process.on('exit', (code) => {
    const exitTimestamp = new Date().toISOString();
    logStream.write(`[${exitTimestamp}] Process exited with code: ${code}\n`);
    
    // Restart the process after a delay if it crashes
    setTimeout(() => {
      logStream.write(`[${new Date().toISOString()}] Restarting process...\n`);
      startProcess(scriptPath, logFileName);
    }, 5000);
  });
  
  // Unref the process to allow the parent to exit
  process.unref();
  
  return process.pid;
}

// Start MCP agent runner
const mcpAgentPid = startProcess(
  path.join(__dirname, 'start-mcp-agents.js'),
  'mcp-agents.log'
);

// Start autonomous agent runner
const agentRunnerPid = startProcess(
  path.join(__dirname, 'start-agents.js'),
  'autonomous-agents.log'
);

// Write PID file for monitoring
const pidFile = path.join(__dirname, '../.mcp/agent-pids.json');
fs.writeFileSync(pidFile, JSON.stringify({
  mcpAgentPid,
  agentRunnerPid,
  startTime: new Date().toISOString()
}));

console.log(`MCP Agent started with PID: ${mcpAgentPid}`);
console.log(`Autonomous Agent started with PID: ${agentRunnerPid}`);
console.log(`PID file written to: ${pidFile}`);
console.log('Agents are now running in the background');
