# Task Chunking Agent

The Task Chunking Agent is a specialized tool that helps break down large tasks into manageable chunks, making logical decisions about how to proceed, and executing the chunks until the task is completed or the user is prompted to continue.

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [How It Works](#how-it-works)
4. [Usage](#usage)
5. [Configuration](#configuration)
6. [Integration with Other Agents](#integration-with-other-agents)
7. [Examples](#examples)
8. [Advanced Usage](#advanced-usage)

## Overview

When faced with large, complex tasks, it's often difficult to know where to start or how to break them down into manageable pieces. The Task Chunking Agent solves this problem by:

1. Analyzing the task to determine its complexity
2. Breaking it down into logical, manageable chunks
3. Identifying dependencies between chunks
4. Executing chunks in the optimal order
5. Prompting the user when necessary for guidance

This approach ensures that even the most complex tasks can be tackled systematically and efficiently.

## Key Features

- **Intelligent Task Analysis**: Automatically determines task complexity and optimal chunking strategy
- **Adaptive Chunking**: Identifies natural break points in tasks for logical chunking
- **Dependency Management**: Recognizes and respects dependencies between chunks
- **Progressive Execution**: Executes chunks in sequence, with user guidance when needed
- **Error Handling**: Gracefully handles failures and provides retry options
- **Persistence**: Saves task state for resuming later
- **Configurable Behavior**: Customizable chunk sizes, auto-execution, and prompting thresholds

## How It Works

The Task Chunking Agent follows this process:

1. **Analysis Phase**:
   - Parses the task description
   - Identifies complexity indicators
   - Determines the optimal number of chunks
   - Looks for natural break points (paragraphs, lists, etc.)
   - Creates a structured task plan

2. **Execution Phase**:
   - Processes each chunk in sequence
   - Handles dependencies between chunks
   - Provides progress updates
   - Prompts the user at configurable intervals
   - Manages errors and retries

3. **Completion Phase**:
   - Summarizes the task execution
   - Reports on successful and failed chunks
   - Provides recommendations for follow-up actions

## Usage

### Command Line Interface

The Task Chunking Agent can be used via the command line:

```bash
# Analyze a new task
node scripts/task-chunker.js analyze

# Execute a previously analyzed task
node scripts/task-chunker.js execute <task-id>

# List all saved tasks
node scripts/task-chunker.js list

# Resume a paused task
node scripts/task-chunker.js resume <task-id>
```

### Programmatic Usage

You can also use the Task Chunking Agent programmatically in your code:

```javascript
import TaskChunkingAgent from './scripts/agents/task-chunking-agent.js';

// Create a new agent
const agent = new TaskChunkingAgent();

// Analyze a task
const chunks = await agent.analyzeTask('Your task description here', {
  chunkSize: 'medium',
  autoExecute: true
});

// Execute the task
const result = await agent.executeTask();

console.log(`Task execution completed: ${result.status}`);
console.log(`Completed ${result.completedChunks}/${result.totalChunks} chunks`);
```

## Configuration

The Task Chunking Agent can be configured through a JSON configuration file located at `cline_docs/task-chunking/config.json`:

```json
{
  "enabled": true,
  "maxChunkSize": "medium",
  "autoExecute": true,
  "promptThreshold": 5,
  "logging": {
    "level": "info",
    "retention": 30
  }
}
```

### Configuration Options

- **enabled**: Enable or disable the agent
- **maxChunkSize**: Default chunk size (small, medium, large)
- **autoExecute**: Whether to automatically execute chunks without prompting
- **promptThreshold**: Number of chunks to execute before prompting the user
- **logging.level**: Log level (debug, info, warn, error)
- **logging.retention**: Number of days to retain logs

## Integration with Other Agents

The Task Chunking Agent is designed to work seamlessly with other agents in your ecosystem:

### With Design & Navigation Agent

The Task Chunking Agent can break down large design tasks into manageable chunks, allowing the Design & Navigation Agent to focus on specific aspects of the UI/UX.

```javascript
// Example integration with Design Agent
const taskAgent = new TaskChunkingAgent();
const designAgent = new DesignAgent();

// Analyze a large design task
const chunks = await taskAgent.analyzeTask('Redesign the entire website navigation...', {
  chunkSize: 'medium'
});

// Process each chunk with the Design Agent
for (const chunk of chunks) {
  await designAgent.processDesignTask(chunk.description);
}
```

### With Content Agent

For large content creation tasks, the Task Chunking Agent can divide the work into logical sections:

```javascript
// Example integration with Content Agent
const taskAgent = new TaskChunkingAgent();
const contentAgent = new ContentAgent();

// Analyze a large content task
const chunks = await taskAgent.analyzeTask('Create content for all tarot card interpretations...', {
  chunkSize: 'small'
});

// Process each chunk with the Content Agent
for (const chunk of chunks) {
  await contentAgent.generateContent(chunk.description);
}
```

### With Refactoring Agent

When refactoring large codebases, the Task Chunking Agent can help prioritize and organize the work:

```javascript
// Example integration with Refactoring Agent
const taskAgent = new TaskChunkingAgent();
const refactoringAgent = new RefactoringAgent();

// Analyze a large refactoring task
const chunks = await taskAgent.analyzeTask('Refactor the authentication system...', {
  chunkSize: 'large'
});

// Process each chunk with the Refactoring Agent
for (const chunk of chunks) {
  await refactoringAgent.refactorCode(chunk.description);
}
```

## Examples

### Example 1: Breaking Down a Website Redesign

```
Task: Redesign the Mystic Arcana website to improve user experience, fix navigation issues, and enhance the visual appeal. The redesign should include updating the header, footer, navigation menu, home page, tarot card display, blog layout, and authentication forms.
```

The Task Chunking Agent would break this down into chunks like:

1. Header and navigation menu redesign
2. Home page layout and content improvements
3. Tarot card display enhancements
4. Blog layout optimization
5. Authentication forms update
6. Footer redesign
7. Cross-page consistency and final touches

### Example 2: Implementing a New Feature

```
Task: Implement a new personalized tarot reading feature that includes user preferences, reading history, card interpretations tailored to the user's profile, and the ability to save and share readings. This should include database schema updates, backend API endpoints, frontend components, and integration with the existing authentication system.
```

The Task Chunking Agent would break this down into chunks like:

1. Database schema design and updates
2. Backend API endpoint implementation
3. Frontend component development for user preferences
4. Tarot reading history implementation
5. Personalized interpretation algorithm
6. Save and share functionality
7. Integration with authentication system
8. Testing and optimization

## Advanced Usage

### Custom Chunk Execution

You can implement custom chunk execution logic by extending the `TaskChunkingAgent` class:

```javascript
class CustomTaskChunkingAgent extends TaskChunkingAgent {
  async executeChunk(chunk) {
    // Custom implementation for executing chunks
    console.log(`Executing chunk with custom logic: ${chunk.id}`);
    
    // Your custom execution logic here
    
    return {
      success: true,
      message: `Chunk ${chunk.id} executed with custom logic`,
      output: `Custom output for chunk ${chunk.id}`
    };
  }
}
```

### Batch Processing

For processing multiple tasks in batch mode:

```javascript
async function processBatchTasks(taskDescriptions) {
  const results = [];
  
  for (const description of taskDescriptions) {
    const agent = new TaskChunkingAgent();
    await agent.analyzeTask(description);
    const result = await agent.executeTask(true); // Auto-execute
    results.push(result);
  }
  
  return results;
}
```

### Integration with External Systems

The Task Chunking Agent can be integrated with external task management systems:

```javascript
async function importFromJira(jiraIssueId) {
  // Fetch issue from Jira
  const jiraIssue = await jiraClient.getIssue(jiraIssueId);
  
  // Create a task chunking agent
  const agent = new TaskChunkingAgent();
  
  // Analyze the task
  await agent.analyzeTask(jiraIssue.description, {
    externalId: jiraIssueId,
    externalSystem: 'jira'
  });
  
  return agent;
}
```

---

By using the Task Chunking Agent, you can tackle even the most complex tasks with confidence, breaking them down into manageable pieces and making steady progress toward completion.
