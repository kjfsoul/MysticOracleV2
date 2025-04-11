import { AgentTask, AIResponse, UserContext } from "../../shared/types";
import { Logger } from "../utils/Logger";
import { CrewAIService } from "./crewai/CrewAIService";
import { MCPService } from "./mcp/MCPService";

export class AIOrchestrator {
  private logger: Logger;

  constructor(
    private mcpService: MCPService,
    private crewAIService: CrewAIService
  ) {
    this.logger = new Logger("AIOrchestrator");
  }

  async processTask(
    task: AgentTask,
    userContext: UserContext
  ): Promise<AIResponse> {
    this.logger.info("Processing task", { taskId: task.id, type: task.type });

    try {
      const service = this.selectService(task);
      const result = await service.executeTask(task, userContext);

      this.logger.info("Task completed", { taskId: task.id, success: true });
      return result;
    } catch (error) {
      this.logger.error("Task failed", { taskId: task.id, error });
      throw error;
    }
  }

  private selectService(task: AgentTask): MCPService | CrewAIService {
    const useCrewAI = task.complexity > 7 || task.requiresMultipleAgents;
    return useCrewAI ? this.crewAIService : this.mcpService;
  }
}
