/**
 * Tarot Image Utilities
 * 
 * This file contains utility functions for working with tarot card images.
 */

import { getActiveDeck, getCardPath, getCardBackPath } from '../config/tarot-deck-config';

/**
 * Get the image path for a tarot card
 * 
 * @param cardId The ID of the card
 * @param arcana Whether the card is from the major or minor arcana
 * @param suit The suit of the card (for minor arcana)
 * @param deckId Optional deck ID (uses active deck if not provided)
 * @returns The path to the card image
 */
export function getTarotCardImagePath(
  cardId: string,
  arcana: 'major' | 'minor',
  suit?: string,
  deckId?: string
): string {
  const deck = deckId || getActiveDeck().id;
  return getCardPath(deck, arcana, cardId, suit);
}

/**
 * Get the card back image path
 * 
 * @param deckId Optional deck ID (uses active deck if not provided)
 * @returns The path to the card back image
 */
export function getTarotCardBackPath(deckId?: string): string {
  return getCardBackPath(deckId);
}

/**
 * Preload a tarot card image
 * 
 * @param imagePath The path to the image to preload
 * @returns A promise that resolves when the image is loaded
 */
export function preloadTarotCardImage(imagePath: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = imagePath;
  });
}

/**
 * Preload all images for a deck
 * 
 * @param deckId The ID of the deck to preload
 * @param onProgress Optional callback for progress updates
 * @returns A promise that resolves when all images are loaded
 */
export async function preloadDeck(
  deckId: string,
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  // This would need to be implemented based on your specific card data structure
  // For now, it's a placeholder
  console.log(`Preloading deck: ${deckId}`);
}

/**
 * Handle image loading errors by providing fallback images
 * 
 * @param event The error event
 * @param arcana The arcana of the card
 * @param suit Optional suit for minor arcana
 */
export function handleTarotImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  arcana: 'major' | 'minor',
  suit?: string
): void {
  const target = event.target as HTMLImageElement;
  if (arcana === 'major') {
    target.src = '/images/tarot/placeholders/major-placeholder.svg';
  } else if (suit) {
    target.src = `/images/tarot/placeholders/${suit}-placeholder.svg`;
  } else {
    target.src = '/images/tarot/placeholders/minor-placeholder.svg';
  }
}
