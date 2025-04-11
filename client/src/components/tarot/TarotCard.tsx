import React, { useState, useEffect } from 'react';
import { TarotCard as TarotCardType } from '@/types/tarot';
import { TarotAssetService } from '@/services/tarot-asset-service';

interface TarotCardProps {
  card: TarotCardType;
  isReversed?: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TarotCard({
  card,
  isReversed = false,
  isFlipped = false,
  onFlip,
  size = 'md',
  className = '',
}: TarotCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const assetService = TarotAssetService.getInstance();

  useEffect(() => {
    const path = assetService.getCardImagePath(card);
    setImagePath(path);
  }, [card]);

  const handleImageError = () => {
    const fallbackPath = assetService.getFallbackPath(card);
    setImagePath(fallbackPath);
  };

  const sizeClasses = {
    sm: 'w-32 h-48',
    md: 'w-48 h-72',
    lg: 'w-64 h-96',
  };

  return (
    <div 
      className={`relative transform-style-3d transition-transform duration-700 ${sizeClasses[size]} ${className}`}
      onClick={onFlip}
    >
      <div 
        className={`absolute w-full h-full backface-hidden ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {isFlipped ? (
          <img
            src={imagePath}
            alt={card.name}
            className={`w-full h-full object-contain rounded-lg ${
              isReversed ? 'rotate-180' : ''
            }`}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <img
            src={assetService.getCardBackPath()}
            alt="Card Back"
            className="w-full h-full object-contain rounded-lg"
          />
        )}
      </div>
    </div>
  );
}