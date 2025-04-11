export type Arcana = 'major' | 'minor';
export type Suit = 'cups' | 'pentacles' | 'swords' | 'wands';

export interface TarotCard {
  id: string;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  number: number | string;
  keywords: string[];
  meanings: {
    upright: string;
    reversed: string;
  };
  associations?: {
    element?: string;
    zodiac?: string;
  };
}

export interface TarotDeck {
  id: string;
  name: string;
  description: string;
  cards: TarotCard[];
  assets: {
    basePath: string;
    cardBack: string;
  };
}