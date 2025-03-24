import OpenAI from "openai";
import { log } from "./vite";

// Initialize OpenAI with API key from environment variables
let openai: OpenAI;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    log("OpenAI client initialized successfully", "openai");
  } else {
    throw new Error("Missing OpenAI API key");
  }
} catch (error) {
  log(`Error initializing OpenAI client: ${error}`, "openai");
  // Create a mock client that will properly handle errors
  openai = new OpenAI({ apiKey: "mock-key" });
}

// Types for tarot cards
export interface TarotCard {
  name: string;
  arcana: "major" | "minor";
  suit?: string;
  number?: string;
  description: string;
  imageUrl: string;
  position?: string; // For multi-card spreads
  reversal?: boolean; // Whether the card is upright or reversed
}

// Major Arcana cards
export const majorArcana: TarotCard[] = [
  {
    name: "The Fool",
    arcana: "major",
    number: "0",
    description: "New beginnings, innocence, spontaneity",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-fool.png"
  },
  {
    name: "The Magician",
    arcana: "major",
    number: "I",
    description: "Manifestation, resourcefulness, power",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-magician.png"
  },
  {
    name: "The High Priestess",
    arcana: "major",
    number: "II",
    description: "Intuition, unconscious, inner voice",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-high-priestess.png"
  },
  {
    name: "The Empress",
    arcana: "major",
    number: "III",
    description: "Fertility, nurturing, abundance",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-empress.png"
  },
  {
    name: "The Emperor",
    arcana: "major",
    number: "IV",
    description: "Authority, structure, control",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-emperor.png"
  },
  {
    name: "The Hierophant",
    arcana: "major",
    number: "V",
    description: "Tradition, conformity, morality",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-hierophant.png"
  },
  {
    name: "The Lovers",
    arcana: "major",
    number: "VI",
    description: "Partnerships, duality, union",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-lovers.png"
  },
  {
    name: "The Chariot",
    arcana: "major",
    number: "VII",
    description: "Direction, control, willpower",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-chariot.png"
  },
  {
    name: "Strength",
    arcana: "major",
    number: "VIII",
    description: "Courage, patience, compassion",
    imageUrl: "https://www.trustedtarot.com/img/cards/strength.png"
  },
  {
    name: "The Hermit",
    arcana: "major",
    number: "IX",
    description: "Introspection, searching, guidance",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-hermit.png"
  },
  {
    name: "Wheel of Fortune",
    arcana: "major",
    number: "X",
    description: "Change, cycles, fate",
    imageUrl: "https://www.trustedtarot.com/img/cards/wheel-of-fortune.png"
  },
  {
    name: "Justice",
    arcana: "major",
    number: "XI",
    description: "Fairness, truth, cause and effect",
    imageUrl: "https://www.trustedtarot.com/img/cards/justice.png"
  },
  {
    name: "The Hanged Man",
    arcana: "major",
    number: "XII",
    description: "Surrender, new perspective, enlightenment",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-hanged-man.png"
  },
  {
    name: "Death",
    arcana: "major",
    number: "XIII",
    description: "Endings, change, transformation",
    imageUrl: "https://www.trustedtarot.com/img/cards/death.png"
  },
  {
    name: "Temperance",
    arcana: "major",
    number: "XIV",
    description: "Balance, moderation, patience",
    imageUrl: "https://www.trustedtarot.com/img/cards/temperance.png"
  },
  {
    name: "The Devil",
    arcana: "major",
    number: "XV",
    description: "Materialism, addiction, restriction",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-devil.png"
  },
  {
    name: "The Tower",
    arcana: "major",
    number: "XVI",
    description: "Sudden change, upheaval, revelation",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-tower.png"
  },
  {
    name: "The Star",
    arcana: "major",
    number: "XVII",
    description: "Hope, faith, rejuvenation",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-star.png"
  },
  {
    name: "The Moon",
    arcana: "major",
    number: "XVIII",
    description: "Illusion, fear, subconscious",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-moon.png"
  },
  {
    name: "The Sun",
    arcana: "major",
    number: "XIX",
    description: "Joy, success, celebration",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-sun.png"
  },
  {
    name: "Judgement",
    arcana: "major",
    number: "XX",
    description: "Reflection, reckoning, awakening",
    imageUrl: "https://www.trustedtarot.com/img/cards/judgement.png"
  },
  {
    name: "The World",
    arcana: "major",
    number: "XXI",
    description: "Completion, integration, accomplishment",
    imageUrl: "https://www.trustedtarot.com/img/cards/the-world.png"
  }
];

