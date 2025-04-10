/**
 * Tarot Utility Functions
 *
 * This file contains utility functions for working with tarot cards.
 */

import { getActiveDeck } from '../config/tarot-deck-config';
import { TarotCard } from '../data/tarot-cards';

/**
 * Get the image path for a tarot card
 *
 * @param card The tarot card object
 * @returns The path to the card image
 */
export function getTarotCardImagePath(card: TarotCard): string {
  const activeDeck = getActiveDeck();

  // Log the card and active deck for debugging
  console.log(
    "Getting image path for card:",
    card.id,
    "from deck:",
    activeDeck.id
  );

  // First try the imagePath property if it exists
  if (card.imagePath && card.imagePath.trim() !== "") {
    console.log("Using card.imagePath:", card.imagePath);
    return card.imagePath;
  }

  // Otherwise construct the path based on card properties
  let path = "";
  if (card.arcana === "major") {
    path = `/images/tarot/decks/${activeDeck.id}/major/${card.id}.jpg`;
  } else if (card.arcana === "minor" && card.suit) {
    path = `/images/tarot/decks/${activeDeck.id}/minor/${card.suit}/${card.id}.jpg`;
  }

  console.log("Constructed path:", path);

  // Fallback to placeholder if needed
  if (!path || path.trim() === "") {
    if (card.arcana === "major") {
      path = "/images/tarot/placeholders/major-placeholder.svg";
    } else if (card.suit) {
      path = `/images/tarot/placeholders/${card.suit}-placeholder.svg`;
    } else {
      path = "/images/tarot/card-back.svg";
    }
    console.log("Using fallback path:", path);
  }

  return path;
}

/**
 * Get the card back image path
 *
 * @returns The path to the card back image
 */
export function getCardBackPath(): string {
  return '/images/tarot/card-back.svg';
}

/**
 * Handle image loading errors by providing fallback images
 *
 * @param event The error event
 * @param card The tarot card
 */
export function handleTarotImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  card: TarotCard
): void {
  const target = event.target as HTMLImageElement;
  if (card.arcana === 'major') {
    target.src = '/images/tarot/placeholders/major-placeholder.svg';
  } else if (card.suit) {
    target.src = `/images/tarot/placeholders/${card.suit}-placeholder.svg`;
  } else {
    target.src = '/images/tarot/placeholders/major-placeholder.svg';
  }
}

/**
 * Get a random tarot card
 *
 * @param cards Array of tarot cards
 * @param excludeIds Optional array of card IDs to exclude
 * @returns A random tarot card
 */
export function getRandomTarotCard(cards: TarotCard[], excludeIds: string[] = []): TarotCard {
  const availableCards = cards.filter(card => !excludeIds.includes(card.id));
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
}

/**
 * Determine if a card should be reversed
 *
 * @param reversalChance Chance of reversal (0-1)
 * @returns Boolean indicating if the card should be reversed
 */
export function shouldReverseCard(reversalChance = 0.25): boolean {
  return Math.random() < reversalChance;
}

/**
 * Get the meaning of a card based on its orientation
 *
 * @param card The tarot card
 * @param isReversed Whether the card is reversed
 * @returns The meaning text for the card
 */
export function getCardMeaning(card: TarotCard, isReversed: boolean): string {
  return isReversed ? card.meaningReversed : card.meaningUpright;
}

/**
 * Get a daily card based on the current date
 *
 * @param cards Array of tarot cards
 * @returns A tarot card for today
 */
export function getDailyCard(cards: TarotCard[]): { card: TarotCard, isReversed: boolean } {
  // Get today's date as string for consistent seeding
  const today = new Date().toISOString().split('T')[0];

  // Use the date string to seed a simple random number generator
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomIndex = seed % cards.length;
  const isReversed = (seed % 4 === 0); // 25% chance of reversal

  return {
    card: cards[randomIndex],
    isReversed,
  };
}
