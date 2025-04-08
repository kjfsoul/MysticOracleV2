#!/usr/bin/env node

/**
 * Task Chunker CLI
 * 
 * Command-line interface for the Task Chunking Agent.
 * This tool helps break down large tasks into manageable chunks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import TaskChunkingAgent from './agents/task-chunking-agent.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';

// Execute the requested command
async function main() {
  try {
    switch (command) {
      case 'analyze':
        await analyzeTask();
        break;
      case 'execute':
        await executeTask(args[1]);
        break;
      case 'list':
        await listTasks();
        break;
      case 'resume':
        await resumeTask(args[1]);
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    rl.close();
  }
}

// Show help
function showHelp() {
  console.log(`
Task Chunker - Break down large tasks into manageable chunks

Usage:
  node scripts/task-chunker.js <command> [options]

Commands:
  analyze             Analyze a new task and break it down into chunks
  execute <task-id>   Execute a task that has been analyzed
  list                List all saved tasks
  resume <task-id>    Resume a paused task
  help                Show this help message

Examples:
  node scripts/task-chunker.js analyze
  node scripts/task-chunker.js execute task-2023-01-01T12-00-00.000Z
  node scripts/task-chunker.js list
  node scripts/task-chunker.js resume task-2023-01-01T12-00-00.000Z
`);
}

// Analyze a new task
async function analyzeTask() {
  console.log('=== Task Analysis ===\n');
  console.log('Enter the task description (type "END" on a new line when finished):');
  
  let taskDescription = '';
  let line = '';
  
  // Read multi-line input
  while (true) {
    line = await askQuestion('');
    if (line === 'END') break;
    taskDescription += line + '\n';
  }
  
  if (!taskDescription.trim()) {
    console.log('Task description cannot be empty.');
    return;
  }
  
  // Get additional options
  const chunkSizeOptions = ['small', 'medium', 'large'];
  let chunkSize = '';
  
  while (!chunkSizeOptions.includes(chunkSize)) {
    chunkSize = await askQuestion(`Chunk size (${chunkSizeOptions.join('/')}): `);
    if (!chunkSizeOptions.includes(chunkSize)) {
      console.log(`Invalid chunk size. Please enter one of: ${chunkSizeOptions.join(', ')}`);
    }
  }
  
  const autoExecuteOptions = ['y', 'n'];
  let autoExecuteInput = '';
  
  while (!autoExecuteOptions.includes(autoExecuteInput)) {
    autoExecuteInput = await askQuestion('Auto-execute chunks? (y/n): ');
    if (!autoExecuteOptions.includes(autoExecuteInput)) {
      console.log('Invalid input. Please enter y or n.');
    }
  }
  
  const autoExecute = autoExecuteInput === 'y';
  
  // Create and configure the agent
  const agent = new TaskChunkingAgent();
  
  // Analyze the task
  console.log('\nAnalyzing task...');
  const chunks = await agent.analyzeTask(taskDescription, { chunkSize, autoExecute });
  
  // Display the chunks
  console.log('\nTask broken down into the following chunks:');
  chunks.forEach((chunk, index) => {
    console.log(`\nChunk ${index + 1}/${chunks.length}:`);
    console.log(`- ID: ${chunk.id}`);
    console.log(`- Complexity: ${chunk.estimatedComplexity}`);
    console.log(`- Description: ${chunk.description.substring(0, 100)}...`);
  });
  
  // Ask if the user wants to execute the task now
  const executeNow = await askQuestion('\nExecute task now? (y/n): ');
  
  if (executeNow.toLowerCase() === 'y') {
    await agent.executeTask(autoExecute);
  } else {
    console.log(`\nTask saved with ID: ${agent.taskId}`);
    console.log('You can execute it later with:');
    console.log(`node scripts/task-chunker.js execute ${agent.taskId}`);
  }
}

// Execute a task
async function executeTask(taskId) {
  if (!taskId) {
    console.log('Error: Task ID is required.');
    console.log('Usage: node scripts/task-chunker.js execute <task-id>');
    return;
  }
  
  try {
    // Load the task
    const agent = TaskChunkingAgent.loadTask(taskId);
    
    // Execute the task
    console.log(`Executing task: ${taskId}`);
    const result = await agent.executeTask();
    
    // Display the result
    console.log('\nTask execution completed:');
    console.log(`- Status: ${result.status}`);
    console.log(`- Completed chunks: ${result.completedChunks}/${result.totalChunks}`);
    
    if (result.status === 'paused') {
      console.log('\nYou can resume this task later with:');
      console.log(`node scripts/task-chunker.js resume ${taskId}`);
    }
  } catch (error) {
    console.error(`Error executing task: ${error.message}`);
  }
}

// List all saved tasks
async function listTasks() {
  const tasks = TaskChunkingAgent.listTasks();
  
  if (tasks.length === 0) {
    console.log('No saved tasks found.');
    return;
  }
  
  console.log('=== Saved Tasks ===\n');
  
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.taskId}`);
    console.log(`   Status: ${task.status}`);
    console.log(`   Progress: ${task.completedChunks}/${task.totalChunks} chunks`);
    console.log(`   Started: ${new Date(task.startTime).toLocaleString()}`);
    
    if (task.endTime) {
      console.log(`   Ended: ${new Date(task.endTime).toLocaleString()}`);
    }
    
    console.log('');
  });
}

// Resume a paused task
async function resumeTask(taskId) {
  if (!taskId) {
    console.log('Error: Task ID is required.');
    console.log('Usage: node scripts/task-chunker.js resume <task-id>');
    return;
  }
  
  try {
    // Load the task
    const agent = TaskChunkingAgent.loadTask(taskId);
    
    if (agent.status !== 'paused' && agent.status !== 'in_progress') {
      console.log(`Error: Cannot resume task with status: ${agent.status}`);
      return;
    }
    
    // Resume the task
    console.log(`Resuming task: ${taskId}`);
    const result = await agent.executeTask();
    
    // Display the result
    console.log('\nTask execution completed:');
    console.log(`- Status: ${result.status}`);
    console.log(`- Completed chunks: ${result.completedChunks}/${result.totalChunks}`);
    
    if (result.status === 'paused') {
      console.log('\nYou can resume this task later with:');
      console.log(`node scripts/task-chunker.js resume ${taskId}`);
    }
  } catch (error) {
    console.error(`Error resuming task: ${error.message}`);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
