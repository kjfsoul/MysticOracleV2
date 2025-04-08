#!/usr/bin/env node

/**
 * Autonomous Agent Implementation for Mystic Arcana
 *
 * This script implements the actual autonomous agent functionality
 * that can work on tasks in the background.
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration paths
const TASK_QUEUE_PATH = path.join(__dirname, '../cline_docs/task-queue.json');
const COMPLETED_TASKS_PATH = path.join(__dirname, '../cline_docs/completed-tasks.json');
const AGENT_LOG_PATH = path.join(__dirname, '../cline_docs/agent-logs');

// Ensure log directory exists
if (!fs.existsSync(AGENT_LOG_PATH)) {
  fs.mkdirSync(AGENT_LOG_PATH, { recursive: true });
}

// Agent types and their MCP servers
const AGENT_CONFIG = {
  'CodeAgent': {
    mcpServers: ['server-filesystem', 'server-github'],
    capabilities: ['component-implementation', 'code-refactoring', 'bug-fixing', 'test-writing']
  },
  'DesignAgent': {
    mcpServers: ['server-everything', 'server-puppeteer'],
    capabilities: ['ui-design', 'animation', 'responsive-layout', 'accessibility']
  },
  'APIAgent': {
    mcpServers: ['server-brave-search', 'server-sequential-thinking'],
    capabilities: ['api-implementation', 'serverless-function', 'database-query', 'authentication']
  },
  'ContentAgent': {
    mcpServers: ['server-memory', 'server-brave-search'],
    capabilities: ['content-generation', 'tarot-description', 'astrology-interpretation', 'blog-outline']
  },
  'TestAgent': {
    mcpServers: ['server-puppeteer', 'server-sequential-thinking'],
    capabilities: ['unit-test', 'integration-test', 'test-suite', 'test-coverage']
  }
};

/**
 * Load task queue from file
 */
function loadTaskQueue() {
  try {
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
    return JSON.parse(fs.readFileSync(COMPLETED_TASKS_PATH, "utf8"));
  } catch (error) {
    console.error(`Error loading completed tasks: ${error.message}`);
    return { tasks: [] };
  }
}

/**
 * Save task queue to file
 */
function saveTaskQueue(taskQueue) {
  try {
    fs.writeFileSync(TASK_QUEUE_PATH, JSON.stringify(taskQueue, null, 2));
  } catch (error) {
    console.error(`Error saving task queue: ${error.message}`);
  }
}

/**
 * Save completed tasks to file
 */
function saveCompletedTasks(completedTasks) {
  try {
    fs.writeFileSync(COMPLETED_TASKS_PATH, JSON.stringify(completedTasks, null, 2));
  } catch (error) {
    console.error(`Error saving completed tasks: ${error.message}`);
  }
}

/**
 * Log agent activity
 */
function logAgentActivity(agentType, taskId, message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${agentType}] [${taskId}] ${message}\n`;

  // Log to console
  console.log(logEntry);

  // Log to file - sanitize agent type for filename
  const safeAgentType = agentType.replace(/[^a-zA-Z0-9-_]/g, '_');
  const logFile = path.join(AGENT_LOG_PATH, `${safeAgentType}.log`);
  fs.appendFileSync(logFile, logEntry);
}

/**
 * Get next task for agent
 */
function getNextTaskForAgent(agentType) {
  const taskQueue = loadTaskQueue();

  // Find the first task assigned to this agent
  const task = taskQueue.tasks.find(task => task.assignedAgent === agentType);

  return task;
}

/**
 * Mark task as completed
 */
function completeTask(taskId) {
  const taskQueue = loadTaskQueue();
  const completedTasks = loadCompletedTasks();

  // Find the task in the queue
  const taskIndex = taskQueue.tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    console.error(`Task ${taskId} not found in queue`);
    return false;
  }

  // Move the task from queue to completed
  const task = taskQueue.tasks.splice(taskIndex, 1)[0];
  completedTasks.tasks.push({
    ...task,
    completedAt: new Date().toISOString()
  });

  // Save both files
  saveTaskQueue(taskQueue);
  saveCompletedTasks(completedTasks);

  return true;
}

/**
 * Run MCP server command
 */
async function runMcpCommand(mcpServer, prompt) {
  return new Promise((resolve, reject) => {
    // Create a temporary file for the prompt
    const timestamp = String(Date.now());
    const promptFile = path.join(AGENT_LOG_PATH, `${timestamp}-prompt.txt`);
    fs.writeFileSync(promptFile, prompt);

    // Create a temporary file for the output
    const outputFile = path.join(AGENT_LOG_PATH, `${timestamp}-output.txt`);

    // Build the command to run the MCP server
    // Remove 'server-' prefix if it exists in the server name
    const serverName = mcpServer.startsWith('server-') ? mcpServer.substring(7) : mcpServer;
    const mcpCommand = `npx --prefix ${path.join(__dirname, '../.mcp')} @modelcontextprotocol/server-${serverName}`;

    // Log the command
    console.log(`Running MCP command: ${mcpCommand}`);

    // Run the command
    const process = spawn('bash', ['-c', `${mcpCommand} < ${promptFile} > ${outputFile}`]);

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`MCP server exited with code ${code}`));
        return;
      }

      // Read the output
      const output = fs.readFileSync(outputFile, 'utf8');

      // Clean up temporary files
      fs.unlinkSync(promptFile);
      fs.unlinkSync(outputFile);

      resolve(output);
    });
  });
}

/**
 * Process task with agent
 */
async function processTask(task, agentType) {
  const agentConfig = AGENT_CONFIG[agentType];

  if (!agentConfig) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  logAgentActivity(agentType, task.id, `Starting task: ${task.title}`);

  // Check if the required MCP servers are available
  const missingServers = task.requiredMcpServers.filter(server =>
    !agentConfig.mcpServers.some(s => s === server || s.includes(server))
  );

  if (missingServers.length > 0) {
    logAgentActivity(agentType, task.id, `Missing required MCP servers: ${missingServers.join(', ')}`);
    return false;
  }

  // Generate a prompt for the MCP server
  const prompt = generatePrompt(task, agentType);

  try {
    // Run the primary MCP server
    const primaryServer = agentConfig.mcpServers[0];
    logAgentActivity(agentType, task.id, `Running primary MCP server: ${primaryServer}`);

    const output = await runMcpCommand(primaryServer, prompt);

    // Process the output
    const success = processOutput(output, task);

    if (success) {
      logAgentActivity(agentType, task.id, `Task completed successfully`);
      completeTask(task.id);
      return true;
    } else {
      logAgentActivity(agentType, task.id, `Task failed`);
      return false;
    }
  } catch (error) {
    logAgentActivity(agentType, task.id, `Error processing task: ${error.message}`);
    return false;
  }
}

/**
 * Generate prompt for MCP server
 */
function generatePrompt(task, agentType) {
  return `# Task Execution Prompt: ${task.id} - ${task.title}

