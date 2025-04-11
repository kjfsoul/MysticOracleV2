import fs from 'fs-extra';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';

interface AgentConfig {
  enabled: boolean;
  configPath: string;
}

interface UnifiedConfig {
  agents: {
    mcp: AgentConfig;
    crewai: AgentConfig;
  };
  logging: {
    level: string;
    path: string;
  };
}

export class UnifiedAgentManager {
  private config: UnifiedConfig;
  private processes: Map<string, ChildProcess>;
  private configPath: string;

  constructor() {
    this.processes = new Map();
    this.configPath = path.join(process.cwd(), 'ai-core/config/unified-config.json');
    this.config = require(this.configPath);
  }

  async start() {
    console.log('Starting unified agent system...');

    if (this.config.agents.mcp.enabled) {
      await this.startMCPAgents();
    }

    if (this.config.agents.crewai.enabled) {
      await this.startCrewAIAgents();
    }

    this.setupLogging();
  }

  private async startMCPAgents() {
    const mcpProcess = spawn('node', ['agents/mcp/start.js'], {
      cwd: path.join(process.cwd(), 'ai-core'),
      env: {
        ...process.env,
        CONFIG_PATH: this.config.agents.mcp.configPath
      }
    });

    this.processes.set('mcp', mcpProcess);
    this.handleProcessOutput(mcpProcess, 'MCP');
  }

  private async startCrewAIAgents() {
    const crewaiProcess = spawn('python', ['agents/crewai/main.py'], {
      cwd: path.join(process.cwd(), 'ai-core'),
      env: {
        ...process.env,
        CONFIG_PATH: this.config.agents.crewai.configPath
      }
    });

    this.processes.set('crewai', crewaiProcess);
    this.handleProcessOutput(crewaiProcess, 'CrewAI');
  }

  private handleProcessOutput(process: ChildProcess, name: string) {
    process.stdout?.on('data', (data) => {
      console.log(`[${name}] ${data}`);
    });

    process.stderr?.on('data', (data) => {
      console.error(`[${name}] Error: ${data}`);
    });

    process.on('close', (code) => {
      console.log(`[${name}] Process exited with code ${code}`);
      this.processes.delete(name);
    });
  }

  private setupLogging() {
    const logDir = path.join(process.cwd(), 'ai-core', this.config.logging.path);
    fs.ensureDirSync(logDir);
  }

  async stop() {
    console.log('Stopping all agents...');
    
    for (const [name, process] of this.processes) {
      process.kill();
      console.log(`Stopped ${name} agent`);
    }
    
    this.processes.clear();
  }

  async getStatus() {
    const status: Record<string, boolean> = {};
    
    for (const [name, process] of this.processes) {
      status[name] = !process.killed;
    }
    
    return status;
  }
}