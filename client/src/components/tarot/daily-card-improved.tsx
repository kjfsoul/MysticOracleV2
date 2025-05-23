import { AnimatePresence, motion } from "framer-motion";
import { Calendar, RefreshCw, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "../../../../src/components/ui/badge";
import { Button } from "../../../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/card";
import { TarotCard, allTarotCards } from "../../data/tarot-cards";
import { getDailyCard, getTarotCardImagePath } from "../../utils/tarot-utils";
import AnimatedTarotCard from "./animated-tarot-card";
interface DailyCardImprovedProps {
  onViewFullReading?: () => void;
  className?: string;
}

/**
 * DailyCardImproved Component
 *
 * An enhanced daily tarot card component with animations and detailed card information.
 */
const DailyCardImproved: React.FC<DailyCardImprovedProps> = ({
  onViewFullReading,
  className = "",
}) => {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Format today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Load the daily card
  useEffect(() => {
    const loadDailyCard = async () => {
      setIsLoading(true);

      try {
        // Get the daily card
        const { card: dailyCard, isReversed: cardIsReversed } =
          getDailyCard(allTarotCards);

        // Ensure the card has a valid image path
        let imagePath = getTarotCardImagePath(dailyCard);

        // Additional safety check for problematic images
        if (
          dailyCard.id === "07-chariot" ||
          dailyCard.id === "13-death" ||
          dailyCard.id === "16-tower"
        ) {
          console.warn("Using placeholder for known problematic card");
          imagePath = "/images/tarot/placeholders/major-placeholder.svg";
        }

        // Update the card with the verified image path
        const cardWithImage = {
          ...dailyCard,
          imagePath,
        };

        // Set the card and its orientation
        setCard(cardWithImage);
        setIsReversed(cardIsReversed);

        // Reset the flip state
        setIsFlipped(false);
        setShowDetails(false);
      } catch (error) {
        console.error("Error loading daily card:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyCard();
  }, []);

  // Auto-flip the card after a delay
  useEffect(() => {
    if (card && !isFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [card, isFlipped]);

  // Handle card click
  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  // Handle view details click
  const handleViewDetails = () => {
    setShowDetails(true);
  };

  // Handle close details
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="text-center text-gold">
            Your Daily Tarot
          </CardTitle>
          <CardDescription className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              <span>{today}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="w-64 h-96 bg-primary-20 rounded-lg flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-gold rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (!card) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="text-center text-gold">
            Your Daily Tarot
          </CardTitle>
          <CardDescription className="text-center">
            Unable to load your card of the day
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="mb-4 text-light/80">
            The mystical energies are momentarily disrupted.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-gold/50 text-gold"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showDetails ? (
        // Detailed card view
        <motion.div
          key="details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          <Card className="w-full max-w-4xl mx-auto bg-primary-10 border-gold/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="bg-primary/20 text-gold border-gold/50"
                >
                  Daily Card
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-primary/20 text-gold border-gold/50"
                >
                  {today}
                </Badge>
              </div>
              <CardTitle className="text-center mt-2 text-gold">
                {card.name}
              </CardTitle>
              <CardDescription className="text-center">
                {card.arcana === "major"
                  ? "Major Arcana"
                  : `${card.suit?.charAt(0).toUpperCase()}${card.suit?.slice(
                      1
                    )} of ${card.arcana
                      .charAt(0)
                      .toUpperCase()}${card.arcana.slice(1)}`}
                {isReversed && " • Reversed"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <AnimatedTarotCard
                    card={card}
                    isReversed={isReversed}
                    size="xl"
                    autoReveal={true}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gold mb-2">
                      {isReversed ? "Reversed Meaning" : "Upright Meaning"}
                    </h3>
                    <p className="text-light/90">
                      {isReversed ? card.meaningReversed : card.meaningUpright}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gold mb-2">
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {card.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-primary-20"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {card.element && (
                      <div>
                        <h3 className="text-sm font-medium text-gold mb-1">
                          Element
                        </h3>
                        <p className="text-light/90">{card.element}</p>
                      </div>
                    )}

                    {card.zodiacSign && (
                      <div>
                        <h3 className="text-sm font-medium text-gold mb-1">
                          Zodiac
                        </h3>
                        <p className="text-light/90">{card.zodiacSign}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleCloseDetails}
                className="border-gold/50 text-gold"
              >
                Back to Card
              </Button>

              {onViewFullReading && (
                <Button
                  onClick={onViewFullReading}
                  className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Full Reading
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        // Simple card view
        <motion.div
          key="simple"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          <Card className="w-full max-w-md mx-auto bg-primary-10 border-gold/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="bg-primary/20 text-gold border-gold/50"
                >
                  Daily Card
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-primary/20 text-gold border-gold/50"
                >
                  {today}
                </Badge>
              </div>
              <CardTitle className="text-center mt-2 text-gold">
                {card.name}
              </CardTitle>
              <CardDescription className="text-center">
                {card.arcana === "major"
                  ? "Major Arcana"
                  : `${card.suit?.charAt(0).toUpperCase()}${card.suit?.slice(
                      1
                    )}`}
                {isReversed && " • Reversed"}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center">
              <div className="mb-6" onClick={handleCardClick}>
                <AnimatedTarotCard
                  card={card}
                  isReversed={isReversed}
                  size="lg"
                  autoReveal={isFlipped}
                />
              </div>

              <p className="text-sm text-center mb-4 text-light/80">
                {isFlipped
                  ? "Tap the card again to flip"
                  : "Tap the card to reveal"}
              </p>

              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center space-y-4 w-full"
                >
                  <p className="text-light/90">
                    {isReversed ? card.meaningReversed : card.meaningUpright}
                  </p>

                  <Button
                    variant="outline"
                    onClick={handleViewDetails}
                    className="border-gold/50 text-gold"
                  >
                    View Full Details
                  </Button>
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="flex justify-center">
              {onViewFullReading && (
                <Button
                  onClick={onViewFullReading}
                  className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                  disabled={!isFlipped}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Full Reading
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyCardImproved;
