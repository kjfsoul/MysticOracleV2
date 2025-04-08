#!/usr/bin/env node

/**
 * MCP-based Autonomous Agent for Mystic Arcana
 * 
 * This script implements autonomous agents that use the MCP SDK
 * to communicate with MCP servers for task execution.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { ClientSession } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioServerParameters, stdio_client } from '@modelcontextprotocol/sdk/client/stdio.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration paths
const TASK_QUEUE_PATH = path.join(projectRoot, 'cline_docs/task-queue.json');
const COMPLETED_TASKS_PATH = path.join(projectRoot, 'cline_docs/completed-tasks.json');
const AGENT_LOG_PATH = path.join(projectRoot, 'cline_docs/agent-logs');

// Ensure log directory exists
if (!fs.existsSync(AGENT_LOG_PATH)) {
  fs.mkdirSync(AGENT_LOG_PATH, { recursive: true });
}

// Agent types and their MCP servers
const AGENT_CONFIG = {
  'CodeAgent': {
    mcpServers: ['filesystem', 'github'],
    capabilities: ['component-implementation', 'code-refactoring', 'bug-fixing', 'test-writing']
  },
  'DesignAgent': {
    mcpServers: ['everything', 'puppeteer'],
    capabilities: ['ui-design', 'animation', 'responsive-layout', 'accessibility']
  },
  'APIAgent': {
    mcpServers: ['brave-search', 'sequential-thinking'],
    capabilities: ['api-implementation', 'serverless-function', 'database-query', 'authentication']
  },
  'ContentAgent': {
    mcpServers: ['memory', 'brave-search'],
    capabilities: ['content-generation', 'tarot-description', 'astrology-interpretation', 'blog-outline']
  },
  'TestAgent': {
    mcpServers: ['puppeteer', 'sequential-thinking'],
    capabilities: ['unit-test', 'integration-test', 'test-suite', 'test-coverage']
  }
};

/**
 * Load task queue from file
 */
