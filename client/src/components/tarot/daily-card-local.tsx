import { useState, useEffect } from 'react';
import { getDailyCard } from '@/data/tarot-cards';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock } from 'lucide-react';
import { Link } from 'wouter';
import TarotCard from './tarot-card';

export default function DailyCardLocal() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      const dailyCard = getDailyCard();
      setCard({
        name: dailyCard.name,
        arcana: dailyCard.arcana,
        number: dailyCard.number,
        description: dailyCard.description,
        imageUrl: dailyCard.imagePath,
        reversal: false
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-flip the card after a short delay for a nice reveal effect
    if (card && !isFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [card, isFlipped]);

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-40 w-32 bg-primary/20 rounded mb-4"></div>
          <div className="h-4 bg-primary/20 rounded w-40 mb-2"></div>
          <div className="h-4 bg-primary/20 rounded w-52"></div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6 text-center">
        <h3 className="text-xl font-medium text-light mb-3">
          Unable to fetch today's card
        </h3>
        <p className="text-light/70 mb-4">
          The mystical energies are momentarily disrupted. Please try again
          later.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="border-accent/50 text-accent hover:bg-accent/20"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2 text-xl font-medium text-accent">
          <Sparkles className="h-5 w-5" />
          Card of the Day
        </h3>
        <div className="flex items-center text-light/60 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          {today}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Card Display */}
        <div className="flex justify-center md:w-1/3">
          <div className="cursor-pointer" onClick={handleCardClick}>
            <TarotCard
              cardName={card.name}
              imageUrl={card.imageUrl}
              isFlipped={isFlipped}
              isAnimated={true}
              size="md"
              isReversed={card.reversal}
            />
          </div>
        </div>

        {/* Card Interpretation */}
        <div className="md:w-2/3">
          <div
            className={`transition-opacity duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
          >
            <h4 className="text-lg font-medium text-light mb-1">
              {card.name} {card.reversal ? "(Reversed)" : ""}
            </h4>
            <p className="text-light/60 text-sm mb-3">
              {card.arcana.charAt(0).toUpperCase() + card.arcana.slice(1)} Arcana {card.number !== undefined ? `• ${card.number}` : ''}
            </p>
            <p className="text-light/80 mb-4">{card.description}</p>
            <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 mb-4">
              <p className="text-light/90 text-sm">
                This card suggests focusing on your intuition today. Pay attention to the subtle messages around you.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth">
                <Button className="bg-accent hover:bg-accent/80 text-dark">
                  Sign Up
                </Button>
              </Link>
              <Link href="/tarot">
                <Button
                  variant="outline"
                  className="border-accent/50 text-accent hover:bg-accent/20"
                >
                  Full Reading
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
