import { getActiveDeck } from '../config/tarot-deck-config';
import { TarotCard } from '../data/tarot-cards';

export function getTarotCardImagePath(card: TarotCard): string {
  const deck = getActiveDeck();
  return deck.cardPathTemplate
    .replace('{deckId}', deck.id)
    .replace('{imageId}', card.imageId)
    .replace('{normalizedName}', card.normalizedName);
}

export function getCardBackPath(): string {
  return getActiveDeck().cardBackImage;
}

// ... rest of utility functions remain the same ...
