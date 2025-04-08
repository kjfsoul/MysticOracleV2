#!/usr/bin/env node

/**
 * Task Chunking Agent
 * 
 * This agent specializes in breaking down large tasks into manageable chunks,
 * making logical decisions about how to proceed, and executing the chunks
 * until the task is completed or the user is prompted to continue.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Configuration paths
const CONFIG_PATH = path.join(projectRoot, 'cline_docs/task-chunking');
const LOG_PATH = path.join(CONFIG_PATH, 'logs');
const TASKS_PATH = path.join(CONFIG_PATH, 'tasks');

// Ensure directories exist
[CONFIG_PATH, LOG_PATH, TASKS_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Default configuration
let config = {
  enabled: true,
  maxChunkSize: 'medium', // small, medium, large
  autoExecute: true,
  promptThreshold: 5, // Number of chunks before prompting user
  logging: {
    level: 'info', // debug, info, warn, error
    retention: 30 // days
  }
};

// Load configuration
const configPath = path.join(CONFIG_PATH, 'config.json');
if (fs.existsSync(configPath)) {
  try {
    const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config = { ...config, ...loadedConfig };
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
} else {
  // Create default config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Created default configuration at ${configPath}`);
}

// Initialize logging
const timestamp = new Date().toISOString().replace(/:/g, '-');
const logFile = path.join(LOG_PATH, `chunking-${timestamp}.log`);
const logger = fs.createWriteStream(logFile, { flags: 'a' });

function log(level, message) {
  const levels = ['debug', 'info', 'warn', 'error'];
  const configLevel = config.logging.level || 'info';
  
  if (levels.indexOf(level) >= levels.indexOf(configLevel)) {
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
    console.log(logMessage);
    logger.write(logMessage + '\n');
  }
}

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

/**
 * Task Chunking Agent Class
 */
class TaskChunkingAgent {
  constructor() {
    this.taskId = `task-${timestamp}`;
    this.chunks = [];
    this.completedChunks = [];
    this.currentChunkIndex = 0;
    this.status = 'initialized';
    this.startTime = new Date();
    this.endTime = null;
    
    log('info', `Task Chunking Agent initialized with ID: ${this.taskId}`);
  }
  
  /**
   * Analyze a task and break it down into chunks
   * @param {string} taskDescription - Description of the task
   * @param {Object} options - Additional options for analysis
   * @returns {Array} - Array of task chunks
   */
  async analyzeTask(taskDescription, options = {}) {
    log('info', `Analyzing task: ${taskDescription.substring(0, 100)}...`);
    
    this.taskDescription = taskDescription;
    this.options = { ...options };
    this.status = 'analyzing';
    
    // Determine complexity and size
    const complexity = this.determineComplexity(taskDescription);
    log('debug', `Task complexity: ${complexity}`);
    
    // Break down the task based on complexity and config
    this.chunks = this.breakDownTask(taskDescription, complexity);
    log('info', `Task broken down into ${this.chunks.length} chunks`);
    
    // Save task state
    this.saveTaskState();
    
    this.status = 'ready';
    return this.chunks;
  }
  
  /**
   * Determine the complexity of a task
   * @param {string} taskDescription - Description of the task
   * @returns {string} - Complexity level (low, medium, high)
   */
  determineComplexity(taskDescription) {
    // Simple heuristic based on task description length and complexity indicators
    const length = taskDescription.length;
    const complexityIndicators = [
      'complex', 'difficult', 'challenging', 'intricate',
      'multiple', 'several', 'many', 'various',
      'integrate', 'coordinate', 'synchronize',
      'database', 'authentication', 'authorization',
      'optimize', 'performance', 'scale',
      'refactor', 'redesign', 'restructure'
    ];
    
    let complexityScore = 0;
    
    // Score based on length
    if (length < 500) complexityScore += 1;
    else if (length < 2000) complexityScore += 2;
    else complexityScore += 3;
    
    // Score based on complexity indicators
    complexityIndicators.forEach(indicator => {
      if (taskDescription.toLowerCase().includes(indicator)) {
        complexityScore += 1;
      }
    });
    
    // Determine complexity level
    if (complexityScore < 5) return 'low';
    if (complexityScore < 10) return 'medium';
    return 'high';
  }
  
