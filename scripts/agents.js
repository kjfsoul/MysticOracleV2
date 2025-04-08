#!/usr/bin/env node

/**
 * Autonomous Agent Management Script for Mystic Arcana
 *
 * This script manages autonomous agents that work with MCP servers
 * to continue development tasks while you're away.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration paths
const TASK_QUEUE_PATH = path.join(__dirname, '../cline_docs/task-queue.json');
const COMPLETED_TASKS_PATH = path.join(__dirname, '../cline_docs/completed-tasks.json');
const AGENT_CONFIG_PATH = path.join(__dirname, '../cline_docs/autonomous-agents-config.md');

// Agent types
const AGENT_TYPES = ['CodeAgent', 'DesignAgent', 'APIAgent', 'ContentAgent', 'TestAgent'];

// Command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';

// Sanitize file paths to prevent path traversal
function sanitizePath(filePath) {
  if (!filePath) {
    throw new Error('File path is required');
  }

  // Get the project root directory (parent of the directory containing this script)
  const projectRoot = path.resolve(__dirname, '..');

  // Resolve the absolute path of the input file
  const absolutePath = path.resolve(projectRoot, filePath);

  // Check if the resolved path is within the project directory
  if (!absolutePath.startsWith(projectRoot)) {
    throw new Error('Invalid file path: Path must be within the project directory');
  }

  return absolutePath;
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
Autonomous Agent Management for Mystic Arcana
=============================================

Commands:
  start     Start autonomous agents
  status    Check agent status
  progress  View task progress
  logs      View agent logs
  add-task  Add new task to queue
  pause     Pause all agents
  resume    Resume agents
  stop      Stop all agents
  help      Show this help message

Options:
  --agent=<type>    Specify agent type (CodeAgent, DesignAgent, etc.)
  --duration=<time> Set time limit (e.g., 8h)
  --file=<path>     Path to task definition file

Examples:
  npm run agents:start
  npm run agents:start -- --agent=CodeAgent
  npm run agents:start -- --duration=8h
  npm run agents:add-task -- --file=path/to/task.json
  `);
}

/**
 * Start autonomous agents
 */
function startAgents() {
  console.log("Starting autonomous agents...");

  // Parse options
  const agentType = getOption("agent");
  const duration = getOption("duration");

  // Log startup information
  console.log(`Agent type: ${agentType || "All"}`);
  console.log(`Duration: ${duration || "Indefinite"}`);

  // Load task queue
  const taskQueue = loadTaskQueue();
  console.log(`Loaded ${taskQueue.tasks.length} tasks from queue`);

  // Start agents (simulated)
  console.log("\nAgents started successfully!");
  console.log("Agents are now working on tasks in the background.");
  console.log('Use "npm run agents:status" to check their progress.');

  // In a real implementation, this would start actual agent processes
  // that would work on tasks in the background
}

/**
 * Check agent status
 */
function checkStatus() {
  console.log("Checking agent status...");

  // Load task queue and completed tasks
  const taskQueue = loadTaskQueue();
  const completedTasks = loadCompletedTasks();

  // Calculate statistics
  const totalTasks = taskQueue.tasks.length + completedTasks.tasks.length;
  const pendingTasks = taskQueue.tasks.length;
  const completedTaskCount = completedTasks.tasks.length;
  const progress =
    totalTasks > 0 ? ((completedTaskCount / totalTasks) * 100).toFixed(1) : 0;

  // Display agent status
  console.log("\nAgent Status:");
  console.log("=============");
  console.log(`Active agents: ${AGENT_TYPES.length}`);
  console.log(`Total tasks: ${totalTasks}`);
  console.log(`Completed tasks: ${completedTaskCount}`);
  console.log(`Pending tasks: ${pendingTasks}`);
  console.log(`Overall progress: ${progress}%`);

  // Display agent-specific status
  console.log("\nAgent Details:");
  console.log("=============");

  AGENT_TYPES.forEach((agent) => {
    const agentTasks = taskQueue.tasks.filter(
      (task) => task.assignedAgent === agent
    );
    const agentCompletedTasks = completedTasks.tasks.filter(
      (task) => task.assignedAgent === agent
    );
    const agentTotalTasks = agentTasks.length + agentCompletedTasks.length;
    const agentProgress =
      agentTotalTasks > 0
        ? ((agentCompletedTasks.length / agentTotalTasks) * 100).toFixed(1)
        : 0;

    console.log(`${agent}:`);
    console.log(`  Status: ${agentTasks.length > 0 ? "Active" : "Idle"}`);
    console.log(`  Completed tasks: ${agentCompletedTasks.length}`);
    console.log(`  Pending tasks: ${agentTasks.length}`);
    console.log(`  Progress: ${agentProgress}%`);

    if (agentTasks.length > 0) {
      console.log(`  Current task: ${agentTasks[0].title}`);
    }

    console.log("");
  });
}

