/**
 * Tarot Card Data Model
 *
 * This file contains the data model for tarot cards used in the application.
 */

export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number | string;
  keywords: string[];
  description: string;
  meaningUpright: string;
  meaningReversed: string;
  element?: string;
  zodiacSign?: string;
  imagePath: string;
}

// Major Arcana Cards
export const majorArcanaCards: TarotCard[] = [
  {
    id: "00-fool",
    name: "The Fool",
    arcana: "major",
    number: 0,
    keywords: ["beginnings", "innocence", "spontaneity", "free spirit"],
    description:
      "The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe.",
    meaningUpright: "Beginnings, innocence, spontaneity, a free spirit",
    meaningReversed: "Holding back, recklessness, risk-taking",
    element: "Air",
    zodiacSign: "Uranus",
    imagePath: "/images/tarot/decks/rider-waite/major/00-fool.jpg",
  },
  {
    id: "01-magician",
    name: "The Magician",
    arcana: "major",
    number: 1,
    keywords: ["manifestation", "resourcefulness", "power", "inspired action"],
    description:
      "The Magician represents manifestation, resourcefulness, power, inspired action, creation and the ability to create one's own reality.",
    meaningUpright: "Manifestation, resourcefulness, power, inspired action",
    meaningReversed: "Manipulation, poor planning, untapped talents",
    element: "Air",
    zodiacSign: "Mercury",
    imagePath: "/images/tarot/placeholders/01-magician.svg",
  },
  {
    id: "02-high-priestess",
    name: "The High Priestess",
    arcana: "major",
    number: 2,
    keywords: [
      "intuition",
      "sacred knowledge",
      "divine feminine",
      "subconscious mind",
    ],
    description:
      "The High Priestess represents intuition, sacred knowledge, divine feminine, the subconscious mind, and wisdom.",
    meaningUpright:
      "Intuition, sacred knowledge, divine feminine, the subconscious mind",
    meaningReversed:
      "Secrets, disconnected from intuition, withdrawal and silence",
    element: "Water",
    zodiacSign: "Moon",
    imagePath: "/images/tarot/placeholders/02-high-priestess.svg",
  },
  // Add more major arcana cards as needed
];

// Minor Arcana Cards - Cups
export const cupsCards: TarotCard[] = [
  {
    id: 'ace-cups',
    name: 'Ace of Cups',
    arcana: 'minor',
    suit: 'cups',
    number: 1,
    keywords: ['love', 'new feelings', 'emotional awakening', 'creativity'],
    description: 'The Ace of Cups represents emotional new beginnings, intuition, intimacy, love, and deep feelings.',
    meaningUpright: 'New feelings, emotional awakening, creativity, intuition',
    meaningReversed: 'Emotional loss, blocked creativity, emptiness',
    element: 'Water',
    imagePath: '/images/tarot/placeholders/ace-cups.svg'
  },
  // Add more cups cards as needed
];

// Minor Arcana Cards - Swords
export const swordsCards: TarotCard[] = [
  {
    id: 'ace-swords',
    name: 'Ace of Swords',
    arcana: 'minor',
    suit: 'swords',
    number: 1,
    keywords: ['breakthrough', 'clarity', 'sharp mind', 'truth'],
    description: 'The Ace of Swords represents mental clarity, breakthrough ideas, truth, and justice.',
    meaningUpright: 'Breakthrough, clarity, sharp mind, truth',
    meaningReversed: 'Confusion, brutality, chaos, cloudiness',
    element: 'Air',
    imagePath: '/images/tarot/placeholders/ace-swords.svg'
  },
  // Add more swords cards as needed
];

// Minor Arcana Cards - Pentacles
export const pentaclesCards: TarotCard[] = [
  // Add pentacles cards as needed
];

// Minor Arcana Cards - Wands
export const wandsCards: TarotCard[] = [
  // Add wands cards as needed
];

// All Cards Combined
export const allTarotCards: TarotCard[] = [
  ...majorArcanaCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards,
  ...wandsCards
];

/**
 * Get a card by its ID
 */
export function getCardById(id: string): TarotCard | undefined {
  return allTarotCards.find(card => card.id === id);
}

/**
 * Get a random card
 */
export function getRandomCard(): TarotCard {
  const randomIndex = Math.floor(Math.random() * allTarotCards.length);
  return allTarotCards[randomIndex];
}

/**
 * Get a daily card based on the current date
 */
export function getDailyCard(): TarotCard {
  // Get today's date as string for consistent seeding
  const today = new Date().toISOString().split('T')[0];

  // Use the date string to seed a simple random number generator
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomIndex = seed % allTarotCards.length;

  return allTarotCards[randomIndex];
}

/**
 * Get cards by arcana
 */
export function getCardsByArcana(arcana: 'major' | 'minor'): TarotCard[] {
  return allTarotCards.filter(card => card.arcana === arcana);
}

/**
 * Get cards by suit
 */
export function getCardsBySuit(suit: 'cups' | 'pentacles' | 'swords' | 'wands'): TarotCard[] {
  return allTarotCards.filter(card => card.suit === suit);
}
