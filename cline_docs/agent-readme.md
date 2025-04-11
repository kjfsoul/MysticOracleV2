# Unified Agent System Architecture

## Quick Start

```bash
# Install all dependencies
npm run agents:install-all

# Start all agent systems
npm run agents:start-all

# Monitor status
npm run agents:status
```

## Architecture Overview

The system consists of three integrated agent subsystems:

1. **MCP Agents** (Low-level operations)
   - File system operations
   - Code generation
   - System automation

2. **CrewAI Agents** (AI-powered tasks)
   - Content generation
   - Code analysis
   - UI/UX improvements

3. **Custom Agents** (Project-specific)
   - Task orchestration
   - Testing
   - Integration

## Integration Points

### Task Queue
- Central task queue: `cline_docs/task-queue.json`
- All agents read from and write to this queue
- Priority-based task execution
- Automatic task distribution

### Agent Communication
- Inter-agent messaging system
- Shared memory store
- Event-based coordination

### Monitoring
- Unified dashboard
- Real-time status updates
- Centralized logging
- Alert system

## Configuration

All configuration is managed through `cline_docs/agent-config.json`:
- Working hours
- System enables/disables
- Monitoring settings
- Integration points

## Best Practices

1. **Task Definition**
   - Clear acceptance criteria
   - Defined dependencies
   - Estimated complexity

2. **Agent Selection**
   - Use MCP for system tasks
   - Use CrewAI for AI-heavy tasks
   - Use Custom for project-specific tasks

3. **Monitoring**
   - Regular status checks
   - Log review
   - Performance metrics

## Troubleshooting

Common issues and solutions:

1. **Agent System Not Starting**
   - Check configurations
   - Verify dependencies
   - Review logs

2. **Task Queue Issues**
   - Validate JSON format
   - Check file permissions
   - Clear queue cache

3. **Integration Problems**
   - Verify API keys
   - Check network connectivity
   - Validate endpoints

## Security

- API key management
- Access controls
- Audit logging
- Rate limiting

## Scaling

- Horizontal scaling
- Load balancing
- Resource management
- Queue optimization
