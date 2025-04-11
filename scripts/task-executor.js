#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_CONFIG_PATH = path.join(__dirname, '..', '.mcp', 'agents.json');
const PROJECT_STATUS_PATH = path.join(__dirname, '..', '.mcp', 'project-status.json');

function updateTaskStatus(taskId, status, progress) {
  try {
    const statusDir = path.dirname(PROJECT_STATUS_PATH);
    if (!fs.existsSync(statusDir)) {
      fs.mkdirSync(statusDir, { recursive: true });
    }

    let projectStatus = {
      lastUpdated: new Date().toISOString(),
      tasks: []
    };

    if (fs.existsSync(PROJECT_STATUS_PATH)) {
      const fileContent = fs.readFileSync(PROJECT_STATUS_PATH, 'utf8');
      if (fileContent) {
        projectStatus = JSON.parse(fileContent);
        if (!projectStatus.tasks) {
          projectStatus.tasks = [];
        }
      }
    }

    const taskIndex = projectStatus.tasks.findIndex(t => t.id === taskId);
    if (taskIndex >= 0) {
      projectStatus.tasks[taskIndex] = {
        ...projectStatus.tasks[taskIndex],
        status,
        progress,
        updatedAt: new Date().toISOString()
      };
    } else {
      projectStatus.tasks.push({
        id: taskId,
        status,
        progress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    fs.writeFileSync(PROJECT_STATUS_PATH, JSON.stringify(projectStatus, null, 2));
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

async function executeTask(task, agent) {
  console.log(`Executing task: ${task.name} (${agent})`);
  
  try {
    switch (task.name) {
      case 'lint':
        execSync('npm run lint', { stdio: 'inherit' });
        return true;
      case 'test':
        execSync('npm run test', { stdio: 'inherit' });
        return true;
      case 'status-report':
        const report = {
          timestamp: new Date().toISOString(),
          agent,
          task: task.name,
          status: 'completed'
        };
        fs.writeFileSync('status-report.json', JSON.stringify(report, null, 2));
        return true;
      case 'deploy':
        execSync('npm run build && npm run deploy', { stdio: 'inherit' });
        return true;
      default:
        console.log(`Unknown task: ${task.name}`);
        return false;
    }
  } catch (error) {
    console.error(`Error executing task ${task.name}:`, error);
    return false;
  }
}

// Start execution
try {
  const agentsConfig = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf8'));

  Object.entries(agentsConfig.agents).forEach(async ([agentName, agent]) => {
    if (!agent.tasks?.length) return;
    
    for (const task of agent.tasks) {
      if (task.status !== 'completed') {
        console.log(`\nAgent ${agentName} starting task: ${task.name}`);
        updateTaskStatus(task.id || task.name, 'in-progress', 0);
        
        const success = await executeTask(task, agentName);
        
        if (success) {
          updateTaskStatus(task.id || task.name, 'completed', 100);
          console.log(`Task ${task.name} completed successfully`);
        } else {
          updateTaskStatus(task.id || task.name, 'failed', 0);
          console.log(`Task ${task.name} failed`);
        }
      }
    }
  });
} catch (error) {
  console.error('Error executing tasks:', error);
  process.exit(1);
}