// Define available tarot spreads
export interface TarotSpread {
  name: string;
  description: string;
  cardCount: number;
}

export const tarotSpreads: TarotSpread[] = [
  {
    name: "single",
    description: "A single card for a quick insight",
    cardCount: 1
  },
  {
    name: "past-present-future",
    description: "Three-card spread showing past, present, and future influences",
    cardCount: 3
  },
  {
    name: "celtic-cross",
    description: "Ten-card spread for a comprehensive reading of a situation",
    cardCount: 10
  },
  {
    name: "zodiac-spread",
    description: "Twelve-card spread based on the houses of the zodiac, combining tarot and astrology",
    cardCount: 12
  }
];

// Minor Arcana - Wands (Fire)
export const wandsCards: TarotCard[] = [
  {
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    number: "1",
    description: "Creativity, inspiration, new opportunities",
    imageUrl: "https://www.trustedtarot.com/img/cards/ace-of-wands.png"
  },
  {
    name: "Two of Wands",
    arcana: "minor",
    suit: "wands",
    number: "2",
    description: "Planning, future vision, discovery",
    imageUrl: "https://www.trustedtarot.com/img/cards/two-of-wands.png"
  },
  {
    name: "Three of Wands",
    arcana: "minor",
    suit: "wands",
    number: "3",
    description: "Expansion, foresight, leadership",
    imageUrl: "https://www.trustedtarot.com/img/cards/three-of-wands.png"
  },
  {
    name: "Four of Wands",
    arcana: "minor",
    suit: "wands",
    number: "4",
    description: "Celebration, harmony, home",
    imageUrl: "https://www.trustedtarot.com/img/cards/four-of-wands.png"
  },
  {
    name: "Five of Wands",
    arcana: "minor",
    suit: "wands",
    number: "5",
    description: "Conflict, competition, tension",
    imageUrl: "https://www.trustedtarot.com/img/cards/five-of-wands.png"
  },
  {
    name: "Six of Wands",
    arcana: "minor",
    suit: "wands",
    number: "6",
    description: "Victory, recognition, progress",
    imageUrl: "https://www.trustedtarot.com/img/cards/six-of-wands.png"
  },
  {
    name: "Seven of Wands",
    arcana: "minor",
    suit: "wands",
    number: "7",
    description: "Challenge, defense, perseverance",
    imageUrl: "https://www.trustedtarot.com/img/cards/seven-of-wands.png"
  },
  {
    name: "Eight of Wands",
    arcana: "minor",
    suit: "wands",
    number: "8",
    description: "Speed, movement, rapid change",
    imageUrl: "https://www.trustedtarot.com/img/cards/eight-of-wands.png"
  },
  {
    name: "Nine of Wands",
    arcana: "minor",
    suit: "wands",
    number: "9",
    description: "Resilience, persistence, determination",
    imageUrl: "https://www.trustedtarot.com/img/cards/nine-of-wands.png"
  },
  {
    name: "Ten of Wands",
    arcana: "minor",
    suit: "wands",
    number: "10",
    description: "Burden, responsibility, hard work",
    imageUrl: "https://www.trustedtarot.com/img/cards/ten-of-wands.png"
  },
  {
    name: "Page of Wands",
    arcana: "minor",
    suit: "wands",
    number: "11",
    description: "Exploration, enthusiasm, discovery",
    imageUrl: "https://www.trustedtarot.com/img/cards/page-of-wands.png"
  },
  {
    name: "Knight of Wands",
    arcana: "minor",
    suit: "wands",
    number: "12",
    description: "Action, adventure, impulsiveness",
    imageUrl: "https://www.trustedtarot.com/img/cards/knight-of-wands.png"
  },
  {
    name: "Queen of Wands",
    arcana: "minor",
    suit: "wands",
    number: "13",
    description: "Courage, confidence, vivacious",
    imageUrl: "https://www.trustedtarot.com/img/cards/queen-of-wands.png"
  },
  {
    name: "King of Wands",
    arcana: "minor",
    suit: "wands",
    number: "14",
    description: "Leadership, vision, entrepreneurial",
    imageUrl: "https://www.trustedtarot.com/img/cards/king-of-wands.png"
  }
];

