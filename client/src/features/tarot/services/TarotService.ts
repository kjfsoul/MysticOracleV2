import { AIOrchestrator } from '@/ai/services/AIOrchestrator';
import { TarotReading, UserContext } from '@/core/types';
import { TarotAssetService } from './TarotAssetService';

export class TarotService {
  private aiOrchestrator: AIOrchestrator;
  private assetService: TarotAssetService;

  constructor() {
    this.aiOrchestrator = AIOrchestrator.getInstance();
    this.assetService = new TarotAssetService();
  }

  async generateReading(
    spread: string,
    question: string,
    userContext: UserContext
  ): Promise<TarotReading> {
    const task = {
      type: 'tarot_reading',
      parameters: {
        spread,
        question,
        requiresCrewAI: true // Use CrewAI for complex readings
      }
    };

    const result = await this.aiOrchestrator.processTask(task, userContext);

    return this.enrichReadingWithAssets(result.reading);
  }

  private enrichReadingWithAssets(reading: TarotReading): TarotReading {
    return {
      ...reading,
      cards: reading.cards.map(card => ({
        ...card,
        imagePath: this.assetService.getCardImagePath(card),
        backImagePath: this.assetService.getCardBackPath()
      }))
    };
  }
}
