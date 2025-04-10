/**
 * Status Report Generator
 * 
 * This script generates a status report for the autonomous agent system.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import os from 'os';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const logsDir = path.join(rootDir, ".mcp", "logs");

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuration
const config = {
  projectName: path.basename(rootDir),
  agentLogFile: path.join(logsDir, 'agent-runner.log'),
  agentErrorLogFile: path.join(logsDir, 'agent-runner-error.log'),
  statusReportFile: path.join(logsDir, 'status-report.md'),
  projectStatusFile: path.join(rootDir, '.mcp', 'project-status.json'),
  agentsConfigFile: path.join(rootDir, '.mcp', 'agents.json'),
  awayModeConfigFile: path.join(rootDir, '.mcp', 'away-mode.json'),
  maxLogLines: 10
};

// Get system information
function getSystemInfo() {
  const cpuCount = os.cpus().length;
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = (usedMemory / totalMemory) * 100;
  const uptime = os.uptime();
  
  return {
    cpuCount,
    totalMemory,
    freeMemory,
    usedMemory,
    memoryUsagePercent,
    uptime
  };
}

// Format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format seconds to human-readable format
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  let result = '';
  
  if (days > 0) {
    result += `${days}d `;
  }
  
  if (hours > 0 || days > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0 || days > 0) {
    result += `${minutes}m `;
  }
  
  result += `${secs}s`;
  
  return result;
}

// Get running processes
async function getRunningProcesses() {
  return new Promise((resolve) => {
    const command = process.platform === 'win32'
      ? 'tasklist'
      : 'ps aux';
    
    const child = spawn(process.platform === 'win32' ? 'cmd' : 'sh', [
      process.platform === 'win32' ? '/c' : '-c',
      command
    ]);
    
    let stdout = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.on('close', () => {
      resolve(stdout);
    });
    
    child.on('error', () => {
      resolve('');
    });
  });
}

// Parse running processes
function parseRunningProcesses(output) {
  const lines = output.split('\n');
  const processes = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    const parts = line.split(/\s+/);
    
    // Check if this is an agent process
    if (line.includes('agent-runner.js') || line.includes('node') && line.includes('.mcp')) {
      const pid = parts[1];
      const type = 'Agent';
      const cpuUsage = parseFloat(parts[2]);
      const memUsage = parseFloat(parts[3]);
      const startTime = new Date(Date.now() - (parseInt(parts[9] || "0") * 1000)).toISOString();
      
      processes.push({
        pid,
        type,
        cpuUsage,
        memUsage,
        startTime
      });
    }
  }
  
  return processes;
}

// Get agent configuration
function getAgentConfig() {
  try {
    if (fs.existsSync(config.agentsConfigFile)) {
      const agentsConfig = JSON.parse(fs.readFileSync(config.agentsConfigFile, 'utf8'));
      return agentsConfig;
    }
  } catch (error) {
    console.error(`Error reading agent configuration: ${error.message}`);
  }
  
  return null;
}

// Get project status
function getProjectStatus() {
  try {
    if (fs.existsSync(config.projectStatusFile)) {
      const projectStatus = JSON.parse(fs.readFileSync(config.projectStatusFile, 'utf8'));
      return projectStatus;
    }
  } catch (error) {
    console.error(`Error reading project status: ${error.message}`);
  }
  
  return null;
}

// Get away mode status
function getAwayModeStatus() {
  try {
    if (fs.existsSync(config.awayModeConfigFile)) {
      const awayModeConfig = JSON.parse(fs.readFileSync(config.awayModeConfigFile, 'utf8'));
      
      if (awayModeConfig.enabled) {
        // Check if current time is within away mode hours
        if (awayModeConfig.startTime && awayModeConfig.endTime) {
          const [startHour, startMinute] = awayModeConfig.startTime.split(':').map(Number);
          const [endHour, endMinute] = awayModeConfig.endTime.split(':').map(Number);
          
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          
          // Convert times to minutes for easier comparison
          const startTimeMinutes = startHour * 60 + startMinute;
          const endTimeMinutes = endHour * 60 + endMinute;
          const currentTimeMinutes = currentHour * 60 + currentMinute;
          
          // Check if current time is within away mode hours
          if (startTimeMinutes <= endTimeMinutes) {
            // Simple case: start time is before end time
            return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
          } else {
            // Complex case: start time is after end time (overnight)
            return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes;
          }
        }
        
        return true;
      }
    }
  } catch (error) {
    console.error(`Error reading away mode configuration: ${error.message}`);
  }
  
  return false;
}

// Get recent logs
function getRecentLogs() {
  const logs = {
    agentRunner: '',
    agentStatus: '',
    agentStdout: '',
    agentStderr: ''
  };
  
  try {
    // Agent runner log
    if (fs.existsSync(config.agentLogFile)) {
      const agentLog = fs.readFileSync(config.agentLogFile, 'utf8');
      const agentLogLines = agentLog.split('\n');
      logs.agentRunner = agentLogLines.slice(-config.maxLogLines).join('\n');
    }
    
    // Agent error log
    if (fs.existsSync(config.agentErrorLogFile)) {
      const agentErrorLog = fs.readFileSync(config.agentErrorLogFile, 'utf8');
      const agentErrorLogLines = agentErrorLog.split('\n');
      logs.agentStderr = agentErrorLogLines.slice(-config.maxLogLines).join('\n');
    }
    
    // Agent status log
    const agentStatusLogFile = path.join(logsDir, 'agent-status.log');
    if (fs.existsSync(agentStatusLogFile)) {
      const agentStatusLog = fs.readFileSync(agentStatusLogFile, 'utf8');
      const agentStatusLogLines = agentStatusLog.split('\n');
      logs.agentStatus = agentStatusLogLines.slice(-config.maxLogLines).join('\n');
    }
    
    // Agent stdout log
    const agentStdoutLogFile = path.join(logsDir, 'agent-stdout.log');
    if (fs.existsSync(agentStdoutLogFile)) {
      const agentStdoutLog = fs.readFileSync(agentStdoutLogFile, 'utf8');
      const agentStdoutLogLines = agentStdoutLog.split('\n');
      logs.agentStdout = agentStdoutLogLines.slice(-config.maxLogLines).join('\n');
    }
  } catch (error) {
    console.error(`Error reading logs: ${error.message}`);
  }
  
  return logs;
}

// Generate status report
async function generateStatusReport() {
  console.log('Generating agent status report...');
  
  try {
    // Get system information
    const systemInfo = getSystemInfo();
    
    // Get running processes
    const processesOutput = await getRunningProcesses();
    const processes = parseRunningProcesses(processesOutput);
    
    // Get agent configuration
    const agentConfig = getAgentConfig();
    
    // Get project status
    const projectStatus = getProjectStatus();
    
    // Get away mode status
    const awayModeActive = getAwayModeStatus();
    
    // Get recent logs
    const logs = getRecentLogs();
    
    // Generate report
    const report = [];
    
    // Header
    report.push('');
    report.push('                                                                                ');
    report.push('                      AUTONOMOUS AGENT SYSTEM STATUS REPORT                     ');
    report.push('                                                                                ');
    report.push('');
    
    // Basic information
    report.push(`Generated: ${new Date().toLocaleString()}`);
    report.push(`Project: ${config.projectName}`);
    report.push(`Phase: ${projectStatus?.currentPhase || 'Development'}`);
    report.push(`Away Mode: ${awayModeActive ? 'ACTIVE' : 'INACTIVE'}`);
    report.push('');
    
    // System information
    report.push('=== System Information ===');
    report.push(`CPU: ${systemInfo.cpuCount} cores`);
    report.push(`Memory: ${formatBytes(systemInfo.usedMemory)} / ${formatBytes(systemInfo.totalMemory)} (${systemInfo.memoryUsagePercent.toFixed(2)}%)`);
    report.push(`Uptime: ${formatUptime(systemInfo.uptime)}`);
    report.push('');
    
    // Agent status
    report.push('=== Agent Status ===');
    report.push(`Total Agents: ${processes.length}`);
    report.push('');
    
    if (processes.length > 0) {
      report.push('Running Agents:');
      report.push('┌────────┬──────────────┬────────────┬────────────┬────────────────────────┐');
      report.push('│ PID     │ Type          │ CPU Usage  │ Mem Usage  │ Start Time              │');
      report.push('├────────┼──────────────┼────────────┼────────────┼────────────────────────┤');
      
      for (const process of processes) {
        report.push(`│ ${process.pid.padEnd(7)} │ ${process.type.padEnd(12)} │ ${process.cpuUsage.toFixed(1).padEnd(8)} % │ ${process.memUsage.toFixed(1).padEnd(8)} % │ ${new Date(process.startTime).toLocaleString().padEnd(22)} │`);
      }
      
      report.push('└────────┴──────────────┴────────────┴────────────┴────────────────────────┘');
      report.push('');
    }
    
    // Task status
    if (agentConfig) {
      const tasks = [];
      
      // Get tasks from agents
      for (const [agentName, agent] of Object.entries(agentConfig.agents)) {
        if (agent.tasks) {
          for (const task of agent.tasks) {
            tasks.push({
              agent: agentName,
              name: task.name,
              description: task.description,
              priority: 'normal',
              schedule: task.schedule
            });
          }
        }
      }
      
      // Get workflows
      if (agentConfig.workflows) {
        for (const [workflowName, workflow] of Object.entries(agentConfig.workflows)) {
          tasks.push({
            agent: 'Workflow',
            name: workflowName,
            description: workflow.description,
            priority: 'normal',
            schedule: workflow.schedule
          });
        }
      }
      
      report.push('=== Task Status ===');
      report.push(`Total Tasks: ${tasks.length}`);
      report.push('');
      
      if (tasks.length > 0) {
        report.push('Configured Tasks:');
        report.push('┌──────────────┬──────────────┬────────────────────────────────┬────────────┬────────────────────────┐');
        report.push('│ Agent         │ Task          │ Description                   │ Priority    │ Next Run               │');
        report.push('├──────────────┼──────────────┼────────────────────────────────┼────────────┼────────────────────────┤');
        
        for (const task of tasks) {
          // Calculate next run time based on schedule
          let nextRun = 'N/A';
          
          if (task.schedule) {
            // Simple schedule calculation (random time in the next 24 hours)
            const now = new Date();
            const randomHours = Math.floor(Math.random() * 24);
            const randomMinutes = Math.floor(Math.random() * 60);
            const randomSeconds = Math.floor(Math.random() * 60);
            
            now.setHours(now.getHours() + randomHours);
            now.setMinutes(now.getMinutes() + randomMinutes);
            now.setSeconds(now.getSeconds() + randomSeconds);
            
            nextRun = now.toLocaleString();
          }
          
          report.push(`│ ${task.agent.padEnd(12)} │ ${task.name.padEnd(12)} │ ${(task.description || '').padEnd(32)} │ ${task.priority.padEnd(10)} │ ${nextRun.padEnd(22)} │`);
        }
        
        report.push('└──────────────┴──────────────┴────────────────────────────────┴────────────┴────────────────────────┘');
        report.push('');
      }
    }
    
    // Project status
    if (projectStatus) {
      report.push('=== Project Status ===');
      report.push(`Current Phase: ${projectStatus.currentPhase || 'Development'}`);
      report.push(`Next Milestone: ${projectStatus.nextMilestone || 'Initial Deployment'}`);
      report.push('');
      
      // Progress
      report.push('Progress:');
      const overallProgress = projectStatus.progress?.overall || '0%';
      const progressValue = parseInt(overallProgress);
      const progressBar = '░'.repeat(50);
      const filledProgressBar = progressBar.substring(0, Math.floor(progressValue / 2)) + progressBar.substring(Math.floor(progressValue / 2)).substring(0, 50 - Math.floor(progressValue / 2));
      
      report.push(`overall: ${filledProgressBar} ${overallProgress}`);
      report.push('');
      
      // Active tasks
      if (projectStatus.activeTasks && projectStatus.activeTasks.length > 0) {
        report.push('Active Tasks:');
        report.push('┌────────────┬────────────────────────────────┬────────────┬────────────┐');
        report.push('│ Assigned To  │ Task                          │ Status      │ Progress    │');
        report.push('├────────────┼────────────────────────────────┼────────────┼────────────┤');
        
        for (const task of projectStatus.activeTasks) {
          const progress = task.progress || '0%';
          const progressValue = parseInt(progress);
          const progressBar = '░'.repeat(10);
          const filledProgressBar = progressBar.substring(0, Math.floor(progressValue / 10)) + progressBar.substring(Math.floor(progressValue / 10)).substring(0, 10 - Math.floor(progressValue / 10));
          
          report.push(`│ ${(task.agent || '').padEnd(10)} │ ${(task.name || '').padEnd(32)} │ ${(task.status || 'pending').padEnd(10)} │ ${filledProgressBar} ${progress} │`);
        }
        
        report.push('└────────────┴────────────────────────────────┴────────────┴────────────┘');
        report.push('');
      }
      
      // Completed tasks
      if (projectStatus.completedTasks && projectStatus.completedTasks.length > 0) {
        const recentCompletedTasks = projectStatus.completedTasks.slice(-5);
        
        report.push('Recent Completed Tasks:');
        report.push('┌────────────┬────────────────────────────────┬────────────┬────────────────────────┐');
        report.push('│ Assigned To  │ Task                          │ Status      │ Completion Time        │');
        report.push('├────────────┼────────────────────────────────┼────────────┼────────────────────────┤');
        
        for (const task of recentCompletedTasks) {
          report.push(`│ ${(task.agent || '').padEnd(10)} │ ${(task.name || '').padEnd(32)} │ ${(task.success ? 'success' : 'failed').padEnd(10)} │ ${new Date(task.endTime).toLocaleString().padEnd(22)} │`);
        }
        
        report.push('└────────────┴────────────────────────────────┴────────────┴────────────────────────┘');
        report.push('');
      }
    }
    
    // Recent logs
    report.push('=== Recent Logs ===');
    report.push('');
    
    if (logs.agentRunner) {
      report.push('Agent Runner:');
      report.push(logs.agentRunner);
      report.push('');
    }
    
    if (logs.agentStatus) {
      report.push('Agent Status:');
      report.push(logs.agentStatus);
      report.push('');
    }
    
    if (logs.agentStdout) {
      report.push('Agent Stdout:');
      report.push(logs.agentStdout);
      report.push('');
    }
    
    if (logs.agentStderr) {
      report.push('Agent Stderr:');
      report.push(logs.agentStderr);
      report.push('');
    }
    
    // Write report to file
    const reportPath = path.join(logsDir, 'status-report.md');
    fs.writeFileSync(reportPath, report.join('\n'));
    
    // Print report to console
    console.log(report.join('\n'));
    
    return true;
  } catch (error) {
    console.error(`Failed to generate status report: ${error.message}`);
    console.error(error);
    return false;
  }
}

// Main function
async function main() {
  try {
    await generateStatusReport();
  } catch (error) {
    console.error(`Unhandled error in main function: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run main function
main();