// Minor Arcana - Cups (Water)
export const cupsCards: TarotCard[] = [
  {
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    number: "1",
    description: "New emotions, intuition, intimacy",
    imageUrl: "https://www.trustedtarot.com/img/cards/ace-of-cups.png"
  },
  {
    name: "Two of Cups",
    arcana: "minor",
    suit: "cups",
    number: "2",
    description: "Connection, partnership, mutual attraction",
    imageUrl: "https://www.trustedtarot.com/img/cards/two-of-cups.png"
  },
  {
    name: "Three of Cups",
    arcana: "minor",
    suit: "cups",
    number: "3",
    description: "Celebration, friendship, collaboration",
    imageUrl: "https://www.trustedtarot.com/img/cards/three-of-cups.png"
  },
  {
    name: "Four of Cups",
    arcana: "minor",
    suit: "cups",
    number: "4",
    description: "Meditation, contemplation, apathy",
    imageUrl: "https://www.trustedtarot.com/img/cards/four-of-cups.png"
  },
  {
    name: "Five of Cups",
    arcana: "minor",
    suit: "cups",
    number: "5",
    description: "Loss, regret, disappointment",
    imageUrl: "https://www.trustedtarot.com/img/cards/five-of-cups.png"
  },
  {
    name: "Six of Cups",
    arcana: "minor",
    suit: "cups",
    number: "6",
    description: "Nostalgia, memories, reunion",
    imageUrl: "https://www.trustedtarot.com/img/cards/six-of-cups.png"
  },
  {
    name: "Seven of Cups",
    arcana: "minor",
    suit: "cups",
    number: "7",
    description: "Choices, fantasy, illusion",
    imageUrl: "https://www.trustedtarot.com/img/cards/seven-of-cups.png"
  },
  {
    name: "Eight of Cups",
    arcana: "minor",
    suit: "cups",
    number: "8",
    description: "Walking away, disillusionment, seeking truth",
    imageUrl: "https://www.trustedtarot.com/img/cards/eight-of-cups.png"
  },
  {
    name: "Nine of Cups",
    arcana: "minor",
    suit: "cups",
    number: "9",
    description: "Contentment, satisfaction, emotional fulfillment",
    imageUrl: "https://www.trustedtarot.com/img/cards/nine-of-cups.png"
  },
  {
    name: "Ten of Cups",
    arcana: "minor",
    suit: "cups",
    number: "10",
    description: "Harmony, happiness, family fulfillment",
    imageUrl: "https://www.trustedtarot.com/img/cards/ten-of-cups.png"
  },
  {
    name: "Page of Cups",
    arcana: "minor",
    suit: "cups",
    number: "11",
    description: "Creativity, sensitivity, new emotions",
    imageUrl: "https://www.trustedtarot.com/img/cards/page-of-cups.png"
  },
  {
    name: "Knight of Cups",
    arcana: "minor",
    suit: "cups",
    number: "12",
    description: "Romance, charm, imagination",
    imageUrl: "https://www.trustedtarot.com/img/cards/knight-of-cups.png"
  },
  {
    name: "Queen of Cups",
    arcana: "minor",
    suit: "cups",
    number: "13",
    description: "Compassion, empathy, emotional stability",
    imageUrl: "https://www.trustedtarot.com/img/cards/queen-of-cups.png"
  },
  {
    name: "King of Cups",
    arcana: "minor",
    suit: "cups",
    number: "14",
    description: "Emotional balance, wisdom, diplomatic",
    imageUrl: "https://www.trustedtarot.com/img/cards/king-of-cups.png"
  }
];

