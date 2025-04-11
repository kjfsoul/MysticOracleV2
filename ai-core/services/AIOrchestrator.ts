import { MCPService } from './mcp/MCPService';
import { CrewAIService } from './crewai/CrewAIService';
import { AgentRegistry } from '../agents/AgentRegistry';
import { PersonalizationEngine } from '../models/PersonalizationEngine';
import { UserContext, AgentTask, AIResponse } from '../../shared/types';

export class AIOrchestrator {
  private static instance: AIOrchestrator;
  private mcpService: MCPService;
  private crewAIService: CrewAIService;
  private agentRegistry: AgentRegistry;
  private personalization: PersonalizationEngine;

  private constructor() {
    this.mcpService = new MCPService();
    this.crewAIService = new CrewAIService();
    this.agentRegistry = new AgentRegistry();
    this.personalization = new PersonalizationEngine();
  }

  static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  async processTask(task: AgentTask, userContext: UserContext): Promise<AIResponse> {
    // Apply personalization
    const personalizedTask = await this.personalization.enhanceTask(task, userContext);

    // Select appropriate agent
    const agent = this.agentRegistry.getAgent(personalizedTask.type);

    // Choose between MCP and CrewAI based on task requirements
    const service = this.selectService(personalizedTask);

    // Execute task
    const result = await service.executeTask(personalizedTask, agent);

    // Learn from interaction
    await this.personalization.learn(task, result, userContext);

    return result;
  }

  private selectService(task: AgentTask) {
    return task.requiresCrewAI ? this.crewAIService : this.mcpService;
  }
}