  /**
   * Break down a task into manageable chunks
   * @param {string} taskDescription - Description of the task
   * @param {string} complexity - Complexity level (low, medium, high)
   * @returns {Array} - Array of task chunks
   */
  breakDownTask(taskDescription, complexity) {
    // Determine chunk size based on configuration
    const chunkSizeMap = {
      small: { low: 3, medium: 5, high: 7 },
      medium: { low: 2, medium: 3, high: 5 },
      large: { low: 1, medium: 2, high: 3 }
    };
    
    const configSize = config.maxChunkSize || 'medium';
    const numChunks = chunkSizeMap[configSize][complexity];
    
    // Identify natural break points in the task
    const chunks = this.identifyChunks(taskDescription, numChunks);
    
    return chunks.map((chunk, index) => ({
      id: `${this.taskId}-chunk-${index + 1}`,
      description: chunk,
      status: 'pending',
      order: index + 1,
      dependencies: this.identifyDependencies(index, chunks),
      estimatedComplexity: this.estimateChunkComplexity(chunk),
      startTime: null,
      endTime: null
    }));
  }
  
  /**
   * Identify natural chunks in a task description
   * @param {string} taskDescription - Description of the task
   * @param {number} targetNumChunks - Target number of chunks
   * @returns {Array} - Array of chunk descriptions
   */
  identifyChunks(taskDescription, targetNumChunks) {
    // Look for natural break points like numbered lists, paragraphs, etc.
    const paragraphs = taskDescription.split(/\n\s*\n/);
    
    // If we have enough paragraphs, use them as chunks
    if (paragraphs.length >= targetNumChunks) {
      // Combine paragraphs if we have too many
      if (paragraphs.length > targetNumChunks * 2) {
        const combinedChunks = [];
        const chunkSize = Math.ceil(paragraphs.length / targetNumChunks);
        
        for (let i = 0; i < paragraphs.length; i += chunkSize) {
          combinedChunks.push(paragraphs.slice(i, i + chunkSize).join('\n\n'));
        }
        
        return combinedChunks;
      }
      
      return paragraphs;
    }
    
    // Look for numbered or bulleted lists
    const listItemRegex = /^\s*(\d+\.|\*|\-)\s+/gm;
    const listItems = [];
    let match;
    let lastIndex = 0;
    
    while ((match = listItemRegex.exec(taskDescription)) !== null) {
      if (match.index > lastIndex) {
        listItems.push(taskDescription.substring(lastIndex, match.index));
      }
      
      // Find the end of this list item (next list item or end of string)
      const nextMatch = listItemRegex.exec(taskDescription);
      const endIndex = nextMatch ? nextMatch.index : taskDescription.length;
      
      listItems.push(taskDescription.substring(match.index, endIndex));
      lastIndex = endIndex;
      
      // Reset regex to continue from the current position
      listItemRegex.lastIndex = lastIndex;
    }
    
    // Add any remaining text
    if (lastIndex < taskDescription.length) {
      listItems.push(taskDescription.substring(lastIndex));
    }
    
    // If we have enough list items, use them as chunks
    if (listItems.length >= targetNumChunks) {
      // Combine list items if we have too many
      if (listItems.length > targetNumChunks * 2) {
        const combinedChunks = [];
        const chunkSize = Math.ceil(listItems.length / targetNumChunks);
        
        for (let i = 0; i < listItems.length; i += chunkSize) {
          combinedChunks.push(listItems.slice(i, i + chunkSize).join('\n'));
        }
        
        return combinedChunks;
      }
      
      return listItems;
    }
    
    // If we can't find natural break points, split the task evenly
    const chunks = [];
    const chunkSize = Math.ceil(taskDescription.length / targetNumChunks);
    
    // Try to split at sentence boundaries
    const sentences = taskDescription.match(/[^.!?]+[.!?]+/g) || [taskDescription];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }
  
  /**
   * Identify dependencies between chunks
   * @param {number} chunkIndex - Index of the current chunk
   * @param {Array} chunks - Array of chunk descriptions
   * @returns {Array} - Array of dependency chunk IDs
   */
  identifyDependencies(chunkIndex, chunks) {
    // Simple implementation: each chunk depends on the previous chunk
    if (chunkIndex === 0) return [];
    return [`${this.taskId}-chunk-${chunkIndex}`];
  }
  