// Minor Arcana - Swords (Air)
export const swordsCards: TarotCard[] = [
  {
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    number: "1",
    description: "Clarity, breakthrough, new perspective",
    imageUrl: "https://www.trustedtarot.com/img/cards/ace-of-swords.png"
  },
  {
    name: "Two of Swords",
    arcana: "minor",
    suit: "swords",
    number: "2",
    description: "Difficult choice, stalemate, denial",
    imageUrl: "https://www.trustedtarot.com/img/cards/two-of-swords.png"
  },
  {
    name: "Three of Swords",
    arcana: "minor",
    suit: "swords",
    number: "3",
    description: "Heartbreak, sorrow, grief",
    imageUrl: "https://www.trustedtarot.com/img/cards/three-of-swords.png"
  },
  {
    name: "Four of Swords",
    arcana: "minor",
    suit: "swords",
    number: "4",
    description: "Rest, recuperation, contemplation",
    imageUrl: "https://www.trustedtarot.com/img/cards/four-of-swords.png"
  },
  {
    name: "Five of Swords",
    arcana: "minor",
    suit: "swords",
    number: "5",
    description: "Conflict, tension, defeat",
    imageUrl: "https://www.trustedtarot.com/img/cards/five-of-swords.png"
  },
  {
    name: "Six of Swords",
    arcana: "minor",
    suit: "swords",
    number: "6",
    description: "Transition, change, moving away",
    imageUrl: "https://www.trustedtarot.com/img/cards/six-of-swords.png"
  },
  {
    name: "Seven of Swords",
    arcana: "minor",
    suit: "swords",
    number: "7",
    description: "Deception, strategy, cleverness",
    imageUrl: "https://www.trustedtarot.com/img/cards/seven-of-swords.png"
  },
  {
    name: "Eight of Swords",
    arcana: "minor",
    suit: "swords",
    number: "8",
    description: "Feeling trapped, restriction, imprisonment",
    imageUrl: "https://www.trustedtarot.com/img/cards/eight-of-swords.png"
  },
  {
    name: "Nine of Swords",
    arcana: "minor",
    suit: "swords",
    number: "9",
    description: "Anxiety, fear, nightmares",
    imageUrl: "https://www.trustedtarot.com/img/cards/nine-of-swords.png"
  },
  {
    name: "Ten of Swords",
    arcana: "minor",
    suit: "swords",
    number: "10",
    description: "Painful ending, deep wounds, betrayal",
    imageUrl: "https://www.trustedtarot.com/img/cards/ten-of-swords.png"
  },
  {
    name: "Page of Swords",
    arcana: "minor",
    suit: "swords",
    number: "11",
    description: "Curiosity, intellect, vigilance",
    imageUrl: "https://www.trustedtarot.com/img/cards/page-of-swords.png"
  },
  {
    name: "Knight of Swords",
    arcana: "minor",
    suit: "swords",
    number: "12",
    description: "Assertiveness, direct action, intellectual",
    imageUrl: "https://www.trustedtarot.com/img/cards/knight-of-swords.png"
  },
  {
    name: "Queen of Swords",
    arcana: "minor",
    suit: "swords",
    number: "13",
    description: "Independent, clear thinking, perceptive",
    imageUrl: "https://www.trustedtarot.com/img/cards/queen-of-swords.png"
  },
  {
    name: "King of Swords",
    arcana: "minor",
    suit: "swords",
    number: "14",
    description: "Authority, truth, logical thinking",
    imageUrl: "https://www.trustedtarot.com/img/cards/king-of-swords.png"
  }
];

// Minor Arcana - Pentacles (Earth)
export const pentaclesCards: TarotCard[] = [
  {
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "1",
    description: "New financial opportunity, prosperity, abundance",
    imageUrl: "https://www.trustedtarot.com/img/cards/ace-of-pentacles.png"
  },
  {
    name: "Two of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "2",
    description: "Balance, adaptability, juggling priorities",
    imageUrl: "https://www.trustedtarot.com/img/cards/two-of-pentacles.png"
  },
  {
    name: "Three of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "3",
    description: "Teamwork, collaboration, learning",
    imageUrl: "https://www.trustedtarot.com/img/cards/three-of-pentacles.png"
  },
  {
    name: "Four of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "4",
    description: "Security, conservation, frugality",
    imageUrl: "https://www.trustedtarot.com/img/cards/four-of-pentacles.png"
  },
  {
    name: "Five of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "5",
    description: "Hardship, loss, isolation",
    imageUrl: "https://www.trustedtarot.com/img/cards/five-of-pentacles.png"
  },
  {
    name: "Six of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "6",
    description: "Generosity, charity, giving/receiving",
    imageUrl: "https://www.trustedtarot.com/img/cards/six-of-pentacles.png"
  },
  {
    name: "Seven of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "7",
    description: "Assessment, patience, long-term view",
    imageUrl: "https://www.trustedtarot.com/img/cards/seven-of-pentacles.png"
  },
  {
    name: "Eight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "8",
    description: "Diligence, craftsmanship, skill development",
    imageUrl: "https://www.trustedtarot.com/img/cards/eight-of-pentacles.png"
  },
  {
    name: "Nine of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "9",
    description: "Luxury, self-sufficiency, financial independence",
    imageUrl: "https://www.trustedtarot.com/img/cards/nine-of-pentacles.png"
  },
  {
    name: "Ten of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "10",
    description: "Wealth, inheritance, family legacy",
    imageUrl: "https://www.trustedtarot.com/img/cards/ten-of-pentacles.png"
  },
  {
    name: "Page of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "11",
    description: "Studiousness, learning, practical magic",
    imageUrl: "https://www.trustedtarot.com/img/cards/page-of-pentacles.png"
  },
  {
    name: "Knight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "12",
    description: "Hard work, responsibility, reliability",
    imageUrl: "https://www.trustedtarot.com/img/cards/knight-of-pentacles.png"
  },
  {
    name: "Queen of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "13",
    description: "Nurturing, practical, provider",
    imageUrl: "https://www.trustedtarot.com/img/cards/queen-of-pentacles.png"
  },
  {
    name: "King of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "14",
    description: "Abundance, prosperity, security",
    imageUrl: "https://www.trustedtarot.com/img/cards/king-of-pentacles.png"
  }
];

