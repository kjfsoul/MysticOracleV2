import { AgentTaskType } from '../../shared/types';
import { AI_CONFIG } from '../config/ai-config';

export interface Agent {
  type: AgentTaskType;
  config: any;
  execute: (task: any) => Promise<any>;
}

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<AgentTaskType, Agent>;

  private constructor() {
    this.agents = new Map();
    this.initializeAgents();
  }

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private async initializeAgents() {
    // Import agents dynamically
    const agentModules = {
      tarot_reading: await import('./tarot/TarotAgent'),
      journal_analysis: await import('./journal/JournalAgent'),
      personalization: await import('./personalization/PersonalizationAgent'),
      content_generation: await import('./content/ContentAgent'),
      ui_improvement: await import('./development/UIAgent'),
    };

    // Initialize each agent with its configuration
    for (const [type, module] of Object.entries(agentModules)) {
      const agentConfig = AI_CONFIG.agents[type.split('_')[0]];
      this.agents.set(type as AgentTaskType, new module.default(agentConfig));
    }
  }

  getAgent(type: AgentTaskType): Agent {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new Error(`Agent not found for type: ${type}`);
    }
    return agent;
  }

  async reloadAgent(type: AgentTaskType): Promise<void> {
    const agentConfig = AI_CONFIG.agents[type.split('_')[0]];
    const AgentClass = (await import(`./${type}/${type}Agent`)).default;
    this.agents.set(type, new AgentClass(agentConfig));
  }
}