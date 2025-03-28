import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import TarotCard from "./tarot-card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock } from "lucide-react";
import { Link } from "wouter";

interface CardOfTheDayResponse {
  success: boolean;
  card: {
    name: string;
    arcana: string;
    number: string;
    description: string;
    imageUrl: string;
    reversal: boolean;
  };
  interpretation: string;
  date: string;
  message: string;
}

export default function CardOfTheDay() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const { 
    data: cardOfTheDay, 
    isLoading,
    error 
  } = useQuery<CardOfTheDayResponse>({
    queryKey: ["/api/tarot-cards/card-of-the-day"],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    queryFn: async () => {
      return await apiRequest("/api/tarot-cards/card-of-the-day");
    }
  });

  useEffect(() => {
    // Auto-flip the card after a short delay for a nice reveal effect
    if (cardOfTheDay && !isFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cardOfTheDay, isFlipped]);

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

  if (error || !cardOfTheDay) {
    return (
      <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6 text-center">
        <h3 className="text-xl font-medium text-light mb-3">Unable to fetch today's card</h3>
        <p className="text-light/70 mb-4">The mystical energies are momentarily disrupted. Please try again later.</p>
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

  const { card, interpretation, date, message } = cardOfTheDay;

  return (
    <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2 text-xl font-medium text-accent">
          <Sparkles className="h-5 w-5" />
          Card of the Day
        </h3>
        <div className="flex items-center text-light/60 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          {date}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Card Display */}
        <div className="flex justify-center md:w-1/3">
          <div 
            className="cursor-pointer" 
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
        <div className="md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h4 className="text-lg font-medium text-light mb-1">
              {card.name} {card.reversal ? "(Reversed)" : ""}
            </h4>
            <p className="text-light/60 text-sm mb-3">
              {card.arcana} Arcana • {card.number}
            </p>
            <p className="text-light/80 mb-4">
              {interpretation}
            </p>
            <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 mb-4">
              <p className="text-light/90 text-sm">
                {message}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth">
                <Button className="bg-accent hover:bg-accent/80 text-dark">
                  Sign Up
                </Button>
              </Link>
              <Link href="/tarot">
                <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/20">
                  Full Reading
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}