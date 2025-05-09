import React, { useState } from 'react';
import { TarotCard } from '@client/data/tarot-cards';
import { getTarotCardImagePath, getFallbackImagePath, handleTarotImageError } from '../../utils/tarot-utils';

interface TarotCardImageProps {
  card: TarotCard;
  className?: string;
  alt?: string;
  isReversed?: boolean;
  onClick?: () => void;
}

/**
 * TarotCardImage Component
 * 
 * A wrapper component for tarot card images that handles loading errors
 * and provides fallbacks when images can't be loaded.
 */
const TarotCardImage: React.FC<TarotCardImageProps> = ({
  card,
  className = '',
  alt,
  isReversed = false,
  onClick,
}) => {
  const [imagePath, setImagePath] = useState<string>(getTarotCardImagePath(card));
  const [hasError, setHasError] = useState<boolean>(false);

  // Handle image loading error
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      handleTarotImageError(card, (fallbackPath) => {
        setImagePath(getFallbackImagePath(card));
      });
    }
  };

  return (
    <img
      src={imagePath}
      alt={alt || `${card.name} Tarot Card`}
      className={`tarot-card-image ${isReversed ? 'reversed' : ''} ${className}`}
      style={{
        transform: isReversed ? 'rotate(180deg)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onError={handleError}
      onClick={onClick}
    />
  );
};

export default TarotCardImage;