  /**
   * Estimate the complexity of a chunk
   * @param {string} chunkDescription - Description of the chunk
   * @returns {string} - Complexity level (low, medium, high)
   */
  estimateChunkComplexity(chunkDescription) {
    return this.determineComplexity(chunkDescription);
  }
  
  /**
   * Execute the task chunks
   * @param {boolean} autoExecute - Whether to automatically execute all chunks
   * @returns {Object} - Task execution results
   */
  async executeTask(autoExecute = config.autoExecute) {
    if (this.status !== 'ready' && this.status !== 'in_progress') {
      log('error', `Cannot execute task in status: ${this.status}`);
      return { success: false, error: `Invalid task status: ${this.status}` };
    }
    
    this.status = 'in_progress';
    log('info', `Executing task with ${this.chunks.length} chunks`);
    
    let continueExecution = true;
    let promptCount = 0;
    
    while (this.currentChunkIndex < this.chunks.length && continueExecution) {
      const chunk = this.chunks[this.currentChunkIndex];
      
      // Check if we should prompt the user
      if (!autoExecute || promptCount >= config.promptThreshold) {
        const response = await this.promptUser(chunk);
        continueExecution = response.continue;
        
        if (response.skip) {
          log('info', `Skipping chunk: ${chunk.id}`);
          chunk.status = 'skipped';
          this.currentChunkIndex++;
          this.saveTaskState();
          continue;
        }
        
        if (!continueExecution) {
          log('info', 'User chose to pause execution');
          break;
        }
        
        promptCount = 0;
      }
      
      // Execute the chunk
      log('info', `Executing chunk: ${chunk.id}`);
      chunk.status = 'in_progress';
      chunk.startTime = new Date();
      this.saveTaskState();
      
      try {
        const result = await this.executeChunk(chunk);
        chunk.status = result.success ? 'completed' : 'failed';
        chunk.result = result;
        chunk.endTime = new Date();
        
        if (result.success) {
          this.completedChunks.push(chunk);
          log('info', `Chunk completed: ${chunk.id}`);
        } else {
          log('error', `Chunk failed: ${chunk.id} - ${result.error}`);
          
          // Prompt user on failure
          const response = await this.promptUser(chunk, true);
          continueExecution = response.continue;
          
          if (response.retry) {
            log('info', `Retrying chunk: ${chunk.id}`);
            chunk.status = 'pending';
            chunk.startTime = null;
            chunk.endTime = null;
            this.saveTaskState();
            continue;
          }
        }
      } catch (error) {
        chunk.status = 'failed';
        chunk.error = error.message;
        chunk.endTime = new Date();
        log('error', `Error executing chunk: ${chunk.id} - ${error.message}`);
        
        // Prompt user on error
        const response = await this.promptUser(chunk, true);
        continueExecution = response.continue;
        
        if (response.retry) {
          log('info', `Retrying chunk: ${chunk.id}`);
          chunk.status = 'pending';
          chunk.startTime = null;
          chunk.endTime = null;
          this.saveTaskState();
          continue;
        }
      }
      
      this.currentChunkIndex++;
      promptCount++;
      this.saveTaskState();
    }
    
    // Check if all chunks are completed
    const allCompleted = this.chunks.every(chunk => 
      chunk.status === 'completed' || chunk.status === 'skipped'
    );
    
    if (allCompleted) {
      this.status = 'completed';
      this.endTime = new Date();
      log('info', 'Task completed successfully');
    } else if (this.currentChunkIndex >= this.chunks.length) {
      this.status = 'completed_with_errors';
      this.endTime = new Date();
      log('warn', 'Task completed with errors');
    } else {
      this.status = 'paused';
      log('info', 'Task execution paused');
    }
    
    this.saveTaskState();
    
    return {
      success: this.status === 'completed',
      status: this.status,
      completedChunks: this.completedChunks.length,
      totalChunks: this.chunks.length,
      taskId: this.taskId
    };
  }
  
