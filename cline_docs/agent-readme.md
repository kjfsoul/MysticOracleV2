# Autonomous Agents for Mystic Arcana

This document explains how to use the autonomous agents system to continue development on the Mystic Arcana project while you're away.

## Overview

The autonomous agents system allows development to progress on your Mystic Arcana project even when you're not actively working on it. These agents leverage MCP servers to implement features, fix bugs, create content, and run tests based on a predefined task queue.

## Agent Types

The system includes five specialized agent types:

1. **CodeAgent**: Implements components and features using MCP-Dev-NextJS and MCP-React-UI
2. **DesignAgent**: Creates UI designs and animations using MCP-Design-System-Tailwind and MCP-React-UI
3. **APIAgent**: Develops API endpoints and serverless functions using MCP-Netlify-EdgeDocs and MCP-Fullstack-Turbo
4. **ContentAgent**: Generates content using MCP-CMS-Headless and MCP-AI-FunctionPack
5. **TestAgent**: Writes and runs tests using MCP-Dev-NextJS and MCP-Fullstack-Turbo

## Getting Started

### 1. Start Agents

To start the autonomous agents:

```bash
npm run agents:start
```

This will activate all agents to work on tasks in the task queue.

You can also start specific agents:

```bash
npm run agents:start -- --agent=CodeAgent
```

Or set a time limit:

```bash
npm run agents:start -- --duration=8h
```

### 2. Monitor Progress

Check the status of all agents:

```bash
npm run agents:status
```

View task progress:

```bash
npm run agents:progress
```

View agent logs:

```bash
npm run agents:logs
```

### 3. Manage Tasks

Add a new task to the queue:

```bash
npm run agents:add-task -- --file=path/to/task.json
```

Pause all agents:

```bash
npm run agents:pause
```

Resume agents:

```bash
npm run agents:resume
```

Stop all agents:

```bash
npm run agents:stop
```

## Task Definition

Tasks are defined in JSON format with the following structure:

```json
{
  "id": "task-123",
  "title": "Implement Tarot Card Component",
  "description": "Create a reusable tarot card component with front/back faces",
  "type": "feature",
  "priority": "high",
  "assignedAgent": "CodeAgent",
  "requiredMcpServers": ["react-ui", "design-system-tailwind"],
  "dependencies": [],
  "acceptanceCriteria": [
    "Component renders card front and back",
    "Accepts custom images",
    "Responsive sizing",
    "Accessible markup"
  ],
  "estimatedEffort": "medium",
  "status": "pending"
}
```

## Task Queue

The task queue is stored in `cline_docs/task-queue.json`. Agents work through tasks in order of priority.

Completed tasks are moved to `cline_docs/completed-tasks.json`.

## Best Practices

1. **Define Clear Tasks**: Provide detailed descriptions and acceptance criteria
2. **Set Dependencies**: Ensure prerequisite tasks are completed first
3. **Assign Appropriate Agents**: Match tasks to the right agent type
4. **Monitor Progress**: Regularly check agent status and task progress
5. **Review Completed Work**: Always review agent-generated code before deploying

## Limitations

The autonomous agents system has some limitations:

1. Agents can only work on predefined tasks in the queue
2. Complex architectural decisions still require human input
3. Agents will pause and notify on encountering blocking issues
4. Changes are limited to 200 lines of code per task
5. Critical changes require human review before being committed

## Troubleshooting

If agents encounter issues:

1. Check the agent logs for error messages
2. Verify that MCP servers are properly configured
3. Ensure task dependencies are correctly defined
4. Check that tasks have clear acceptance criteria
5. Restart agents if they become unresponsive

## Next Steps

1. Review the initial task queue in `cline_docs/task-queue.json`
2. Start agents to begin working on tasks
3. Monitor progress and review completed work
4. Add new tasks as needed

With this autonomous agents system, your Mystic Arcana project can continue to progress even while you're sleeping or away from your computer.
