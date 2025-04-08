# Mystic Arcana Autonomous Agent Commands

This document provides information about the autonomous agent system for the Mystic Arcana project.

## Overview

The Mystic Arcana project uses two types of autonomous agents:

1. **Regular Agents**: These agents run tasks at scheduled times and can be managed using the `agents:*` commands.
2. **MCP-based Agents**: These agents use the Model Context Protocol (MCP) to interact with external tools and can be managed using the `mcp-agents:*` commands.

## Agent Management Commands

### Regular Agents

- `npm run agents:start` - Start the autonomous agents
- `npm run agents:stop` - Stop the autonomous agents
- `npm run agents:status` - Check the status of the autonomous agents
- `npm run agents:logs` - View the agent logs

### MCP-based Agents

- `npm run mcp-agents:start` - Start the MCP-based autonomous agents
- `npm run mcp-agents:stop` - Stop the MCP-based autonomous agents
- `npm run mcp-agents:status` - Check the status of the MCP-based autonomous agents
- `npm run mcp-agents:logs` - View the MCP agent logs

## Running Individual Agents

### Regular Agents

- `npm run agents:run-code` - Run the CodeAgent
- `npm run agents:run-design` - Run the DesignAgent
- `npm run agents:run-api` - Run the APIAgent
- `npm run agents:run-content` - Run the ContentAgent
- `npm run agents:run-test` - Run the TestAgent

### MCP-based Agents

- `npm run mcp:run-code` - Run the MCP-based CodeAgent
- `npm run mcp:run-design` - Run the MCP-based DesignAgent
- `npm run mcp:run-api` - Run the MCP-based APIAgent
- `npm run mcp:run-content` - Run the MCP-based ContentAgent
- `npm run mcp:run-test` - Run the MCP-based TestAgent

### Augment-based Agents

- `npm run augment:run-code` - Run the Augment-based CodeAgent
- `npm run augment:run-design` - Run the Augment-based DesignAgent
- `npm run augment:run-api` - Run the Augment-based APIAgent
- `npm run augment:run-content` - Run the Augment-based ContentAgent
- `npm run augment:run-test` - Run the Augment-based TestAgent

## Running All Agents

- `npm run agents:run` - Run all regular agents
- `npm run mcp:run` - Run all MCP-based agents
- `npm run augment:run` - Run all Augment-based agents

## Agent Configuration

### Regular Agents

The regular agents are configured in the `.mcp/agents.json` file. This file defines:

- Agent types and their capabilities
- Task schedules
- Workflows

### MCP-based Agents

The MCP-based agents are configured in the `.vscode/mcp-agents.json` file. This file defines:

- Agent types and their capabilities
- MCP servers to use
- Task schedules
- MCP tools to use
- Workflows

## Agent Logs

Agent logs are stored in the `cline_docs/agent-logs` directory:

- Regular agent logs: `agent-runner-YYYY-MM-DD.log`
- MCP agent logs: `mcp-agent-runner-YYYY-MM-DD.log`
- Standard output logs: `agent-stdout.log` and `mcp-agent-stdout.log`
- Standard error logs: `agent-stderr.log` and `mcp-agent-stderr.log`

## How Agents Work

1. The agent runner script starts and loads the agent configuration.
2. It schedules tasks based on their cron expressions.
3. When a task is due to run, it spawns a process to execute the task.
4. The task process runs the specified command and logs the output.
5. After the task completes, it is rescheduled for the next run.

## Troubleshooting

If the agents are not running as expected, try the following:

1. Check the agent status: `npm run agents:status` or `npm run mcp-agents:status`
2. Check the agent logs: `npm run agents:logs` or `npm run mcp-agents:logs`
3. Stop and restart the agents: `npm run agents:stop && npm run agents:start` or `npm run mcp-agents:stop && npm run mcp-agents:start`
4. Check if the agent configuration files exist: `.mcp/agents.json` and `.vscode/mcp-agents.json`
5. Make sure the agent scripts are executable: `chmod +x scripts/*.js .mcp/*.js .vscode/*.js`

## Netlify Deployment and User Authentication

The MCP-based agents include tasks for deploying to Netlify and implementing user authentication:

- `auth-ui-mcp`: Implements authentication UI components
- `auth-api-mcp`: Implements authentication API endpoints
- `deploy-netlify-mcp`: Deploys the application to Netlify

These tasks are part of the `priority-deployment` workflow, which runs every 2 hours to ensure the application is deployed with the latest changes.

## Stripe Integration

To add Stripe integration, you can create a new task in the `.vscode/mcp-agents.json` file:

```json
{
  "name": "stripe-integration-mcp",
  "description": "Implement Stripe payment integration",
  "schedule": "0 3 * * *",
  "command": "node scripts/mcp-agent.js APIAgent",
  "mcpTools": [
    {
      "server": "sequential-thinking",
      "tool": "sequentialthinking_npx",
      "params": {
        "thought": "Implementing Stripe payment integration"
      }
    }
  ]
}
```

Then add this task to the `priority-deployment` workflow.
