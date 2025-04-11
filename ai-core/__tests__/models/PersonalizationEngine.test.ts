import { PersonalizationEngine } from '../../models/PersonalizationEngine';
import { AgentTask } from '../../types/AgentTask';
import { UserContext } from '../../types/UserContext';
import '../mocks/Logger.mock';

describe('PersonalizationEngine', () => {
  let engine: PersonalizationEngine;

  beforeEach(() => {
    engine = new PersonalizationEngine();
    jest.clearAllMocks();
  });

  test('should enhance task with user context', async () => {
    const task: AgentTask = {
      id: 'task-1',
      type: 'tarot-reading',
      complexity: 5,
      parameters: {}
    };

    const userContext: UserContext = {
      userId: 'user-1',
      preferences: {
        readingStyle: 'detailed',
        theme: 'mystical'
      }
    };

    const enhancedTask = await engine.enhanceTask(task, userContext);

    expect(enhancedTask).toMatchObject({
      id: task.id,
      type: task.type,
      parameters: expect.any(Object)
    });
  });

  test('should maintain task integrity while enhancing', async () => {
    const originalTask: AgentTask = {
      id: 'task-2',
      type: 'astrology',
      complexity: 6,
      parameters: {}
    };

    const userContext: UserContext = {
      userId: 'user-1',
      preferences: {}
    };

    const enhancedTask = await engine.enhanceTask(originalTask, userContext);

    expect(enhancedTask.id).toBe(originalTask.id);
    expect(enhancedTask.type).toBe(originalTask.type);
    expect(enhancedTask.complexity).toBeGreaterThanOrEqual(originalTask.complexity);
  });
});
