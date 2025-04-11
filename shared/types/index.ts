// Base Types
export interface UserContext {
  userId: string;
  preferences: UserPreferences;
  sessionId: string;
  timestamp: Date;
}

export interface UserPreferences {
  theme: string;
  readingStyle: 'detailed' | 'concise';
  cardDeck: string;
  journalPromptStyle: string;
  aiInteractionLevel: 'basic' | 'advanced';
}

export interface AgentTask {
  id: string;
  type: AgentTaskType;
  parameters: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  requiresCrewAI: boolean;
  deadline?: Date;
  dependencies?: string[];
}

export type AgentTaskType = 
  | 'tarot_reading'
  | 'journal_analysis'
  | 'personalization'
  | 'content_generation'
  | 'ui_improvement';

export interface AIResponse {
  success: boolean;
  data: any;
  metadata: {
    processingTime: number;
    agentType: string;
    modelUsed: string;
    timestamp: Date;
  };
  userInteraction?: {
    feedback?: string;
    engagementMetrics?: Record<string, number>;
  };
}

// Tarot Specific Types
export interface TarotCard {
  name: string;
  number: number;
  suit?: string;
  isReversed: boolean;
  meaning: {
    upright: string;
    reversed: string;
    keywords: string[];
  };
  position?: {
    name: string;
    meaning: string;
  };
  imagePath?: string;
  backImagePath?: string;
}

export interface TarotReading {
  id: string;
  userId: string;
  question: string;
  spread: string;
  cards: TarotCard[];
  interpretation: string;
  timestamp: Date;
  aiMetadata: {
    modelUsed: string;
    confidence: number;
    personalizationFactors: string[];
  };
}