
import React from 'react';
import { TarotCard as TarotCardType } from '../../data/tarot-data';

type TarotCardMiniProps = {
  card: TarotCardType;
  isFlipped: boolean;
  miniVersion?: boolean;
};

export const TarotCardMini: React.FC<TarotCardMiniProps> = ({ 
  card, 
  isFlipped,
}) => {
  const cardBackStyle = {
    backgroundImage: `url('/images/tarot/card-back.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      className="tarot-card-mini relative w-full aspect-[2/3] rounded-md overflow-hidden shadow-md"
    >
      <div className="absolute w-full h-full transition-transform duration-500">
        {isFlipped ? (
          <div className="w-full h-full p-1">
            <div className="w-full h-full bg-white rounded overflow-hidden flex flex-col">
              <img 
                src={card.image} 
                alt={card.name} 
                className="object-contain flex-grow"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/150?text=' + card.name;
                }}
              />
              <div className="text-center py-1 text-xs bg-gray-100 truncate">
                {card.name}
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center bg-indigo-900 rounded" 
            style={cardBackStyle}
          >
          </div>
        )}
      </div>
    </div>
  );
};