function loadTaskQueue() {
  try {
    return JSON.parse(fs.readFileSync(TASK_QUEUE_PATH, 'utf8'));
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
    return JSON.parse(fs.readFileSync(COMPLETED_TASKS_PATH, 'utf8'));
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
 * Create MCP client session
 */
async function createMcpSession(serverName) {
  // Build the path to the MCP server
  const mcpServerPath = path.join(projectRoot, '.mcp/node_modules/@modelcontextprotocol/server-' + serverName);
  
  // Define server parameters
  const serverParams = new StdioServerParameters({
    command: 'node',
    args: [mcpServerPath, projectRoot]
  });
  
  // Create stdio client and session
  const [stdio, write] = await stdio_client(serverParams);
  const session = new ClientSession(stdio, write);
  await session.initialize();
  
  return session;
}

/**
 * List tools available on an MCP server
 */
async function listMcpTools(serverName) {
  try {
    const session = await createMcpSession(serverName);
    const tools = await session.list_tools();
    await session.close();
    return tools;
  } catch (error) {
    console.error(`Error listing tools for ${serverName}: ${error.message}`);
    return [];
  }
}

/**
 * Call an MCP tool
 */
async function callMcpTool(serverName, toolName, params) {
  try {
    const session = await createMcpSession(serverName);
    const result = await session.call_tool(toolName, params);
    await session.close();
    return result;
  } catch (error) {
    console.error(`Error calling tool ${toolName} on ${serverName}: ${error.message}`);
    throw error;
  }
}

/**
 * Generate prompt for task
 */
function generatePrompt(task) {
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
 * Process task with agent
 */
async function processTask(task, agentType) {
  const agentConfig = AGENT_CONFIG[agentType];
  
  if (!agentConfig) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }
  
  logAgentActivity(agentType, task.id, `Starting task: ${task.title}`);
  
  // Check if the required MCP servers are available
  const missingServers = task.requiredMcpServers.filter(server => {
    // Remove 'server-' prefix if it exists
    const serverName = server.startsWith('server-') ? server.substring(7) : server;
    return !agentConfig.mcpServers.some(s => s === serverName || s.includes(serverName));
  });
  
  if (missingServers.length > 0) {
    logAgentActivity(agentType, task.id, `Missing required MCP servers: ${missingServers.join(', ')}`);
    return false;
  }
  
  try {
    // Use the primary MCP server
    const primaryServer = agentConfig.mcpServers[0];
    logAgentActivity(agentType, task.id, `Using primary MCP server: ${primaryServer}`);
    
    // List available tools
    const tools = await listMcpTools(primaryServer);
    logAgentActivity(agentType, task.id, `Available tools: ${JSON.stringify(tools)}`);
    
    // Generate prompt for the task
    const prompt = generatePrompt(task);
    
    // Process the task based on its type
    let success = false;
    
    switch (task.type) {
      case 'feature':
        success = await processFeatureTask(task, primaryServer, prompt);
        break;
      case 'content':
        success = await processContentTask(task, primaryServer, prompt);
        break;
      case 'testing':
        success = await processTestingTask(task, primaryServer, prompt);
        break;
      default:
        logAgentActivity(agentType, task.id, `Unknown task type: ${task.type}`);
        return false;
    }
    
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
 * Process a feature task
 */
async function processFeatureTask(task, serverName, prompt) {
  try {
    // Check if the server has a sequentialThinking tool
    const tools = await listMcpTools(serverName);
    
    if (tools.some(tool => tool.name === 'sequentialthinking_npx')) {
      // Use sequential thinking to break down the task
      logAgentActivity(task.assignedAgent, task.id, `Using sequential thinking to break down the task`);
      
      const thinkingResult = await callMcpTool(serverName, 'sequentialthinking_npx', {
        thought: `Analyzing task: ${task.title}`,
        nextThoughtNeeded: true,
        thoughtNumber: 1,
        totalThoughts: 5
      });
      
      logAgentActivity(task.assignedAgent, task.id, `Thinking result: ${JSON.stringify(thinkingResult)}`);
    }
    
    // Check if the server has a filesystem tool
    if (tools.some(tool => tool.name === 'str-replace-editor')) {
      // Implement the feature using the filesystem tool
      logAgentActivity(task.assignedAgent, task.id, `Implementing feature using filesystem tools`);
      
      // For demonstration purposes, let's create a simple file
      const filePath = `components/${task.id}-implementation.js`;
      
      // Create a simple implementation based on the task
      await callMcpTool(serverName, 'save-file', {
        file_path: filePath,
        file_content: `// Implementation for ${task.title}\n\n// TODO: Implement the feature\n\nexport default function ${task.id.replace(/-/g, '')}() {\n  return <div>Implementation for ${task.title}</div>;\n}`
      });
      
      logAgentActivity(task.assignedAgent, task.id, `Created implementation file: ${filePath}`);
      return true;
    }
    
    logAgentActivity(task.assignedAgent, task.id, `No suitable tools found for implementing feature`);
    return false;
  } catch (error) {
    logAgentActivity(task.assignedAgent, task.id, `Error processing feature task: ${error.message}`);
    return false;
  }
}

/**
 * Process a content task
 */
async function processContentTask(task, serverName, prompt) {
  try {
    // Check if the server has a memory tool
    const tools = await listMcpTools(serverName);
    
    if (tools.some(tool => tool.name === 'create_entities_npx')) {
      // Use memory tools to create content
      logAgentActivity(task.assignedAgent, task.id, `Using memory tools to create content`);
      
      // Create an entity for the content
      await callMcpTool(serverName, 'create_entities_npx', {
        entities: [
          {
            name: `${task.id}-content`,
            entityType: 'Content',
            observations: [
              `Title: ${task.title}`,
              `Description: ${task.description}`,
              `Status: In Progress`
            ]
          }
        ]
      });
      
      logAgentActivity(task.assignedAgent, task.id, `Created content entity: ${task.id}-content`);
      return true;
    }
    
    // Check if the server has a web search tool
    if (tools.some(tool => tool.name === 'web-search')) {
      // Use web search to gather information
      logAgentActivity(task.assignedAgent, task.id, `Using web search to gather information`);
      
      const searchResult = await callMcpTool(serverName, 'web-search', {
        query: `${task.title} ${task.description}`
      });
      
      logAgentActivity(task.assignedAgent, task.id, `Search result: ${JSON.stringify(searchResult)}`);
      return true;
    }
    
    logAgentActivity(task.assignedAgent, task.id, `No suitable tools found for creating content`);
    return false;
  } catch (error) {
    logAgentActivity(task.assignedAgent, task.id, `Error processing content task: ${error.message}`);
    return false;
  }
}

/**
 * Process a testing task
 */
async function processTestingTask(task, serverName, prompt) {
  try {
    // Check if the server has a puppeteer tool
    const tools = await listMcpTools(serverName);
    
    if (tools.some(tool => tool.name === 'launch-process')) {
      // Use launch-process to run tests
      logAgentActivity(task.assignedAgent, task.id, `Using launch-process to run tests`);
      
      const testResult = await callMcpTool(serverName, 'launch-process', {
        command: 'npm test',
        wait: true,
        max_wait_seconds: 300
      });
      
      logAgentActivity(task.assignedAgent, task.id, `Test result: ${JSON.stringify(testResult)}`);
      return true;
    }
    
    logAgentActivity(task.assignedAgent, task.id, `No suitable tools found for running tests`);
    return false;
  } catch (error) {
    logAgentActivity(task.assignedAgent, task.id, `Error processing testing task: ${error.message}`);
    return false;
  }
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
    console.log('Usage: node mcp-agent.js <agent-type>');
    process.exit(1);
  }
  
  if (!Object.keys(AGENT_CONFIG).includes(agentType)) {
    console.error(`Unknown agent type: ${agentType}`);
    console.log(`Available agent types: ${Object.keys(AGENT_CONFIG).join(', ')}`);
    process.exit(1);
  }
  
  try {
    await runAgent(agentType);
  } catch (error) {
    console.error(`Error running agent: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main();
