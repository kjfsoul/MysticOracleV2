#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_CONFIG_PATH = path.join(__dirname, '..', '.mcp', 'agents.json');
const PROJECT_STATUS_PATH = path.join(__dirname, '..', '.mcp', 'project-status.json');

function formatProcessInfo(info) {
  const lines = info.split('\n');
  if (lines.length < 2) return null;
  
  const [_, values] = lines;
  const [cpu, mem, uptime, ...startTime] = values.trim().split(/\s+/);
  
  return {
    cpu: parseFloat(cpu),
    mem: parseFloat(mem),
    uptime,
    startTime: startTime.join(' ')
  };
}

function createProgressBar(progress) {
  const width = 20;
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;
  return `[${'='.repeat(filled)}${' '.repeat(empty)}]`;
}

function displayTaskProgress(agentsConfig) {
  const agents = Object.entries(agentsConfig.agents);
  
  console.log('\nActive Tasks:');
  agents.forEach(([agentName, agent]) => {
    if (!agent.tasks?.length) return;
    
    const activeTasks = agent.tasks.filter(t => t.status !== 'completed');
    if (activeTasks.length === 0) return;

    console.log(`\n${agentName}:`);
    activeTasks.forEach(task => {
      console.log(`  • ${task.name} (${task.status || 'ongoing'})`);
      console.log(`    Priority: ${task.priority || 'normal'}`);
      console.log(`    Description: ${task.description}`);
      if (task.progress) {
        console.log(`    Progress: ${createProgressBar(task.progress)} ${task.progress}%`);
      }
    });
  });
}

// Main execution
try {
  // System memory info
  const totalMem = os.totalmem() / (1024 * 1024 * 1024);
  const freeMem = os.freemem() / (1024 * 1024 * 1024);
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;

  console.log("\nSystem Memory:");
  console.log(`Total: ${totalMem.toFixed(2)} GB`);
  console.log(`Used:  ${usedMem.toFixed(2)} GB (${memUsagePercent.toFixed(2)}%)`);
  console.log(`Free:  ${freeMem.toFixed(2)} GB\n`);

  // Find agent processes
  const result = execSync("pgrep -f 'agent-runner.js' || echo 'No agents running'")
    .toString()
    .trim();

  if (result === 'No agents running') {
    console.log('No agents are currently running.');
  } else {
    const pids = result.split('\n');
    console.log(`Found ${pids.length} running agent(s):`);
    
    pids.forEach(pid => {
      if (pid && !isNaN(parseInt(pid))) {
        console.log(`- Agent process PID: ${pid}`);
        try {
          const processInfo = execSync(`ps -p ${pid} -o %cpu,%mem,etime,lstart`).toString().trim();
          const info = formatProcessInfo(processInfo);
          
          if (info) {
            console.log(`  CPU Usage: ${info.cpu}%`);
            console.log(`  Memory Usage: ${info.mem}%`);
            console.log(`  Uptime: ${info.uptime}`);
            console.log(`  Started: ${info.startTime}\n`);
          }
        } catch (error) {
          console.log("  Process info not available\n");
        }
      }
    });

    if (fs.existsSync(MCP_CONFIG_PATH)) {
      const agentsConfig = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf8'));
      displayTaskProgress(agentsConfig);
    }
  }
} catch (error) {
  console.error('Error checking agent status:', error);
  process.exit(1);
}
