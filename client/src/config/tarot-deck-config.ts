/**
 * Tarot Deck Configuration
 *
 * This file contains configuration for tarot decks used in the application.
 * It allows for easy switching between different decks.
 */

export interface TarotDeckConfig {
  id: string;
  name: string;
  description: string;
  basePath: string;
  cardBack: string;
  isDefault: boolean;
}

export const TAROT_DECKS: TarotDeckConfig[] = [
  {
    id: "rider-waite",
    name: "Rider-Waite",
    description:
      "The classic Rider-Waite tarot deck, illustrated by Pamela Colman Smith.",
    basePath: "/images/tarot/decks/rider-waite",
    cardBack: "/images/tarot/card-back.svg",
    isDefault: true,
  },
  // Add more decks here as needed
];

// Get the default deck configuration
export function getDefaultDeck(): TarotDeckConfig {
  return TAROT_DECKS.find(deck => deck.isDefault) || TAROT_DECKS[0];
}

// Get a deck by ID
export function getDeckById(id: string): TarotDeckConfig | undefined {
  return TAROT_DECKS.find(deck => deck.id === id);
}

// Get the path for a specific card in the specified deck
export function getCardPath(deckId: string, arcana: 'major' | 'minor', cardId: string, suit?: string): string {
  const deck = getDeckById(deckId) || getDefaultDeck();

  if (arcana === "major") {
    return `${deck.basePath}/major/${cardId}.jpg`;
  } else if (arcana === "minor" && suit) {
    return `${deck.basePath}/minor/${suit}/${cardId}.jpg`;
  }

  // Fallback to placeholder
  return `/images/tarot/placeholders/${arcana === 'major' ? 'major' : suit}-placeholder.svg`;
}

// Get the card back image for a deck
export function getCardBackPath(deckId?: string): string {
  const deck = deckId ? getDeckById(deckId) : getDefaultDeck();
  return deck?.cardBack || '/images/tarot/card-back.jpg';
}

// Current active deck ID (can be stored in user preferences)
let activeDeckId: string = getDefaultDeck().id;

// Get the current active deck
export function getActiveDeck(): TarotDeckConfig {
  return getDeckById(activeDeckId) || getDefaultDeck();
}

// Set the active deck
export function setActiveDeck(deckId: string): boolean {
  const deck = getDeckById(deckId);
  if (deck) {
    activeDeckId = deckId;
    // Store in localStorage for persistence
    try {
      localStorage.setItem("mysticArcana.activeDeckId", deckId);
    } catch (e) {
      console.warn("Could not save active deck to localStorage:", e);
    }
    return true;
  }
  return false;
}

// Initialize the deck system
export function initializeDeckSystem(): void {
  // Try to load the active deck from localStorage
  try {
    const storedDeckId = localStorage.getItem('mysticArcana.activeDeckId');
    if (storedDeckId && getDeckById(storedDeckId)) {
      activeDeckId = storedDeckId;
    } else {
      // Ensure Rider-Waite is set as the active deck
      const riderWaiteDeck = TAROT_DECKS.find(deck => deck.id === 'rider-waite');
      if (riderWaiteDeck) {
        activeDeckId = 'rider-waite';
        localStorage.setItem('mysticArcana.activeDeckId', 'rider-waite');
      }
    }
  } catch (e) {
    console.warn('Could not initialize deck system from localStorage:', e);
    // Fallback to default
    activeDeckId = getDefaultDeck().id;
  }
}
