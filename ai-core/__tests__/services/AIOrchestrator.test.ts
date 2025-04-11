import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { AIOrchestrator } from '../../services/AIOrchestrator';
import { CrewAIService } from '../../services/CrewAIService';
import { MCPService } from '../../services/MCPService';

describe('AIOrchestrator', () => {
  let orchestrator: AIOrchestrator;
  let mcpService: jest.Mocked<MCPService>;
  let crewAIService: jest.Mocked<CrewAIService>;

  beforeEach(() => {
    mcpService = {
      executeTask: jest.fn(),
    } as any;
    
    crewAIService = {
      executeTask: jest.fn(),
    } as any;

    orchestrator = new AIOrchestrator(mcpService, crewAIService);
  });

  test('should route complex tasks to CrewAI', async () => {
    const complexTask = {
      id: 'task-1',
      complexity: 8,
      type: 'analysis',
      requiresMultipleAgents: true
    };

    await orchestrator.processTask(complexTask, { userId: 'user-1' });
    
    expect(crewAIService.executeTask).toHaveBeenCalledWith(complexTask, expect.any(Object));
    expect(mcpService.executeTask).not.toHaveBeenCalled();
  });

  test('should route simple tasks to MCP', async () => {
    const simpleTask = {
      id: 'task-2',
      complexity: 5,
      type: 'generation',
      requiresMultipleAgents: false
    };

    await orchestrator.processTask(simpleTask, { userId: 'user-1' });
    
    expect(mcpService.executeTask).toHaveBeenCalledWith(simpleTask, expect.any(Object));
    expect(crewAIService.executeTask).not.toHaveBeenCalled();
  });
});
