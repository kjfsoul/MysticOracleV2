# Mystic Arcana Agent Ecosystem Documentation

This document provides comprehensive documentation for the agent ecosystem developed for Mystic Arcana, which can be migrated to a standalone project.

## Table of Contents

1. [Overview](#overview)
2. [Agent Types](#agent-types)
3. [Architecture](#architecture)
4. [MCP Integration](#mcp-integration)
5. [Autonomous Agents](#autonomous-agents)
6. [Personalization System](#personalization-system)
7. [Continuous Improvement](#continuous-improvement)
8. [Migration Guide](#migration-guide)
9. [Auto-Start Implementation](#auto-start-implementation)
10. [One-Click Setup](#one-click-setup)

## Overview

The Mystic Arcana agent ecosystem is a comprehensive system of AI agents designed to assist with various aspects of development, content creation, and user experience. The system includes:

- **MCP Agents**: Model Context Protocol agents that leverage external LLMs
- **Autonomous Agents**: Self-directed agents that can work independently
- **Specialized Agents**: Agents with specific roles and expertise
- **Refactoring Agents**: Agents focused on code quality and improvement
- **Personalization System**: Framework for adapting to user preferences and behavior

This ecosystem is designed to be modular, extensible, and capable of running in the background to continuously improve the application.

## Agent Types

### Design & Navigation Agent
- **Purpose**: Improve UI/UX design, navigation flows, and layout optimization
- **Capabilities**: Analyzes spacing, visual hierarchy, component placement, and navigation paths
- **Key Focus**: Fixing navigation issues, improving spacing, enhancing visual consistency

### Content Agent
- **Purpose**: Generate and enhance mystical content (tarot, astrology, spiritual)
- **Capabilities**: Creates authentic content, improves existing content, ensures spiritual depth
- **Key Focus**: Tarot interpretations, blog content, astrological insights

### Integration Agent
- **Purpose**: Ensure seamless integration between systems (Supabase, Stripe, Netlify)
- **Capabilities**: Monitors for errors, optimizes data flow, implements integrations
- **Key Focus**: Authentication flows, database connections, payment processing

### Code Agent
- **Purpose**: Improve code quality, implement features, fix bugs
- **Capabilities**: Writes and refactors code, implements new features, resolves issues
- **Key Focus**: Code implementation, bug fixing, feature development

### Refactoring Agent
- **Purpose**: Continuously improve code quality and structure
- **Capabilities**: Identifies code smells, duplicated code, complex methods
- **Key Focus**: Code duplication, complexity reduction, naming improvements

## Architecture

The agent ecosystem is built with the following components:

### Core Components

1. **Agent Manager**: Orchestrates agent activities, manages scheduling, and handles resource allocation
2. **Prompt Templates**: Specialized prompts for different agent types and tasks
3. **Configuration System**: JSON-based configuration for customizing agent behavior
4. **Logging System**: Comprehensive logging of agent activities and outcomes
5. **History Tracking**: Records of agent actions and their impacts

### Directory Structure

```
/agent-ecosystem/
├── scripts/
│   ├── agents/
│   │   ├── autonomous/
│   │   ├── mcp/
│   │   ├── refactoring/
│   │   └── specialized/
│   ├── manager.js
│   ├── auto-start.js
│   └── setup.js
├── config/
│   ├── agent-config.json
│   ├── mcp-config.json
│   └── scheduler-config.json
├── prompts/
│   ├── design/
│   ├── content/
│   ├── code/
│   └── integration/
├── models/
│   └── fine-tuned/
├── logs/
│   └── history/
└── docs/
    └── README.md
```

## MCP Integration

The Model Context Protocol (MCP) integration allows agents to leverage powerful language models while maintaining context about the codebase.

### Key Features

1. **Context Preservation**: Maintains awareness of the codebase structure and content
2. **Tool Access**: Provides agents with access to development tools (file editing, git operations)
3. **Multi-Agent Collaboration**: Enables multiple agents to work together on complex tasks
4. **Stateful Interactions**: Preserves state between agent invocations

### Implementation

MCP agents are implemented using the following pattern:

```javascript
// Example MCP agent implementation
const mcpAgent = {
  name: "design-agent",
  prompt: "You are a design expert specializing in UI/UX for mystical websites...",
  model: "gpt-4o",
  temperature: 0.7,
  tools: ["codebase-retrieval", "str-replace-editor", "web-search"]
};
```

## Autonomous Agents

Autonomous agents can operate independently without continuous human supervision, making them ideal for background tasks and continuous improvement.

### Key Features

1. **Self-Direction**: Can identify and prioritize tasks without human input
2. **Persistence**: Continues working across sessions
3. **Learning**: Improves performance based on feedback and outcomes
4. **Resource Management**: Manages its own computational resources

### Implementation

Autonomous agents are implemented with:

1. **Agent Runner**: Process that manages the agent's lifecycle
2. **Task Queue**: Prioritized list of tasks for the agent to complete
3. **Memory System**: Persistent storage of agent knowledge and history
4. **Feedback Loop**: Mechanism for evaluating and improving agent performance

## Personalization System

The personalization system enables agents to adapt to user preferences and behavior, creating a more tailored experience.

### Key Components

1. **User Profiles**: Vector embeddings representing user spiritual profiles
2. **Feedback Collection**: Systems for gathering explicit and implicit user feedback
3. **Adaptive Content**: Content that evolves based on user interactions
4. **Personalized Recommendations**: Suggestions tailored to individual users

### Implementation

The personalization system uses vector embeddings to track user spiritual profiles and preferences:

```javascript
// Example personalization implementation
const userProfile = {
  vectorEmbedding: [...], // 1536-dimensional vector
  preferences: {
    tarotDecks: ["rider-waite", "thoth"],
    astrologicalFocus: ["natal-chart", "transits"],
    journalingFrequency: "daily"
  },
  interactionHistory: [...]
};
```

## Continuous Improvement

The agent ecosystem includes mechanisms for continuous improvement through:

1. **Performance Monitoring**: Tracking agent effectiveness and efficiency
2. **Feedback Integration**: Incorporating user and developer feedback
3. **A/B Testing**: Comparing different approaches to optimize outcomes
4. **Model Updates**: Regularly updating underlying models and prompts

### Implementation

Continuous improvement is implemented through:

1. **Metrics Collection**: Gathering data on agent performance
2. **Feedback Loops**: Mechanisms for incorporating feedback
3. **Version Control**: Tracking changes to agent configurations and prompts
4. **Experimentation Framework**: Testing new approaches in controlled environments

## Migration Guide

To migrate the agent ecosystem to a standalone project:

1. **Create New Repository**: Initialize a new repository for the agent ecosystem
2. **Copy Agent Files**: Transfer all agent-related files from Mystic Arcana
3. **Update Dependencies**: Ensure all necessary dependencies are included
4. **Configure Environment**: Set up environment variables and configuration
5. **Test Integration**: Verify that agents can still interact with target projects

### Step-by-Step Migration

```bash
# 1. Create new repository
mkdir agent-ecosystem
cd agent-ecosystem
git init

# 2. Copy agent files
cp -r /path/to/mystic-arcana/scripts/agents ./scripts/
cp -r /path/to/mystic-arcana/cline_docs/agent* ./docs/

# 3. Initialize npm and install dependencies
npm init
npm install dotenv axios openai node-cron fs-extra

# 4. Create configuration files
mkdir config
cp /path/to/mystic-arcana/scripts/agents/config.json ./config/

# 5. Set up environment variables
touch .env
# Add necessary API keys and configuration
```

## Auto-Start Implementation

The auto-start feature enables agents to begin working automatically when the system starts, ensuring continuous operation.

### Implementation

1. **System Service**: Register agents as system services (systemd, launchd, etc.)
2. **Startup Scripts**: Create scripts that run on system startup
3. **Process Manager**: Use a process manager like PM2 to ensure persistence
4. **Health Monitoring**: Implement health checks and automatic restarts

### Example PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "agent-manager",
      script: "./scripts/manager.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      max_restarts: 10
    },
    {
      name: "mcp-agents",
      script: "./scripts/agents/mcp/start-mcp-agents.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      autorestart: true
    },
    {
      name: "autonomous-agents",
      script: "./scripts/agents/autonomous/start-agents.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      autorestart: true
    }
  ]
};
```

## One-Click Setup

The one-click setup provides a simple way to deploy the entire agent ecosystem with minimal configuration.

### Implementation

1. **Setup Script**: Single script that handles all installation and configuration
2. **Configuration Wizard**: Interactive process for customizing the setup
3. **Validation**: Checks for dependencies and requirements
4. **Documentation**: Clear instructions for the setup process

### Example Setup Script

```javascript
#!/usr/bin/env node

/**
 * One-Click Agent Ecosystem Setup
 * 
 * This script sets up the entire agent ecosystem with minimal configuration.
 */

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main setup function
async function setup() {
  console.log('Welcome to the Agent Ecosystem Setup Wizard!');
  
  // 1. Check dependencies
  console.log('Checking dependencies...');
  // Implementation details...
  
  // 2. Configure environment
  console.log('Configuring environment...');
  // Implementation details...
  
  // 3. Set up agent configurations
  console.log('Setting up agent configurations...');
  // Implementation details...
  
  // 4. Install and start services
  console.log('Installing and starting services...');
  // Implementation details...
  
  console.log('Setup complete! The agent ecosystem is now running.');
}

// Run the setup
setup().catch(error => {
  console.error('Error during setup:', error);
  process.exit(1);
});
```

---

This documentation provides a comprehensive overview of the agent ecosystem, its components, and how to migrate it to a standalone project. For specific implementation details, refer to the code and configuration files in the respective directories.

For questions or assistance, please contact the development team.

*Last updated: [Current Date]*
