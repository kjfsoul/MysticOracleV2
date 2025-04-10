import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TarotCard } from '@/data/tarot-cards';
import AnimatedTarotCard from './animated-tarot-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface TarotSpreadPosition {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  rotation?: number;
}

interface TarotSpreadProps {
  cards: (TarotCard & { isReversed?: boolean })[];
  spreadType: 'three-card' | 'celtic-cross' | 'horseshoe' | 'custom';
  customPositions?: TarotSpreadPosition[];
  title?: string;
  description?: string;
  onComplete?: () => void;
  className?: string;
}

/**
 * TarotSpread Component
 * 
 * Displays a tarot card spread with animations and position-specific meanings.
 */
const TarotSpread: React.FC<TarotSpreadProps> = ({
  cards,
  spreadType,
  customPositions,
  title,
  description,
  onComplete,
  className = '',
}) => {
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  
  // Define spread positions based on spreadType
  const getSpreadPositions = (): TarotSpreadPosition[] => {
    switch (spreadType) {
      case 'three-card':
        return [
          { id: 'past', name: 'Past', description: 'Influences from the past', x: 25, y: 50 },
          { id: 'present', name: 'Present', description: 'Current situation', x: 50, y: 50 },
          { id: 'future', name: 'Future', description: 'Potential outcome', x: 75, y: 50 },
        ];
      case 'celtic-cross':
        return [
          { id: 'significator', name: 'Significator', description: 'The central issue', x: 40, y: 50 },
          { id: 'crossing', name: 'Crossing', description: 'Challenges or obstacles', x: 40, y: 50, rotation: 90 },
          { id: 'below', name: 'Below', description: 'Foundation of the situation', x: 40, y: 75 },
          { id: 'behind', name: 'Behind', description: 'Past influences', x: 20, y: 50 },
          { id: 'above', name: 'Above', description: 'Best outcome', x: 40, y: 25 },
          { id: 'ahead', name: 'Ahead', description: 'Future influences', x: 60, y: 50 },
          { id: 'self', name: 'Self', description: 'Your attitude', x: 80, y: 80 },
          { id: 'environment', name: 'Environment', description: 'Others\' attitudes', x: 80, y: 60 },
          { id: 'hopes', name: 'Hopes/Fears', description: 'Your hopes and fears', x: 80, y: 40 },
          { id: 'outcome', name: 'Outcome', description: 'Final outcome', x: 80, y: 20 },
        ];
      case 'horseshoe':
        return [
          { id: 'past', name: 'Past', description: 'Past influences', x: 20, y: 70 },
          { id: 'present', name: 'Present', description: 'Current situation', x: 30, y: 55 },
          { id: 'hidden', name: 'Hidden Influences', description: 'Unseen factors', x: 40, y: 45 },
          { id: 'obstacles', name: 'Obstacles', description: 'Challenges to overcome', x: 50, y: 40 },
          { id: 'environment', name: 'Environment', description: 'External influences', x: 60, y: 45 },
          { id: 'advice', name: 'Advice', description: 'Guidance', x: 70, y: 55 },
          { id: 'outcome', name: 'Outcome', description: 'Potential outcome', x: 80, y: 70 },
        ];
      case 'custom':
        return customPositions || [];
      default:
        return [];
    }
  };
  
  const positions = getSpreadPositions();
  
  // Auto-reveal cards with delay
  useEffect(() => {
    if (revealedCards.length < cards.length) {
      const timer = setTimeout(() => {
        setRevealedCards(prev => [...prev, prev.length]);
      }, 1000 + revealedCards.length * 800);
      
      return () => clearTimeout(timer);
    } else if (revealedCards.length === cards.length && !isComplete) {
      // All cards revealed
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [revealedCards, cards.length, isComplete, onComplete]);
  
  // Handle card click
  const handleCardClick = (index: number) => {
    setSelectedCard(selectedCard === index ? null : index);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Spread title and description */}
      {(title || description) && (
        <div className="text-center mb-8">
          {title && <h2 className="text-2xl font-heading text-gold mb-2">{title}</h2>}
          {description && <p className="text-light/80">{description}</p>}
        </div>
      )}
      
      {/* Tarot spread layout */}
      <div className="relative w-full aspect-[3/2] bg-primary-10 rounded-lg border border-gold/20 overflow-hidden">
        {/* Position markers */}
        {positions.map((position, index) => (
          <div
            key={position.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            {/* Card placeholder */}
            <div className="relative">
              {/* Card */}
              {index < cards.length && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={revealedCards.includes(index) ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <AnimatedTarotCard
                    card={cards[index]}
                    isReversed={cards[index].isReversed}
                    size="md"
                    autoReveal={revealedCards.includes(index)}
                    revealDelay={500}
                    onClick={() => handleCardClick(index)}
                  />
                </motion.div>
              )}
              
              {/* Position label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-medium text-gold bg-dark/80 px-2 py-1 rounded-full">
                  {position.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected card meaning */}
      {selectedCard !== null && selectedCard < cards.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-primary-10 border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">
                {cards[selectedCard].name} - {positions[selectedCard].name}
              </CardTitle>
              <CardDescription>
                {positions[selectedCard].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-light/90">
                {cards[selectedCard].isReversed 
                  ? cards[selectedCard].meaningReversed 
                  : cards[selectedCard].meaningUpright}
              </p>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-gold mb-1">Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {cards[selectedCard].keywords.map((keyword, i) => (
                      <span key={i} className="text-xs bg-primary-20 text-light px-2 py-0.5 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                {cards[selectedCard].element && (
                  <div>
                    <h4 className="text-sm font-medium text-gold mb-1">Element</h4>
                    <span className="text-xs bg-primary-20 text-light px-2 py-0.5 rounded">
                      {cards[selectedCard].element}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-gold/50 text-gold"
                onClick={() => setSelectedCard(null)}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TarotSpread;
