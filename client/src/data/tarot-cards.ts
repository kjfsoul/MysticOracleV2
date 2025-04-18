export interface TarotCard {
  id: string;
  imageId: string;
  normalizedName: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  meaningUpright: string;
  meaningReversed: string;
  keywords: string[];
  imagePath: string;
  element?: string;
  zodiacSign?: string;
  astrologicalSign?: string;
  planet?: string;
}

export const allTarotCards: TarotCard[] = [
  {
    id: "fool",
    imageId: "000",
    normalizedName: "the-fool",
    name: "The Fool",
    arcana: "major",
    meaningUpright: "New beginnings, spontaneity, free spirit",
    meaningReversed: "Recklessness, naivety, poor planning",
    keywords: ["innocence", "adventure", "potential"],
    imagePath: "/images/tarot/decks/rider-waite/fool.webp",
    element: "Air",
    zodiacSign: "Aquarius",
    astrologicalSign: "Uranus",
    planet: "Mercury"
  },
  {
    id: "magician",
    imageId: "001",
    normalizedName: "the-magician",
    name: "The Magician",
    arcana: "major", 
    meaningUpright: "Manifestation, resourcefulness, power",
    meaningReversed: "Manipulation, untapped talents",
    keywords: ["willpower", "creation", "manifestation"],
    imagePath: "/images/tarot/decks/rider-waite/magician.webp",
    element: "Fire",
    zodiacSign: "Mercury",
    astrologicalSign: "Gemini",
    planet: "Mercury"
  },
  {
    id: "high-priestess",
    imageId: "002",
    normalizedName: "high-priestess",
    name: "High Priestess",
    arcana: "major",
    meaningUpright: "Intuition, mystery, subconscious",
    meaningReversed: "Secrets, hidden agendas",
    keywords: ["intuition", "mystery", "divine knowledge"],
    imagePath: "/images/tarot/decks/rider-waite/high-priestess.webp",
    element: "Water",
    zodiacSign: "Moon",
    astrologicalSign: "Cancer",
    planet: "Moon"
  }
];
