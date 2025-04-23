import { TarotCard } from "@client/data/tarot-cards";

/**
 * Configuration for tarot decks
 */
export interface TarotDeckConfig {
  id: string;
  name: string;
  pathTemplate: string;
  fallbackTemplate: string;
  cardBackPath: string;
}

/**
 * Available tarot decks
 */
export const TAROT_DECKS: TarotDeckConfig[] = [
  {
    id: 'rider-waite',
    name: 'Rider-Waite-Smith',
    pathTemplate: '/images/tarot/decks/rider-waite/major/{id}.svg',
    fallbackTemplate: '/images/tarot/placeholders/{arcana}-placeholder.svg',
    cardBackPath: '/images/tarot/card-back.svg'
  },
  // Add more decks here as needed
];

// Default to Rider-Waite deck
let activeDeckId = 'rider-waite';

/**
 * Get the active tarot deck configuration
 */
export function getActiveDeck(): TarotDeckConfig {
  return TAROT_DECKS.find(deck => deck.id === activeDeckId) || TAROT_DECKS[0];
}

/**
 * Set the active tarot deck
 */
export function setActiveDeck(deckId: string): void {
  const deck = TAROT_DECKS.find(d => d.id === deckId);
  if (deck) {
    activeDeckId = deckId;
    // Save preference to localStorage if available
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('activeTarotDeck', deckId);
    }
  }
}

// Initialize from localStorage if available
if (typeof localStorage !== 'undefined') {
  const storedDeck = localStorage.getItem('activeTarotDeck');
  if (storedDeck && TAROT_DECKS.some(deck => deck.id === storedDeck)) {
    activeDeckId = storedDeck;
  }
}

/**
 * Get the image path for a tarot card
 */
export function getTarotCardImagePath(card: TarotCard): string {
  const deck = getActiveDeck();

  // Format the path according to the template
  let path = deck.pathTemplate
    .replace("{id}", card.id)
    .replace("{arcana}", card.arcana);

  // Special handling for problematic cards
  if (
    card.id === "07-chariot" ||
    card.id === "chariot" ||
    card.id === "13-death" ||
    card.id === "death" ||
    card.id === "16-tower" ||
    card.id === "tower"
  ) {
    console.log(
      `Using fallback for potentially problematic card: ${card.name}`
    );
    return getFallbackImagePath(card);
  }

  return path;
}

/**
 * Get a fallback image path for a tarot card
 */
export function getFallbackImagePath(card: TarotCard): string {
  const deck = getActiveDeck();
  return deck.fallbackTemplate
    .replace("{arcana}", card.arcana)
    .replace("{suit}", card.suit || "major");
}

/**
 * Get the card back image path
 */
export function getCardBackPath(): string {
  return getActiveDeck().cardBackPath;
}

/**
 * Get a deterministic daily card based on the current date
 */
export function getDailyCard(cards: TarotCard[]): {
  card: TarotCard;
  isReversed: boolean;
} {
  // Get a deterministic "random" card based on today's date
  const today = new Date();
  const dateString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  // Use the date string to create a seed for the random selection
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to select a card
  const index = Math.abs(hash) % cards.length;
  const selectedCard = cards[index];

  // Determine if the card is reversed (also based on the date)
  const isReversed = (hash >> 4) % 2 === 1;

  return { card: selectedCard, isReversed };
}

/**
 * Handle image loading errors for tarot cards
 */
export function handleTarotImageError(
  card: TarotCard,
  setImagePath: (path: string) => void
): void {
  console.warn(`Error loading image for card: ${card.name}`);
  setImagePath(getFallbackImagePath(card));
}
