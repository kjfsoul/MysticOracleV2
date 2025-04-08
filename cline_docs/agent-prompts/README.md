# Mystic Arcana Autonomous Agent System

This document provides instructions for setting up and managing the autonomous agent system for Mystic Arcana.

## Agent Types

The system uses two types of agents:

1. **MCP Agents**: Agents that run using the Model Context Protocol (MCP)
2. **Autonomous Agents**: Custom agents that run independently

## Directory Structure

- `scripts/`: Contains scripts for starting, stopping, and monitoring agents
- `cline_docs/agent-logs/`: Contains log files for all agents
- `cline_docs/agent-prompts/`: Contains prompt templates for agents
- `.mcp/`: Contains MCP-specific configuration and code

## Available Commands

### Starting Agents

```bash
# Start MCP agents
npm run mcp-agents:start

# Start autonomous agents
npm run agents:start

# Start both types of agents with auto-restart
npm run agents:auto-start
```

### Monitoring Agents

```bash
# Check status of MCP agents
npm run mcp-agents:status

# Check status of autonomous agents
npm run agents:status

# Monitor all agents and restart if needed
npm run agents:monitor
```

### Viewing Logs

```bash
# View MCP agent logs
npm run mcp-agents:logs

# View autonomous agent logs
npm run agents:logs
```

### Setting Up Automatic Monitoring

```bash
# Set up cron job to monitor agents every 15 minutes
npm run agents:setup-cron
```

## Agent Configuration

Agents are configured with specific roles:

1. **Design Agent**: Improves UI/UX while maintaining the mystical theme
2. **Content Agent**: Enhances tarot, astrology, and journal content
3. **Integration Agent**: Ensures systems work together seamlessly

## Troubleshooting

If agents are not running:

1. Check logs in `cline_docs/agent-logs/`
2. Run `npm run agents:monitor` to restart them
3. Check for errors in the console output

## Adding New Agents

To add a new agent:

1. Create a prompt file in `cline_docs/agent-prompts/`
2. Update the agent configuration in `scripts/start-agents.js` or `scripts/start-mcp-agents.js`
3. Restart the agents

## Best Practices

- Always check logs before making changes
- Test changes locally before deploying
- Make incremental changes to avoid breaking the build
- Use the monitoring system to ensure agents are always running
