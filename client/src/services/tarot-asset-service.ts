import type { TarotCard, TarotDeck } from '../types/tarot';

export class TarotAssetService {
  private static instance: TarotAssetService;
  private activeDeck: TarotDeck;
  
  private constructor(deck: TarotDeck) {
    this.activeDeck = deck;
  }

  static getInstance(deck?: TarotDeck): TarotAssetService {
    if (!TarotAssetService.instance) {
      if (!deck) throw new Error('Initial deck must be provided');
      TarotAssetService.instance = new TarotAssetService(deck);
    }
    return TarotAssetService.instance;
  }

  getCardImagePath(card: TarotCard): string {
    const basePath = this.activeDeck.assets.basePath;
    const subfolder = card.arcana === 'major' ? 'major' : `minor/${card.suit}`;
    return `${basePath}/${subfolder}/${card.id}.jpg`;
  }

  getCardBackPath(): string {
    return this.activeDeck.assets.cardBack;
  }

  getFallbackPath(card: TarotCard): string {
    const type = card.arcana === 'major' ? 'major' : card.suit;
    return `/images/tarot/placeholders/${type}-placeholder.svg`;
  }

  setActiveDeck(deck: TarotDeck): void {
    this.activeDeck = deck;
  }
}