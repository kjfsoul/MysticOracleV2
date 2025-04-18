import { TarotCard } from "@client/data/tarot-cards";

export function getTarotCardImagePath(card: TarotCard): string {
  // Use WebP format with JPG fallback
  return `/images/tarot/decks/rider-waite/${card.id}.webp`;
}
