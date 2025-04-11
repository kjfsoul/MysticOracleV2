/**
 * Agent Runner
 *
 * This script runs autonomous agents based on the configuration in agents.json.
 * It handles task scheduling, execution, and reporting.
 */

import { spawn } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

// Load agent configuration
const agentConfigPath = path.join(rootDir, '.mcp', 'agents.json');
let agentConfig;

try {
  agentConfig = JSON.parse(fs.readFileSync(agentConfigPath, 'utf8'));
} catch (error) {
  console.error(`Error loading agent configuration: ${error.message}`);
  process.exit(1);
}

// Set up logging
const logDir = path.join(rootDir, '.mcp', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, `agent-runner-${new Date().toISOString().split('T')[0]}.log`);
const stdoutLog = path.join(logDir, 'agent-stdout.log');
const stderrLog = path.join(logDir, 'agent-stderr.log');

// ANSI color codes for terminal output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Logger
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  let coloredMessage = message;

  switch (level) {
    case 'error':
      coloredMessage = `${COLORS.red}${message}${COLORS.reset}`;
      break;
    case 'warning':
      coloredMessage = `${COLORS.yellow}${message}${COLORS.reset}`;
      break;
    case 'success':
      coloredMessage = `${COLORS.green}${message}${COLORS.reset}`;
      break;
    case 'info':
    default:
      coloredMessage = message;
      break;
  }

  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  console.log(coloredMessage);
  fs.appendFileSync(logFile, logMessage);
}

// Task queue for managing concurrent tasks
class TaskQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
    
    // Add memory monitoring
    this.memoryMonitor = setInterval(() => {
      const memUsage = process.memoryUsage();
      if (memUsage.heapUsed / memUsage.heapTotal > 0.7) {
        console.warn('High memory usage detected. Pausing new tasks.');
        this.pauseProcessing();
      }
    }, 30000);
  }

  pauseProcessing() {
    this.paused = true;
    // Wait for current tasks to complete
    if (this.running === 0) {
      global.gc && global.gc(); // Force garbage collection if available
    }
  }

  resumeProcessing() {
    this.paused = false;
    this.next();
  }

  add(task) {
    return new Promise((resolve, reject) => {
      if (this.paused) {
        reject(new Error("Task queue is paused due to high memory usage"));
        return;
      }
      this.queue.push({
        task,
        resolve,
        reject
      });
      this.next();
    });
  }

  next() {
    if (
      this.paused ||
      this.running >= this.maxConcurrent ||
      this.queue.length === 0
    ) {
      return;
    }

    const { task, resolve, reject } = this.queue.shift();
    this.running++;

    Promise.resolve(task())
      .then(result => {
        this.running--;
        resolve(result);
        this.next();
      })
      .catch(error => {
        this.running--;
        reject(error);
        this.next();
      });
  }
}

// Create task queue
const taskQueue = new TaskQueue(3);

// Execute task
async function executeTask(agentName, taskName) {
  log(`Executing task: ${agentName}/${taskName}`);

  try {
    // Find the task in the agent configuration
    const agent = agentConfig.agents[agentName];
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    const task = agent.tasks.find(t => t.name === taskName);
    if (!task) {
      throw new Error(`Task not found: ${agentName}/${taskName}`);
    }

    // Update task status in project status file
    updateTaskStatus(agentName, taskName, 'running');

    // Execute the task based on action type
    let result;

    if (task.action) {
      switch (task.action.type) {
        case 'script':
          result = await executeScriptAction(task.action);
          break;
        case 'command':
          result = await executeCommandAction(task.action);
          break;
        case 'http':
          result = await executeHttpAction(task.action);
          break;
        case 'function':
          result = await executeFunctionAction(task.action);
          break;
        default:
          throw new Error(`Unknown action type: ${task.action.type}`);
      }
    } else {
      // Default action if none specified
      result = { success: true, message: 'Task executed (no action specified)' };
    }

    // Update task status in project status file
    updateTaskStatus(agentName, taskName, result.success ? 'completed' : 'failed', result);

    log(`Task ${agentName}/${taskName} executed successfully: ${result.message || 'No message'}`, 'success');

    return result;
  } catch (error) {
    log(`Error executing task ${agentName}/${taskName}: ${error.message}`, 'error');

    // Update task status in project status file
    updateTaskStatus(agentName, taskName, 'failed', { error: error.message });

    return { success: false, error: error.message };
  }
}

