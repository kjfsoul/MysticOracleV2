#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENT_LOG_PATH = path.join(__dirname, "..", ".mcp", "logs");
const AGENT_RUNNER_PATH = path.join(__dirname, "..", ".mcp", "agent-runner.js");

// Ensure log directory exists
if (!fs.existsSync(AGENT_LOG_PATH)) {
  fs.mkdirSync(AGENT_LOG_PATH, { recursive: true });
}

console.log("Starting autonomous agents...");

// Create log files
const stdoutLog = fs.openSync(
  path.join(AGENT_LOG_PATH, "agent-stdout.log"),
  "a"
);
const stderrLog = fs.openSync(
  path.join(AGENT_LOG_PATH, "agent-stderr.log"),
  "a"
);

// Spawn the agent runner process with proper Node.js flags
const agentProcess = spawn(
  "node",
  ["--expose-gc", "--max-old-space-size=512", AGENT_RUNNER_PATH],
  {
    detached: true,
    stdio: ["ignore", stdoutLog, stderrLog],
  }
);

// Detach the process
agentProcess.unref();

console.log(`Autonomous agents started with PID: ${agentProcess.pid}`);
console.log('Use "npm run agents:status" to check agent status');
console.log('Use "npm run agents:stop" to stop agents');