  /**
   * Execute a single chunk
   * @param {Object} chunk - Chunk to execute
   * @returns {Object} - Execution result
   */
  async executeChunk(chunk) {
    // This is a placeholder implementation
    // In a real implementation, this would execute the chunk based on its type
    log('debug', `Executing chunk: ${JSON.stringify(chunk)}`);
    
    // Simulate chunk execution
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% success rate for demonstration
        const success = Math.random() < 0.9;
        
        if (success) {
          resolve({
            success: true,
            message: `Chunk ${chunk.id} executed successfully`,
            output: `Sample output for chunk ${chunk.id}`
          });
        } else {
          resolve({
            success: false,
            error: `Simulated failure for chunk ${chunk.id}`
          });
        }
      }, 1000); // Simulate execution time
    });
  }
  
  /**
   * Prompt the user for input
   * @param {Object} chunk - Current chunk
   * @param {boolean} isError - Whether this prompt is due to an error
   * @returns {Object} - User response
   */
  async promptUser(chunk, isError = false) {
    const chunkInfo = `Chunk ${chunk.order}/${this.chunks.length}: ${chunk.description.substring(0, 100)}...`;
    
    console.log('\n' + '-'.repeat(80));
    console.log(chunkInfo);
    console.log('-'.repeat(80));
    
    if (isError) {
      console.log(`\nError executing chunk: ${chunk.error || chunk.result?.error || 'Unknown error'}`);
      console.log('\nOptions:');
      console.log('  1. Retry this chunk');
      console.log('  2. Skip this chunk and continue');
      console.log('  3. Pause execution');
      
      const answer = await askQuestion('\nEnter your choice (1-3): ');
      
      switch (answer) {
        case '1':
          return { continue: true, retry: true, skip: false };
        case '2':
          return { continue: true, retry: false, skip: true };
        case '3':
        default:
          return { continue: false, retry: false, skip: false };
      }
    } else {
      console.log('\nOptions:');
      console.log('  1. Execute this chunk and continue');
      console.log('  2. Skip this chunk and continue');
      console.log('  3. Pause execution');
      
      const answer = await askQuestion('\nEnter your choice (1-3): ');
      
      switch (answer) {
        case '1':
          return { continue: true, skip: false };
        case '2':
          return { continue: true, skip: true };
        case '3':
        default:
          return { continue: false, skip: false };
      }
    }
  }
  
  /**
   * Save the current task state
   */
  saveTaskState() {
    const taskState = {
      taskId: this.taskId,
      taskDescription: this.taskDescription,
      chunks: this.chunks,
      completedChunks: this.completedChunks,
      currentChunkIndex: this.currentChunkIndex,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      options: this.options
    };
    
    const taskFilePath = path.join(TASKS_PATH, `${this.taskId}.json`);
    fs.writeFileSync(taskFilePath, JSON.stringify(taskState, null, 2));
  }
  
  /**
   * Load a task from a saved state
   * @param {string} taskId - ID of the task to load
   * @returns {TaskChunkingAgent} - Loaded task agent
   */
  static loadTask(taskId) {
    const taskFilePath = path.join(TASKS_PATH, `${taskId}.json`);
    
    if (!fs.existsSync(taskFilePath)) {
      throw new Error(`Task not found: ${taskId}`);
    }
    
    const taskState = JSON.parse(fs.readFileSync(taskFilePath, 'utf8'));
    const agent = new TaskChunkingAgent();
    
    // Restore task state
    agent.taskId = taskState.taskId;
    agent.taskDescription = taskState.taskDescription;
    agent.chunks = taskState.chunks;
    agent.completedChunks = taskState.completedChunks;
    agent.currentChunkIndex = taskState.currentChunkIndex;
    agent.status = taskState.status;
    agent.startTime = new Date(taskState.startTime);
    agent.endTime = taskState.endTime ? new Date(taskState.endTime) : null;
    agent.options = taskState.options;
    
    log('info', `Loaded task: ${taskId}`);
    return agent;
  }
  
  /**
   * List all saved tasks
   * @returns {Array} - Array of task summaries
   */
  static listTasks() {
    const taskFiles = fs.readdirSync(TASKS_PATH).filter(file => file.endsWith('.json'));
    
    return taskFiles.map(file => {
      const taskState = JSON.parse(fs.readFileSync(path.join(TASKS_PATH, file), 'utf8'));
      
      return {
        taskId: taskState.taskId,
        status: taskState.status,
        completedChunks: taskState.completedChunks.length,
        totalChunks: taskState.chunks.length,
        startTime: taskState.startTime,
        endTime: taskState.endTime
      };
    });
  }
}

// Export the TaskChunkingAgent class
export default TaskChunkingAgent;
