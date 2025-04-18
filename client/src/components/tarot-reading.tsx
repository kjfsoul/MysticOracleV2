import React from 'react';
import { TarotCard } from "@client/data/tarot-cards";
import { getTarotCardImagePath } from "@client/utils/tarot-utils";

interface TarotReadingProps {
  cards: TarotCard[];
}

export const TarotReading: React.FC<TarotReadingProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-3 gap-8 p-8">
      {cards.map((card: TarotCard) => (
        <div key={card.id} className="relative group">
          <img 
            src={getTarotCardImagePath(card)}
            alt={card.name}
            className="w-64 h-96 object-cover rounded-lg shadow-xl transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 text-white rounded-b-lg">
            <h3 className="text-xl font-mystic">{card.name}</h3>
            <p className="text-sm">{card.keywords.join(' • ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
