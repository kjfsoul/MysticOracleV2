import React, { useState } from 'react';
import { TarotCard } from '@/data/tarot-cards';
import { getTarotCardImagePath, handleTarotImageError } from '@/utils/tarot-utils';

interface TarotCardImageProps {
  card: TarotCard;
  className?: string;
  alt?: string;
  isReversed?: boolean;
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
}) => {
  const [imagePath, setImagePath] = useState<string>(getTarotCardImagePath(card));
  const [hasError, setHasError] = useState<boolean>(false);

  // Handle image loading error
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      handleTarotImageError(card, (fallbackPath) => {
        setImagePath(fallbackPath);
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
      }}
      onError={handleError}
    />
  );
};

export default TarotCardImage;
