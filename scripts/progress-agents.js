#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsConfigPath = path.join(__dirname, '..', '.mcp', 'agents.json');
const progressBarLength = 40;

function createProgressBar(percent) {
  const filled = Math.round(progressBarLength * (percent / 100));
  const empty = progressBarLength - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

try {
  const agentsConfig = JSON.parse(fs.readFileSync(agentsConfigPath, 'utf8'));
  const agents = agentsConfig.agents;
  
  console.log('\nTask Progress Summary:');
  console.log('=====================');
  
  let totalTasks = 0;
  let completedTasks = 0;
  
  // Calculate overall progress
  Object.entries(agents).forEach(([agentName, agent]) => {
    if (agent.tasks) {
      totalTasks += agent.tasks.length;
      agent.tasks.forEach(task => {
        if (task.completed) completedTasks++;
      });
    }
  });
  
  const overallProgress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  console.log(`Overall Progress: ${createProgressBar(overallProgress)} ${overallProgress.toFixed(1)}%`);
  console.log(`Total Tasks: ${totalTasks} (${completedTasks} completed, ${totalTasks - completedTasks} pending)\n`);
  
  // Show per-agent progress
  console.log('Agent Progress:');
  Object.entries(agents).forEach(([agentName, agent]) => {
    if (agent.tasks) {
      const agentCompleted = agent.tasks.filter(t => t.completed).length;
      const agentProgress = agent.tasks.length ? (agentCompleted / agent.tasks.length) * 100 : 0;
      
      console.log(`${agentName.padEnd(15)} ${createProgressBar(agentProgress)} ${agentProgress.toFixed(1)}%`);
      console.log(`${' '.repeat(16)}Tasks: ${agentCompleted}/${agent.tasks.length} completed\n`);
    }
  });
  
  // Show next tasks in queue
  console.log('\nNext Tasks in Queue:\n');
  let taskNum = 1;
  
  Object.entries(agents).forEach(([agentName, agent]) => {
    if (agent.tasks) {
      agent.tasks
        .filter(task => !task.completed)
        .forEach(task => {
          console.log(`${taskNum}. ${task.name}`);
          console.log(`   ID: ${task.name}`);
          console.log(`   Type: ${task.type}`);
          console.log(`   Priority: ${task.priority}`);
          console.log(`   Agent: ${agentName}`);
          if (task.estimatedTime) console.log(`   Est. Time: ~${task.estimatedTime}`);
          if (task.description) console.log(`   Description: ${task.description}`);
          console.log('');
          taskNum++;
        });
    }
  });
  
} catch (error) {
  console.error('Error generating progress report:', error.message);
  process.exit(1);
}