// Create complete tarot deck
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards
];

// Helper function to get a random tarot card
export function getRandomCard(): TarotCard {
  const randomIndex = Math.floor(Math.random() * allTarotCards.length);
  const card = { ...allTarotCards[randomIndex] };
  // 20% chance of reversal
  card.reversal = Math.random() < 0.2;
  return card;
}

// Helper function to get multiple random cards
export function getRandomCards(count: number): TarotCard[] {
  // Create a copy of the cards array to avoid duplicates
  const cardsCopy = [...allTarotCards];
  const selectedCards: TarotCard[] = [];
  
  // Get the positions for different spreads
  const positions = getPositionsForSpread(count);
  
  for (let i = 0; i < count; i++) {
    if (cardsCopy.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * cardsCopy.length);
    const card = { ...cardsCopy[randomIndex] };
    
    // 20% chance of reversal
    card.reversal = Math.random() < 0.2;
    
    // Add position if available
    if (positions[i]) {
      card.position = positions[i];
    }
    
    selectedCards.push(card);
    cardsCopy.splice(randomIndex, 1);
  }
  
  return selectedCards;
}

// Helper function to define card positions based on the spread
function getPositionsForSpread(cardCount: number): string[] {
  if (cardCount === 1) {
    return ["Present Situation"];
  } else if (cardCount === 3) {
    return ["Past", "Present", "Future"];
  } else if (cardCount === 10) {
    return [
      "Present Situation",
      "Immediate Challenge",
      "Distant Past",
      "Recent Past",
      "Best Outcome",
      "Immediate Future",
      "Factors Affecting the Situation",
      "External Influences",
      "Hopes or Fears",
      "Final Outcome"
    ];
  } else if (cardCount === 12) {
    // Zodiac Spread - one card for each astrological house
    return [
      "1st House - Self & Identity",
      "2nd House - Wealth & Values",
      "3rd House - Communication & Learning",
      "4th House - Home & Family",
      "5th House - Creativity & Pleasure",
      "6th House - Health & Service",
      "7th House - Partnerships & Relationships",
      "8th House - Transformation & Shared Resources",
      "9th House - Higher Learning & Exploration",
      "10th House - Career & Public Image",
      "11th House - Community & Aspirations",
      "12th House - Spirituality & Subconscious"
    ];
  }
  
  // Default: return empty positions
  return Array(cardCount).fill("");
}

// Get a specific spread by name
export function getSpread(spreadName: string): TarotSpread | undefined {
  return tarotSpreads.find(s => s.name === spreadName);
}

// Get a basic interpretation for a card
export function getBasicInterpretation(card: TarotCard): string {
  const orientation = card.reversal ? "reversed" : "upright";
  
  // Different interpretations based on orientation
  if (card.name === "The Fool" && !card.reversal) {
    return "The Fool represents new beginnings, innocence, and taking a leap of faith. It suggests you may be at the start of a new journey or phase in life.";
  } else if (card.name === "The Fool" && card.reversal) {
    return "The reversed Fool suggests recklessness, poor decisions, or fear of taking necessary risks. It may indicate that you're hesitating when you should move forward.";
  }
  
  // Default interpretation based on card description
  return `The ${card.name} (${orientation}) represents ${card.description}. This suggests ${orientation === "upright" ? "positive" : "challenging"} aspects related to these themes in your life.`;
}

// Define zodiac signs
export const zodiacSigns = [
  { sign: "Aries", element: "Fire", dates: "March 21 - April 19" },
  { sign: "Taurus", element: "Earth", dates: "April 20 - May 20" },
  { sign: "Gemini", element: "Air", dates: "May 21 - June 20" },
  { sign: "Cancer", element: "Water", dates: "June 21 - July 22" },
  { sign: "Leo", element: "Fire", dates: "July 23 - August 22" },
  { sign: "Virgo", element: "Earth", dates: "August 23 - September 22" },
  { sign: "Libra", element: "Air", dates: "September 23 - October 22" },
  { sign: "Scorpio", element: "Water", dates: "October 23 - November 21" },
  { sign: "Sagittarius", element: "Fire", dates: "November 22 - December 21" },
  { sign: "Capricorn", element: "Earth", dates: "December 22 - January 19" },
  { sign: "Aquarius", element: "Air", dates: "January 20 - February 18" },
  { sign: "Pisces", element: "Water", dates: "February 19 - March 20" }
];

