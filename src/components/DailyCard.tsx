import React, { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface DailyCardProps {
  cardImage: string;
  cardName: string;
  interpretation: string;
}

export const DailyCard: React.FC<DailyCardProps> = ({
  cardImage,
  cardName,
  interpretation
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className="tarot-card"
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`${cardName} card. Press Enter to flip.`}
    >
      <div 
        className="card-inner"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'none',
          transition: prefersReducedMotion ? 'none' : 'transform 0.6s'
        }}
      >
        <div className="card-front">
          <img src={cardImage} alt={cardName} />
        </div>
        <div className="card-back">
          <h3>{cardName}</h3>
          <p>{interpretation}</p>
        </div>
      </div>
    </div>
  );
};