// Execute script action
async function executeScriptAction(action) {
  return new Promise((resolve, reject) => {
    try {
      const scriptPath = path.join(rootDir, action.path);

      if (!fs.existsSync(scriptPath)) {
        reject(new Error(`Script not found: ${scriptPath}`));
        return;
      }

      const args = action.args || [];

      const child = spawn('node', [scriptPath, ...args], {
        cwd: rootDir,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        fs.appendFileSync(stdoutLog, output);
      });

      child.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        fs.appendFileSync(stderrLog, output);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, message: 'Script executed successfully', stdout, stderr });
        } else {
          reject(new Error(`Script exited with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Execute command action
async function executeCommandAction(action) {
  return new Promise((resolve, reject) => {
    try {
      const command = action.command;
      const cwd = action.cwd ? path.join(rootDir, action.cwd) : rootDir;

      const child = spawn('sh', ['-c', command], {
        cwd,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        fs.appendFileSync(stdoutLog, output);
      });

      child.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        fs.appendFileSync(stderrLog, output);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, message: 'Command executed successfully', stdout, stderr });
        } else {
          reject(new Error(`Command exited with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Execute HTTP action
async function executeHttpAction(action) {
  try {
    const { url, method = 'GET', headers = {}, body } = action;

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP request failed with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    return { success: true, message: 'HTTP request executed successfully', data };
  } catch (error) {
    throw error;
  }
}

// Execute function action
async function executeFunctionAction(action) {
  try {
    const { function: functionName, args = [] } = action;

    // Check if the function exists in the global scope
    if (typeof global[functionName] !== 'function') {
      throw new Error(`Function not found: ${functionName}`);
    }

    // Execute the function
    const result = await global[functionName](...args);

    return { success: true, message: 'Function executed successfully', result };
  } catch (error) {
    throw error;
  }
}

// Update task status in project status file
function updateTaskStatus(agentName, taskName, status, result = null) {
  try {
    const projectStatusPath = path.join(rootDir, '.mcp', 'project-status.json');

    let projectStatus = {};

    if (fs.existsSync(projectStatusPath)) {
      projectStatus = JSON.parse(fs.readFileSync(projectStatusPath, 'utf8'));
    } else {
      // Create basic project status
      projectStatus = {
        projectName: agentConfig.projectName || path.basename(rootDir),
        lastUpdated: new Date().toISOString(),
        currentPhase: 'Development',
        activeTasks: [],
        completedTasks: [],
        nextMilestone: 'Initial Deployment',
        progress: {
          overall: '0%'
        }
      };
    }

    // Ensure arrays exist
    projectStatus.activeTasks = projectStatus.activeTasks || [];
    projectStatus.completedTasks = projectStatus.completedTasks || [];

    // Find the task in the active tasks
    const activeTaskIndex = projectStatus.activeTasks.findIndex(
      task => task.name === taskName && task.assignedTo === agentName
    );

    if (status === 'running') {
      if (activeTaskIndex !== -1) {
        // Update existing task
        projectStatus.activeTasks[activeTaskIndex].status = 'in-progress';
        projectStatus.activeTasks[activeTaskIndex].updatedAt = new Date().toISOString();
      } else {
        // Create new task
        projectStatus.activeTasks.push({
          id: `TASK-${Math.floor(Math.random() * 10000)}`,
          name: taskName,
          assignedTo: agentName,
          status: 'in-progress',
          progress: 0,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } else if (status === 'completed') {
      if (activeTaskIndex !== -1) {
        // Move task to completed tasks
        const task = projectStatus.activeTasks[activeTaskIndex];
        task.status = 'completed';
        task.progress = 100;
        task.completedAt = new Date().toISOString();
        task.updatedAt = new Date().toISOString();
        task.result = result;

        projectStatus.completedTasks.push(task);
        projectStatus.activeTasks.splice(activeTaskIndex, 1);
      } else {
        // Create new completed task
        projectStatus.completedTasks.push({
          id: `TASK-${Math.floor(Math.random() * 10000)}`,
          name: taskName,
          assignedTo: agentName,
          status: 'completed',
          progress: 100,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          result
        });
      }
    } else if (status === 'failed') {
      if (activeTaskIndex !== -1) {
        // Update task status
        projectStatus.activeTasks[activeTaskIndex].status = 'failed';
        projectStatus.activeTasks[activeTaskIndex].error = result?.error;
        projectStatus.activeTasks[activeTaskIndex].updatedAt = new Date().toISOString();
      } else {
        // Create new failed task
        projectStatus.activeTasks.push({
          id: `TASK-${Math.floor(Math.random() * 10000)}`,
          name: taskName,
          assignedTo: agentName,
          status: 'failed',
          progress: 0,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          error: result?.error
        });
      }
    }

    // Update last updated timestamp
    projectStatus.lastUpdated = new Date().toISOString();

    // Save project status
    fs.writeFileSync(projectStatusPath, JSON.stringify(projectStatus, null, 2));
  } catch (error) {
    log(`Error updating task status: ${error.message}`, 'error');
  }
}

// Execute workflow
async function executeWorkflow(workflowName) {
  log(`Executing workflow: ${workflowName}`);

  try {
    // Find the workflow in the agent configuration
    const workflow = agentConfig.workflows[workflowName];
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    // Update workflow status in project status file
    updateWorkflowStatus(workflowName, 'running');

    // Execute workflow steps
    const results = [];

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      log(`Executing workflow step ${i + 1}: ${step.agent}/${step.task}`);

      // Check if step should be executed based on conditions
      if (step.condition) {
        const shouldExecute = evaluateStepCondition(step.condition, results);

        if (!shouldExecute) {
          log(`Skipping workflow step ${i + 1}: ${step.agent}/${step.task} (condition not met)`);
          results.push({ step: i, success: false, skipped: true });
          continue;
        }
      }

      try {
        // Execute step with timeout
        const timeout = step.timeout || workflow.timeout || 3600;
        const result = await Promise.race([
          executeTask(step.agent, step.task),
          new Promise((_, reject) => setTimeout(() => reject(new Error(`Step timed out after ${timeout} seconds`)), timeout * 1000))
        ]);

        results.push({ step: i, ...result });

        if (!result.success && step.required !== false) {
          log(`Workflow ${workflowName} failed at step ${i + 1}: ${step.agent}/${step.task}`, 'error');
          updateWorkflowStatus(workflowName, 'failed', { results });
          return { success: false, results };
        }
      } catch (error) {
        results.push({ step: i, success: false, error: error.message });

        if (step.required !== false) {
          log(`Workflow ${workflowName} failed at step ${i + 1}: ${step.agent}/${step.task} - ${error.message}`, 'error');
          updateWorkflowStatus(workflowName, 'failed', { results });
          return { success: false, results };
        }
      }
    }

    log(`Workflow ${workflowName} completed successfully`, 'success');
    updateWorkflowStatus(workflowName, 'completed', { results });
    return { success: true, results };
  } catch (error) {
    log(`Error executing workflow ${workflowName}: ${error.message}`, 'error');
    updateWorkflowStatus(workflowName, 'failed', { error: error.message });
    return { success: false, error: error.message };
  }
}

// Evaluate step condition
function evaluateStepCondition(condition, results) {
  try {
    switch (condition.type) {
      case 'success':
        return results[condition.step]?.success === true;
      case 'failure':
        return results[condition.step]?.success === false;
      case 'expression':
        // Create a context for the expression
        const context = {
          results,
          steps: results.map(r => ({ status: r.success ? 'success' : 'failure' }))
        };

        // Evaluate the expression
        return new Function('context', `with(context) { return ${condition.expression}; }`)(context);
      default:
        log(`Unknown condition type: ${condition.type}`, 'warning');
        return true;
    }
  } catch (error) {
    log(`Error evaluating condition: ${error.message}`, 'error');
    return false;
  }
}

// Update workflow status in project status file
function updateWorkflowStatus(workflowName, status, result = null) {
  try {
    const projectStatusPath = path.join(rootDir, '.mcp', 'project-status.json');

    let projectStatus = {};

    if (fs.existsSync(projectStatusPath)) {
      projectStatus = JSON.parse(fs.readFileSync(projectStatusPath, 'utf8'));
    } else {
      // Create basic project status
      projectStatus = {
        projectName: agentConfig.projectName || path.basename(rootDir),
        lastUpdated: new Date().toISOString(),
        currentPhase: 'Development',
        activeTasks: [],
        completedTasks: [],
        workflows: [],
        nextMilestone: 'Initial Deployment',
        progress: {
          overall: '0%'
        }
      };
    }

    // Ensure workflows array exists
    projectStatus.workflows = projectStatus.workflows || [];

    // Find the workflow
    const workflowIndex = projectStatus.workflows.findIndex(w => w.name === workflowName);

    if (status === 'running') {
      if (workflowIndex !== -1) {
        // Update existing workflow
        projectStatus.workflows[workflowIndex].status = 'running';
        projectStatus.workflows[workflowIndex].updatedAt = new Date().toISOString();
      } else {
        // Create new workflow
        projectStatus.workflows.push({
          name: workflowName,
          status: 'running',
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } else if (status === 'completed') {
      if (workflowIndex !== -1) {
        // Update workflow
        projectStatus.workflows[workflowIndex].status = 'completed';
        projectStatus.workflows[workflowIndex].completedAt = new Date().toISOString();
        projectStatus.workflows[workflowIndex].updatedAt = new Date().toISOString();
        projectStatus.workflows[workflowIndex].result = result;
      } else {
        // Create new completed workflow
        projectStatus.workflows.push({
          name: workflowName,
          status: 'completed',
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          result
        });
      }
    } else if (status === 'failed') {
      if (workflowIndex !== -1) {
        // Update workflow
        projectStatus.workflows[workflowIndex].status = 'failed';
        projectStatus.workflows[workflowIndex].updatedAt = new Date().toISOString();
        projectStatus.workflows[workflowIndex].result = result;
      } else {
        // Create new failed workflow
        projectStatus.workflows.push({
          name: workflowName,
          status: 'failed',
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          result
        });
      }
    }

    // Update last updated timestamp
    projectStatus.lastUpdated = new Date().toISOString();

    // Save project status
    fs.writeFileSync(projectStatusPath, JSON.stringify(projectStatus, null, 2));
  } catch (error) {
    log(`Error updating workflow status: ${error.message}`, 'error');
  }
}

// Check if away mode is active
function isAwayModeActive() {
  try {
    const awayModePath = path.join(rootDir, '.mcp', 'away-mode.json');

    if (fs.existsSync(awayModePath)) {
      const awayMode = JSON.parse(fs.readFileSync(awayModePath, 'utf8'));

      if (!awayMode.enabled) {
        return false;
      }

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const [startHour, startMinute] = awayMode.startTime.split(':').map(Number);
      const [endHour, endMinute] = awayMode.endTime.split(':').map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      // Check if current time is within away hours
      if (startTime < endTime) {
        // Normal time range (e.g., 9:00 to 17:00)
        return currentTime >= startTime && currentTime <= endTime;
      } else {
        // Overnight time range (e.g., 18:00 to 9:00)
        return currentTime >= startTime || currentTime <= endTime;
      }
    }

    return false;
  } catch (error) {
    log(`Error checking away mode: ${error.message}`, 'error');
    return false;
  }
}

// Schedule tasks
log('Starting agent runner...', 'info');

// Schedule agent tasks
Object.entries(agentConfig.agents).forEach(([agentName, agent]) => {
  if (agent.enabled !== false) {
    log(`Scheduling tasks for agent: ${agentName}`, 'info');

    agent.tasks.forEach(task => {
      if (task.enabled !== false && task.schedule) {
        log(`Scheduling task: ${agentName}/${task.name} (${task.schedule})`, 'info');

        cron.schedule(task.schedule, () => {
          // Check if away mode is active
          const awayMode = isAwayModeActive();

          // Check if task should run in away mode
          if (awayMode && task.runInAwayMode === false) {
            log(`Skipping task ${agentName}/${task.name} (away mode active)`, 'info');
            return;
          }

          // Add task to queue
          taskQueue.add(() => executeTask(agentName, task.name))
            .then(result => {
              if (result.success) {
                log(`Task ${agentName}/${task.name} completed successfully`, 'success');
              } else {
                log(`Task ${agentName}/${task.name} failed: ${result.error}`, 'error');
              }
            })
            .catch(error => {
              log(`Error executing task ${agentName}/${task.name}: ${error.message}`, 'error');
            });
        });
      }
    });
  }
});

// Schedule workflows
Object.entries(agentConfig.workflows || {}).forEach(([workflowName, workflow]) => {
  if (workflow.enabled !== false && workflow.schedule) {
    log(`Scheduling workflow: ${workflowName} (${workflow.schedule})`, 'info');

    cron.schedule(workflow.schedule, () => {
      // Check if away mode is active
      const awayMode = isAwayModeActive();

      // Check if workflow should run in away mode
      if (awayMode && workflow.runInAwayMode === false) {
        log(`Skipping workflow ${workflowName} (away mode active)`, 'info');
        return;
      }

      // Execute workflow
      executeWorkflow(workflowName)
        .then(result => {
          if (result.success) {
            log(`Workflow ${workflowName} completed successfully`, 'success');
          } else {
            log(`Workflow ${workflowName} failed: ${result.error}`, 'error');
          }
        })
        .catch(error => {
          log(`Error executing workflow ${workflowName}: ${error.message}`, 'error');
        });
    });
  }
});

// Schedule status report
const statusInterval = parseInt(process.env.AGENT_STATUS_INTERVAL || '30', 10);
log(`Scheduling status report every ${statusInterval} minutes`, 'info');

cron.schedule(`*/${statusInterval} * * * *`, () => {
  try {
    const statusReportPath = path.join(__dirname, 'status-report.js');

    if (fs.existsSync(statusReportPath)) {
      const child = spawn('node', [statusReportPath], {
        detached: true,
        stdio: 'ignore'
      });

      child.unref();
      log('Status report scheduled', 'info');
    } else {
      log(`Status report script not found: ${statusReportPath}`, 'warning');
    }
  } catch (error) {
    log(`Error scheduling status report: ${error.message}`, 'error');
  }
});

// Handle process signals
process.on('SIGINT', () => {
  log('Received SIGINT signal. Shutting down...', 'info');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM signal. Shutting down...', 'info');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`, 'error');
  log(error.stack, 'error');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled rejection at ${promise}: ${reason}`, 'error');
});

log('Agent runner started successfully', 'success');
