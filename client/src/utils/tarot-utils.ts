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

export function getDailyCard(cards: TarotCard[]): { card: TarotCard; isReversed: boolean } {
  // Get a deterministic "random" card based on today's date
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Use the date string to create a seed for the random selection
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use the hash to select a card
  const index = Math.abs(hash) % cards.length;
  const selectedCard = cards[index];
  
  // Determine if the card is reversed (also based on the date)
  const isReversed = ((hash >> 4) % 2) === 1;
  
  return { card: selectedCard, isReversed };
}

// ... rest of utility functions remain the same ...