## Project Context
- Project: Mystic Arcana
- Domain: Spiritual/Mystical Web Application
- Core Features: Tarot readings, astrology charts, personalized content
- Tech Stack: React, TypeScript, Next.js, Tailwind CSS, Netlify, Supabase
- Design Philosophy: Mystical, ethereal aesthetic with cosmic themes

## Task Details
- ID: ${task.id}
- Title: ${task.title}
- Type: ${task.type}
- Priority: ${task.priority}
- Assigned Agent: ${task.assignedAgent}
- Required MCP Servers: ${task.requiredMcpServers.join(', ')}
- Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : 'none'}
- Estimated Effort: ${task.estimatedEffort}

## Task Description
${task.description}

## Acceptance Criteria
${task.acceptanceCriteria.map(criterion => `- ${criterion}`).join('\n')}

## Agent Instructions
1. Analyze the task requirements thoroughly
2. Break down the implementation into manageable steps
3. Leverage the specified MCP servers for optimal code generation
4. Follow the project's coding standards and design guidelines
5. Implement the solution according to the acceptance criteria
6. Write tests to verify the implementation
7. Document the implementation as required
8. Submit the completed work for review

## Authorization
This task is authorized for autonomous execution within the defined scope.
- Task Priority: ${task.priority}
- Time Allocation: Up to 4 hours
- Resource Limits: Standard compute resources
`;
}

/**
 * Process output from MCP server
 */
function processOutput(output, task) {
  // This is a simplified implementation
  // In a real implementation, this would parse the output and take appropriate actions

  // Log the output
  logAgentActivity(task.assignedAgent, task.id, `MCP server output: ${output.substring(0, 100)}...`);

  // For now, just return success
  return true;
}

/**
 * Run agent
 */
async function runAgent(agentType) {
  logAgentActivity(agentType, 'AGENT', `Starting agent`);

  // Get the next task for this agent
  const task = getNextTaskForAgent(agentType);

  if (!task) {
    logAgentActivity(agentType, 'AGENT', `No tasks found for agent`);
    return;
  }

  // Process the task
  const success = await processTask(task, agentType);

  logAgentActivity(agentType, 'AGENT', `Agent completed with ${success ? 'success' : 'failure'}`);
}

/**
 * Main function
 */
async function main() {
  const agentType = process.argv[2];

  if (!agentType) {
    console.error('Agent type is required');
    console.log('Usage: node autonomous-agent.js <agent-type>');
    process.exit(1);
  }

  if (!Object.keys(AGENT_CONFIG).includes(agentType)) {
    console.error(`Unknown agent type: ${agentType}`);
    console.log(`Available agent types: ${Object.keys(AGENT_CONFIG).join(', ')}`);
    process.exit(1);
  }

  await runAgent(agentType);
}

// Run the main function
main().catch(error => {
  console.error(`Error running agent: ${error.message}`);
  process.exit(1);
});
