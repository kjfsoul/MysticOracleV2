import { useState, useEffect } from 'react';
import { getDailyCard, TarotCard } from '@/data/tarot-cards';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyCardProps {
  onViewFullReading?: () => void;
}

export default function DailyCard({ onViewFullReading }: DailyCardProps) {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setCard(getDailyCard());
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Your Daily Tarot</CardTitle>
          <CardDescription className="text-center">Loading your card of the day...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-pulse w-64 h-96 bg-muted rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  if (!card) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Your Daily Tarot</CardTitle>
          <CardDescription className="text-center">Unable to load your card of the day</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p>Please try again later</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-primary/10">
            Daily Card
          </Badge>
          <Badge variant="outline" className="bg-primary/10">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Badge>
        </div>
        <CardTitle className="text-center mt-2">{card.name}</CardTitle>
        <CardDescription className="text-center">
          {card.arcana === 'major' ? 'Major Arcana' : `${card.suit?.charAt(0).toUpperCase()}${card.suit?.slice(1)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div 
          className="perspective-1000 cursor-pointer mb-6"
          onClick={handleFlip}
        >
          <div 
            className={`relative transform-style-3d transition-transform duration-700 w-64 h-96 ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            {/* Front of card */}
            <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
              <img 
                src={card.imagePath} 
                alt={card.name}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (card.arcana === 'major') {
                    target.src = '/images/tarot/placeholders/major-placeholder.svg';
                  } else {
                    target.src = '/images/tarot/placeholders/minor-placeholder.svg';
                  }
                }}
              />
            </div>
            
            {/* Back of card */}
            <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity bg-card rounded-lg p-4 flex flex-col justify-between`}>
              <div>
                <h3 className="text-lg font-semibold mb-2">Keywords:</h3>
                <div className="flex flex-wrap gap-1 mb-4">
                  {card.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-lg font-semibold mb-2">Meaning:</h3>
                <p className="text-sm mb-4">{card.meaningUpright}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground italic">Tap to flip back</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-center mb-4">
          {isFlipped ? 'Tap the card to see the image' : 'Tap the card to reveal its meaning'}
        </p>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {card.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={onViewFullReading} 
          className="w-full"
          variant="default"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Get Full Reading
        </Button>
      </CardFooter>
    </Card>
  );
}
