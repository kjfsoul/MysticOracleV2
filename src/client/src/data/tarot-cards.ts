export interface TarotCard {
  id: string;
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

export const allTarotCards: TarotCard[] = [];
