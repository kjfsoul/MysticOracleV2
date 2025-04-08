import { Button } from "@/components/ui/button";
import { Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import TarotCard from "./tarot-card";

export default function DailyCardLocal() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      try {
        // Import the utility functions
        import("@/data/tarot-cards").then(({ allTarotCards }) => {
          import("@/utils/tarot-utils").then(
            ({ getDailyCard, getTarotCardImagePath }) => {
              const { card: dailyCard, isReversed } =
                getDailyCard(allTarotCards);
              setCard({
                name: dailyCard.name,
                arcana: dailyCard.arcana,
                number: dailyCard.number,
                description: dailyCard.description,
                imageUrl: getTarotCardImagePath(dailyCard),
                reversal: isReversed,
              });
              setIsLoading(false);
            }
          );
        });
      } catch (error) {
        console.error("Error loading daily card:", error);
        setIsLoading(false);
      }
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
      <div className="card-improved p-6 flex flex-col items-center justify-center min-h-[400px]">
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
      <div className="card-improved p-6 text-center">
        <h3 className="heading-improved text-xl font-medium text-light mb-4">
          Unable to fetch today's card
        </h3>
        <p className="text-improved mb-5">
          The mystical energies are momentarily disrupted. Please try again
          later.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="button-improved text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="daily-card-container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center gap-2 text-xl font-medium text-accent heading-improved">
          <Sparkles className="h-5 w-5 icon-improved" />
          Card of the Day
        </h3>
        <div className="flex items-center text-light/60 text-sm badge-improved py-1 px-2">
          <Clock className="h-4 w-4 mr-1" />
          {today}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Card Display */}
        <div className="flex justify-center md:w-1/3 daily-card-image">
          <div
            className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={handleCardClick}
          >
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
        <div className="md:w-2/3 daily-card-content">
          <div
            className={`transition-opacity duration-500 ${
              isFlipped ? "opacity-100" : "opacity-0"
            }`}
          >
            <h4 className="text-xl font-medium text-light mb-2 card-title-improved">
              {card.name} {card.reversal ? "(Reversed)" : ""}
            </h4>
            <p className="text-light/70 text-sm mb-4 badge-improved inline-block py-1 px-3">
              {card.arcana.charAt(0).toUpperCase() + card.arcana.slice(1)}{" "}
              Arcana {card.number !== undefined ? `• ${card.number}` : ""}
            </p>
            <p className="text-improved mb-5">{card.description}</p>
            <div className="bg-primary/20 border border-primary/30 rounded-lg p-5 mb-6 card-improved">
              <p className="text-improved">
                This card suggests focusing on your intuition today. Pay
                attention to the subtle messages around you.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth">
                <Button className="button-improved text-white">Sign Up</Button>
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