// Generate a zodiac spread that maps cards to astrological houses
export async function generateZodiacSpread(birthChart?: Record<string, { sign: string; degree: number }>, isPremium: boolean = false): Promise<TarotCard[]> {
  try {
    // Start with the basic 12 cards for the 12 houses
    const cardsCopy = [...allTarotCards];
    const selectedCards: TarotCard[] = [];
    
    // Get positions for the zodiac spread
    const positions = getPositionsForSpread(12);
    
    // If we have a birth chart, try to choose cards that relate to the signs in the chart
    if (birthChart && Object.keys(birthChart).length > 0) {
      // Map each house to a thematically appropriate card
      for (let i = 0; i < 12; i++) {
        // For enhanced selection process for premium users
        if (isPremium) {
          // Find cards that match the element of the zodiac sign at each house cusp
          // This is a simplified version - a real implementation would do deeper analysis
          const houseNumber = i + 1;
          const position = positions[i];
          let card: TarotCard | undefined;
          
          // Simplified example: choose cards based on element affinity
          // In a real implementation, this would use the actual birth chart house cusps
          if (houseNumber % 4 === 1) { // Fire houses (1, 5, 9)
            // Get a fire-related card (Wands or fire-related Major Arcana)
            const fireCards = cardsCopy.filter(c => c.suit === "wands" || 
              (c.arcana === "major" && ["The Emperor", "Strength", "The Sun"].includes(c.name)));
            if (fireCards.length > 0) {
              const index = Math.floor(Math.random() * fireCards.length);
              card = fireCards[index];
              cardsCopy.splice(cardsCopy.indexOf(card), 1);
            }
          } else if (houseNumber % 4 === 2) { // Earth houses (2, 6, 10)
            // Get an earth-related card (Pentacles or earth-related Major Arcana)
            const earthCards = cardsCopy.filter(c => c.suit === "pentacles" || 
              (c.arcana === "major" && ["The Hierophant", "The Devil", "The World"].includes(c.name)));
            if (earthCards.length > 0) {
              const index = Math.floor(Math.random() * earthCards.length);
              card = earthCards[index];
              cardsCopy.splice(cardsCopy.indexOf(card), 1);
            }
          } else if (houseNumber % 4 === 3) { // Air houses (3, 7, 11)
            // Get an air-related card (Swords or air-related Major Arcana)
            const airCards = cardsCopy.filter(c => c.suit === "swords" || 
              (c.arcana === "major" && ["The Lovers", "Justice", "The Star"].includes(c.name)));
            if (airCards.length > 0) {
              const index = Math.floor(Math.random() * airCards.length);
              card = airCards[index];
              cardsCopy.splice(cardsCopy.indexOf(card), 1);
            }
          } else { // Water houses (4, 8, 12)
            // Get a water-related card (Cups or water-related Major Arcana)
            const waterCards = cardsCopy.filter(c => c.suit === "cups" || 
              (c.arcana === "major" && ["The High Priestess", "Death", "The Moon"].includes(c.name)));
            if (waterCards.length > 0) {
              const index = Math.floor(Math.random() * waterCards.length);
              card = waterCards[index];
              cardsCopy.splice(cardsCopy.indexOf(card), 1);
            }
          }
          
          // If we couldn't find a suitable elemental card, choose a random one
          if (!card && cardsCopy.length > 0) {
            const index = Math.floor(Math.random() * cardsCopy.length);
            card = cardsCopy[index];
            cardsCopy.splice(index, 1);
          }
          
          if (card) {
            // 20% chance of reversal
            card.reversal = Math.random() < 0.2;
            card.position = position;
            selectedCards.push(card);
          }
        } else {
          // For non-premium users: simple random selection
          if (cardsCopy.length > 0) {
            const index = Math.floor(Math.random() * cardsCopy.length);
            const card = { ...cardsCopy[index] };
            // 20% chance of reversal
            card.reversal = Math.random() < 0.2;
            card.position = positions[i];
            selectedCards.push(card);
            cardsCopy.splice(index, 1);
          }
        }
      }
    } else {
      // No birth chart data available, fall back to random selection
      for (let i = 0; i < 12; i++) {
        if (cardsCopy.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * cardsCopy.length);
        const card = { ...cardsCopy[randomIndex] };
        
        // 20% chance of reversal
        card.reversal = Math.random() < 0.2;
        card.position = positions[i];
        
        selectedCards.push(card);
        cardsCopy.splice(randomIndex, 1);
      }
    }
    
    return selectedCards;
  } catch (error) {
    log(`Error generating zodiac spread: ${error}`, "openai");
    // In case of error, generate a simple spread with random cards
    return getRandomCards(12);
  }
}

