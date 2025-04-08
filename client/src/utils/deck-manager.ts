/**
 * Deck Manager Utility
 * 
 * This utility provides functions for managing tarot decks, including
 * checking for missing images, validating decks, and more.
 */

import { TAROT_DECKS, TarotDeckConfig } from '../config/tarot-deck-config';

interface DeckValidationResult {
  deckId: string;
  isValid: boolean;
  missingCards: string[];
  totalCards: number;
  availableCards: number;
}

/**
 * Check if an image exists at the given URL
 * 
 * @param url The URL to check
 * @returns A promise that resolves to true if the image exists, false otherwise
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Validate a tarot deck by checking if all required images exist
 * 
 * @param deckId The ID of the deck to validate
 * @returns A promise that resolves to a validation result
 */
export async function validateDeck(deckId: string): Promise<DeckValidationResult> {
  const deck = TAROT_DECKS.find(d => d.id === deckId);
  if (!deck) {
    throw new Error(`Deck with ID "${deckId}" not found`);
  }

  const result: DeckValidationResult = {
    deckId,
    isValid: true,
    missingCards: [],
    totalCards: 78, // 22 major + 56 minor
    availableCards: 0
  };

  // Check major arcana cards (0-21)
  for (let i = 0; i <= 21; i++) {
    const cardId = i.toString().padStart(2, '0');
    const imagePath = `${deck.basePath}/major/${cardId}-${getMajorCardName(i)}.jpg`;
    const exists = await checkImageExists(imagePath);
    
    if (!exists) {
      result.missingCards.push(`Major Arcana: ${getMajorCardName(i)}`);
      result.isValid = false;
    } else {
      result.availableCards++;
    }
  }

  // Check minor arcana cards
  const suits = ['cups', 'wands', 'swords', 'pentacles'];
  const ranks = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'page', 'knight', 'queen', 'king'];

  for (const suit of suits) {
    for (const rank of ranks) {
      const imagePath = `${deck.basePath}/minor/${suit}/${rank}-${suit}.jpg`;
      const exists = await checkImageExists(imagePath);
      
      if (!exists) {
        result.missingCards.push(`Minor Arcana: ${rank} of ${suit}`);
        result.isValid = false;
      } else {
        result.availableCards++;
      }
    }
  }

  return result;
}

/**
 * Get the name of a major arcana card by its number
 * 
 * @param number The number of the major arcana card (0-21)
 * @returns The name of the card in kebab-case
 */
function getMajorCardName(number: number): string {
  const names = [
    'fool',
    'magician',
    'high-priestess',
    'empress',
    'emperor',
    'hierophant',
    'lovers',
    'chariot',
    'strength',
    'hermit',
    'wheel-of-fortune',
    'justice',
    'hanged-man',
    'death',
    'temperance',
    'devil',
    'tower',
    'star',
    'moon',
    'sun',
    'judgement',
    'world'
  ];
  
  return names[number] || '';
}

/**
 * Get information about all available decks
 * 
 * @returns A promise that resolves to an array of deck validation results
 */
export async function getAllDeckInfo(): Promise<DeckValidationResult[]> {
  const results: DeckValidationResult[] = [];
  
  for (const deck of TAROT_DECKS) {
    const result = await validateDeck(deck.id);
    results.push(result);
  }
  
  return results;
}
