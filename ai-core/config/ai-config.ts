export const AI_CONFIG = {
  mcp: {
    baseUrl: process.env.MCP_BASE_URL || 'http://localhost:3001',
    apiKey: process.env.MCP_API_KEY,
    maxConcurrentTasks: 5,
    timeout: 30000,
    retryAttempts: 3,
  },
  crewai: {
    baseUrl: process.env.CREWAI_BASE_URL || 'http://localhost:8765',
    apiKey: process.env.CREWAI_API_KEY,
    maxAgents: 3,
    timeout: 60000,
  },
  personalization: {
    modelPath: './ai-core/models/personalization',
    updateInterval: 3600000, // 1 hour
    minDataPoints: 100,
    confidenceThreshold: 0.8,
  },
  agents: {
    tarot: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      promptTemplate: 'tarot_reading_template_v1',
    },
    development: {
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 2000,
      promptTemplate: 'development_template_v1',
    },
    content: {
      model: 'gpt-4',
      temperature: 0.8,
      maxTokens: 1500,
      promptTemplate: 'content_template_v1',
    },
  },
};