// Generate a tarot reading interpretation using OpenAI
export async function generateTarotReading(cards: TarotCard[], question?: string, spread: string = "single", isPremium: boolean = false): Promise<{interpretation: string, aiInsight?: string}> {
  try {
    // Format the cards information for the prompt
    const cardsInfo = cards.map(card => {
      const orientation = card.reversal ? "reversed" : "upright";
      const position = card.position ? `(${card.position})` : "";
      return `- ${card.name} ${position}: ${orientation}, representing ${card.description}`;
    }).join("\n");
    
    // Create prompt based on spread type and question
    let prompt = `Please provide a tarot reading interpretation for the following cards in a ${spread} spread:\n\n${cardsInfo}\n\n`;
    
    if (question) {
      prompt += `The querent's question is: "${question}"\n\n`;
    }
    
    prompt += "Give an insightful interpretation that connects the cards to each other and provides meaningful guidance. Format the response in clear paragraphs with an overall summary at the end.";
    
    // Use GPT-4o model for interpretation
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    const interpretation = response.choices[0].message.content || "Unable to generate interpretation.";
    
    // For premium users, generate an additional AI insight
    let aiInsight;
    if (isPremium) {
      const premiumPrompt = `Based on this tarot spread:\n\n${cardsInfo}\n\n${question ? `Question: "${question}"\n\n` : ""}Please provide deeper psychological insights and spiritual guidance that goes beyond the standard interpretation. Include specific action steps, potential shadow work, and higher spiritual lessons that can be derived from this reading. Focus on personal growth and transformation.`;
      
      const premiumResponse = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: premiumPrompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      aiInsight = premiumResponse.choices[0].message.content || null;
    }
    
    return { interpretation, aiInsight };
  } catch (error) {
    log(`Error generating tarot reading: ${error}`, "openai");
    return { interpretation: "I'm sorry, but I couldn't generate a reading at this time. Please try again later." };
  }
}

// Generate a daily horoscope for a zodiac sign
export async function generateDailyHoroscope(sign: string, isPremium: boolean = false): Promise<{horoscope: string, premiumInsight?: string}> {
  try {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const prompt = `Create a thoughtful daily horoscope for ${sign} for today, ${today}. Include insights about career, relationships, and personal growth. Keep it positive but realistic, and provide actionable advice.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const horoscope = response.choices[0].message.content || "Unable to generate horoscope.";
    
    // For premium users, generate additional content
    let premiumInsight;
    if (isPremium) {
      const premiumPrompt = `For ${sign} today (${today}), provide a premium astrological insight that includes:
1. A detailed analysis of current planetary positions specifically affecting ${sign}
2. Personal growth opportunities based on these alignments
3. Potential challenges to watch for and how to navigate them
4. A specific meditation or mindfulness practice tailored for ${sign} today
5. Lucky numbers, colors, and times for today

Make this exclusive content notably more detailed and personalized than a standard horoscope.`;
      
      const premiumResponse = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: premiumPrompt }],
        max_tokens: 700,
        temperature: 0.7,
      });
      
      premiumInsight = premiumResponse.choices[0].message.content || null;
    }
    
    return { horoscope, premiumInsight };
  } catch (error) {
    log(`Error generating horoscope: ${error}`, "openai");
    return { horoscope: "I'm sorry, but I couldn't generate a horoscope at this time. Please try again later." };
  }
}

// Generate a compatibility reading between two zodiac signs
export async function generateCompatibilityReading(sign1: string, sign2: string): Promise<string> {
  try {
    const prompt = `Create a detailed zodiac compatibility reading for ${sign1} and ${sign2}. Include insights about:
1. Overall compatibility rating (out of 10)
2. Communication style compatibility
3. Emotional connection potential
4. Potential areas of conflict
5. Areas where they complement each other
6. Tips for making the relationship harmonious

Provide thoughtful analysis that takes into account each sign's element, modality, and ruling planet.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content || "Unable to generate compatibility reading.";
  } catch (error) {
    log(`Error generating compatibility reading: ${error}`, "openai");
    return "I'm sorry, but I couldn't generate a compatibility reading at this time. Please try again later.";
  }
}