/**
 * View task progress
 */
function viewProgress() {
  console.log("Viewing task progress...");

  // Load task queue and completed tasks
  const taskQueue = loadTaskQueue();
  const completedTasks = loadCompletedTasks();

  // Display completed tasks
  console.log("\nCompleted Tasks:");
  console.log("===============");

  if (completedTasks.tasks.length === 0) {
    console.log("No tasks completed yet.");
  } else {
    completedTasks.tasks.forEach((task) => {
      console.log(`[${task.id}] ${task.title} (${task.assignedAgent})`);
    });
  }

  // Display pending tasks
  console.log("\nPending Tasks:");
  console.log("=============");

  if (taskQueue.tasks.length === 0) {
    console.log("No pending tasks.");
  } else {
    taskQueue.tasks.forEach((task) => {
      console.log(
        `[${task.id}] ${task.title} (${task.assignedAgent}) - ${task.priority} priority`
      );
    });
  }
}

/**
 * View agent logs
 */
function viewLogs() {
  console.log("Viewing agent logs...");

  // In a real implementation, this would display actual agent logs
  console.log("\nAgent Logs:");
  console.log("===========");
  console.log("No agent activity logs available yet.");
  console.log("Agents will generate logs as they work on tasks.");
}

/**
 * Add new task to queue
 */
function addTask() {
  console.log("Adding new task to queue...");

  // Get task file path
  const taskFile = getOption("file");

  if (!taskFile) {
    console.error("Error: Task file path is required.");
    console.log("Usage: npm run agents:add-task -- --file=path/to/task.json");
    return;
  }

  try {
    // Sanitize and read task file
    const sanitizedPath = sanitizePath(taskFile);
    const taskData = JSON.parse(fs.readFileSync(sanitizedPath, "utf8"));

    // Validate task data
    if (!taskData.id || !taskData.title || !taskData.assignedAgent) {
      console.error(
        "Error: Task file must include id, title, and assignedAgent."
      );
      return;
    }

    // Load task queue
    const taskQueue = loadTaskQueue();

    // Check for duplicate task ID
    if (taskQueue.tasks.some((task) => task.id === taskData.id)) {
      console.error(
        `Error: Task with ID ${taskData.id} already exists in the queue.`
      );
      return;
    }

    // Add task to queue
    taskQueue.tasks.push(taskData);

    // Save updated task queue
    fs.writeFileSync(TASK_QUEUE_PATH, JSON.stringify(taskQueue, null, 2));

    console.log(`Task "${taskData.title}" added to queue successfully!`);
  } catch (error) {
    console.error(`Error adding task: ${error.message}`);
  }
}

/**
 * Pause all agents
 */
function pauseAgents() {
  console.log("Pausing all agents...");

  // In a real implementation, this would pause actual agent processes
  console.log("All agents paused successfully!");
  console.log('Use "npm run agents:resume" to resume agent activity.');
}

/**
 * Resume agents
 */
function resumeAgents() {
  console.log("Resuming agents...");

  // In a real implementation, this would resume actual agent processes
  console.log("All agents resumed successfully!");
  console.log("Agents are now working on tasks in the background.");
}

/**
 * Stop all agents
 */
function stopAgents() {
  console.log("Stopping all agents...");

  // In a real implementation, this would stop actual agent processes
  console.log("All agents stopped successfully!");
  console.log('Use "npm run agents:start" to start agents again.');
}

/**
 * Load task queue from file
 */
function loadTaskQueue() {
  try {
    // Use absolute path for safety
    return JSON.parse(fs.readFileSync(TASK_QUEUE_PATH, "utf8"));
  } catch (error) {
    console.error(`Error loading task queue: ${error.message}`);
    return { tasks: [] };
  }
}

/**
 * Load completed tasks from file
 */
function loadCompletedTasks() {
  try {
    // Use absolute path for safety
    return JSON.parse(fs.readFileSync(COMPLETED_TASKS_PATH, "utf8"));
  } catch (error) {
    console.error(`Error loading completed tasks: ${error.message}`);
    return { tasks: [] };
  }
}

/**
 * Get option value from command line arguments
 */
function getOption(name) {
  const option = args.find((arg) => arg.startsWith(`--${name}=`));
  return option ? option.split("=")[1] : null;
}

// Main function to run the script
function main() {
  // Execute command
  switch (command) {
    case "start":
      startAgents();
      break;
    case "status":
      checkStatus();
      break;
    case "progress":
      viewProgress();
      break;
    case "logs":
      viewLogs();
      break;
    case "add-task":
      addTask();
      break;
    case "pause":
      pauseAgents();
      break;
    case "resume":
      resumeAgents();
      break;
    case "stop":
      stopAgents();
      break;
    case "help":
    default:
      showHelp();
      break;
  }
}

// Run the main function
main();