// Generate birth chart interpretation
export async function generateBirthChartInterpretation(
  chartData: {
    name?: string;
    subject: string;
    date: string;
    time?: string | null;
    location: string;
    positions: any; // Using 'any' temporarily to avoid TypeScript errors
  }
): Promise<string> {
  try {
    // Validate input data
    if (!chartData.subject) {
      throw new Error("Missing required chart data: subject");
    }
    
    if (!chartData.date) {
      throw new Error("Missing required chart data: birth date");
    }
    
    if (!chartData.location) {
      throw new Error("Missing required chart data: birth location");
    }
    
    if (!chartData.positions) {
      throw new Error("Missing required chart data: planetary positions");
    }

    // Safely format planetary positions for the prompt with error handling
    const positions = Object.entries(chartData.positions)
      .filter(([_, data]) => data && typeof data === 'object' && 'sign' in data && 'degree' in data)
      .map(([planet, data]) => {
        // Safely access properties with nullish coalescing
        const sign = data.sign || "Unknown";
        const degree = typeof data.degree === 'number' ? data.degree : 0;
        return `${planet.charAt(0).toUpperCase() + planet.slice(1)}: ${sign} ${degree}°`;
      })
      .join("\n");
    
    const nameToUse = chartData.name || chartData.subject;
    
    const prompt = `Generate a detailed birth chart interpretation for ${nameToUse}, born on ${chartData.date} at ${chartData.time || "unknown time"} in ${chartData.location}. 

Planetary Positions:
${positions}

Please include in your interpretation:
1. Sun Sign Analysis: Core personality traits and life purpose
2. Moon Sign Analysis: Emotional nature and unconscious patterns
3. Ascendant/Rising Sign (assuming it's in the positions): Outward demeanor and approach to the world
4. Analysis of significant planetary aspects and what they suggest
5. Key themes and life lessons based on the chart
6. Potential strengths and challenges indicated by this chart

Provide a thoughtful, insightful, and nuanced reading that helps the person understand their unique astrological blueprint.`;
    
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      log("OPENAI_API_KEY is not set in environment variables", "openai");
      throw new Error("OpenAI API key is not configured");
    }
    
    // Set a timeout for the API call
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request to OpenAI timed out")), 60000);
    });
    
    // Make the API call with a timeout
    log(`Attempting to call OpenAI API for birth chart interpretation...`, "openai");
    const apiCallPromise = openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Fallback to a more reliable model since gpt-4o might be having issues
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });
    
    // Race the API call against the timeout
    log(`Waiting for OpenAI API response...`, "openai");
    const response = await Promise.race([apiCallPromise, timeoutPromise]) as any;
    log(`Received response from OpenAI API`, "openai");
    
    if (!response.choices || response.choices.length === 0 || !response.choices[0].message) {
      throw new Error("Received invalid response from OpenAI API");
    }
    
    const content = response.choices[0].message.content;
    
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      throw new Error("OpenAI returned empty content");
    }
    
    return content;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log the full error details including stack trace
    if (error instanceof Error && error.stack) {
      log(`Error generating birth chart interpretation: ${errorMessage}\nStack trace: ${error.stack}`, "openai");
    } else {
      log(`Error generating birth chart interpretation: ${errorMessage}`, "openai");
    }
    
    // Additional logging for OpenAI-specific errors
    if (error && typeof error === 'object' && 'status' in error) {
      log(`OpenAI API error status: ${error.status}`, "openai");
    }
    
    if (error && typeof error === 'object' && 'response' in error && error.response) {
      try {
        log(`OpenAI API response data: ${JSON.stringify(error.response)}`, "openai");
      } catch (jsonError) {
        log(`Failed to stringify OpenAI error response`, "openai");
      }
    }
    
    // Return specific error messages for different error types
    if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
      return "Error: The service is currently unavailable due to configuration issues. Please contact support.";
    } else if (errorMessage.includes("Missing required")) {
      return "Error: Insufficient information provided for birth chart generation. Please ensure all required fields are completed.";
    } else if (errorMessage.includes("timed out")) {
      return "Error: The request took too long to process. Please try again later when the system is less busy.";
    } else if (errorMessage.includes("rate limit")) {
      return "Error: We're experiencing high demand right now. Please try again in a few minutes.";
    } else {
      return "Error: I couldn't generate a birth chart interpretation at this time. Please try again later. (Error details: " + errorMessage.substring(0, 100) + ")";
    }
  }
}