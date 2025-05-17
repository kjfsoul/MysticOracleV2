# Tarot Card Implementation Files

This document contains the full code for the key files related to tarot card functionality in the MysticArcana application.

## 1. client/src/utils/tarot-utils.ts

```typescript
import { getActiveDeck } from '@client/config/tarot-deck-config';
import type { TarotCard } from '@client/data/tarot-cards';

export function getTarotCardImagePath(card: TarotCard): string {
  // First, check if the card already has an imagePath defined
  if (card.imagePath && card.imagePath.trim() !== "") {
    return card.imagePath;
  }

  // Generate the path based on the card's properties
  const deckId = "rider-waite"; // Default deck
  const arcana = card.arcana.toLowerCase();

  // Format the card ID to match the file naming convention
  let formattedId = "";

  if (arcana === "major") {
    // Major arcana cards have a numeric prefix in the filename
    // Map the card ID to the correct filename format
    const majorArcanaMap: Record<string, string> = {
      fool: "00-fool",
      magician: "01-magician",
      "high-priestess": "02-high-priestess",
      empress: "03-empress",
      emperor: "04-emperor",
      hierophant: "05-hierophant",
      lovers: "06-lovers",
      chariot: "07-chariot",
      strength: "08-strength",
      hermit: "09-hermit",
      "wheel-of-fortune": "10-wheel-of-fortune",
      justice: "11-justice",
      "hanged-man": "12-hanged-man",
      death: "13-death",
      temperance: "14-temperance",
      devil: "15-devil",
      tower: "16-tower",
      star: "17-star",
      moon: "18-moon",
      sun: "19-sun",
      judgement: "20-judgement",
      world: "21-world",
    };

    formattedId = majorArcanaMap[card.id] || card.id;
  } else {
    // For minor arcana, use the card ID as is
    formattedId = card.id;
  }

  // Generate the path
  let path = "";

  if (arcana === "major") {
    path = `/images/tarot/decks/${deckId}/major/${formattedId}.svg`;
  } else if (card.suit) {
    // For minor arcana cards
    path = `/images/tarot/decks/${deckId}/minor/${card.suit.toLowerCase()}/${formattedId}.svg`;
  } else {
    // Fallback for any other case
    path = "/images/tarot/placeholders/card-back.svg";
  }

  console.log(`Generated path for ${card.name}: ${path}`);
  return path;
}

export function getCardBackPath(): string {
  return getActiveDeck().cardBackImage;
}

export function getDailyCard(cards: TarotCard[]): {
  card: TarotCard;
  isReversed: boolean;
} {
  // Get a deterministic "random" card based on today's date
  const today = new Date();
  const dateString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  // Use the date string to create a seed for the random selection
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to select a card
  const index = Math.abs(hash) % cards.length;
  const selectedCard = cards[index];

  // Determine if the card is reversed (also based on the date)
  const isReversed = (hash >> 4) % 2 === 1;

  return { card: selectedCard, isReversed };
}

/**
 * Handles image loading errors for tarot cards
 * @param card The tarot card that had an image loading error
 * @param setFallbackImage Function to set a fallback image
 */
export function handleTarotImageError(
  card: TarotCard,
  failedPath: string,
  setFallbackImage: (path: string) => void
): void {
  console.warn(`Error loading image for card: ${card.name}`);

  // Try to use the card's imagePath if it exists
  if (card.imagePath && card.imagePath !== "") {
    // If we're already using the card's imagePath and it failed, use a placeholder
    if (card.imagePath.includes(".webp")) {
      // Try the SVG version first
      const svgPath = card.imagePath.replace(".webp", ".svg");
      console.log(`Trying SVG version: ${svgPath}`);
      
      // Create a test image to see if the SVG exists
      const testImg = new Image();
      testImg.onload = () => {
        console.log(`SVG version loaded successfully: ${svgPath}`);
        setFallbackImage(svgPath);
      };
      testImg.onerror = () => {
        // If SVG fails too, use a placeholder
        usePlaceholder();
      };
      testImg.src = svgPath;
      return;
    }
  }
  
  // If we get here, use a placeholder
  usePlaceholder();
  
  function usePlaceholder() {
    // Determine the appropriate fallback based on card type
    let fallbackPath = "";

    if (card.arcana === "major") {
      fallbackPath = "/images/tarot/placeholders/major-placeholder.svg";
    } else if (card.arcana === "minor" && card.suit) {
      fallbackPath = `/images/tarot/placeholders/${card.suit.toLowerCase()}-placeholder.svg`;
    } else {
      fallbackPath = "/images/tarot/placeholders/card-back.svg";
    }

    // Set the fallback image
    setFallbackImage(fallbackPath);

    // Log the error for debugging
    console.debug(
      `Using fallback image: ${fallbackPath} for card: ${card.name}`
    );
  }
}
```

## 2. client/src/config/tarot-deck-config.ts

```typescript
/**
 * Tarot Deck Configuration
 *
 * Centralized management for tarot deck configurations and switching
 */

export interface TarotDeckConfig {
  id: string;
  name: string;
  description: string;
  author: string;
  year: number;
  cardBackImage: string;
  imageFormat: 'webp' | 'jpg' | 'png';
  cardPathTemplate: string;
  enabledSpreadTypes: ('daily' | '3-card' | 'love' | 'career' | 'zodiac')[];
}

export const TAROT_DECKS: TarotDeckConfig[] = [
  {
    id: "rider-waite",
    name: "Rider-Waite-Smith",
    description: "Classic 1909 deck by Pamela Colman Smith",
    author: "Arthur Edward Waite",
    year: 1909,
    cardBackImage: "/images/tarot/decks/rider-waite/card-back.jpg",
    imageFormat: "jpg",
    cardPathTemplate: "/images/tarot/decks/rider-waite/{arcana}/{id}.jpg",
    enabledSpreadTypes: ["daily", "3-card", "love", "career", "zodiac"],
  },
  // Additional decks can be added here
];

let activeDeckId = 'rider-waite';

export function getActiveDeck(): TarotDeckConfig {
  return TAROT_DECKS.find(deck => deck.id === activeDeckId) || TAROT_DECKS[0];
}

export function setActiveDeck(deckId: string): void {
  if (TAROT_DECKS.some(deck => deck.id === deckId)) {
    activeDeckId = deckId;
    localStorage.setItem('activeTarotDeck', deckId);
  }
}

// Initialize from localStorage
const storedDeck = localStorage.getItem('activeTarotDeck');
if (storedDeck && TAROT_DECKS.some(deck => deck.id === storedDeck)) {
  activeDeckId = storedDeck;
}
```

## 3. client/src/components/tarot/animated-tarot-card.tsx

```tsx
import type { TarotCard } from "@client/data/tarot-cards";
import {
  getTarotCardImagePath,
  handleTarotImageError,
  getCardBackPath
} from "@client/utils/tarot-utils";
import React, { useEffect, useState } from "react";
import "@client/styles/card-flip.css";
import { p } from "framer-motion/dist/types.d-B50aGbjN";
import style from "styled-jsx/style";

interface AnimatedTarotCardProps {
  card: TarotCard;
  isReversed?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  autoReveal?: boolean;
  revealDelay?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  showMeaning?: boolean;
}

const dimensions = {
  sm: { width: 100, height: 170 },
  md: { width: 140, height: 240 },
  lg: { width: 180, height: 300 },
  xl: { width: 220, height: 370 },
};

const AnimatedTarotCard: React.FC<AnimatedTarotCardProps> = ({
  card,
  isReversed = false,
  size = "md",
  autoReveal = false,
  revealDelay = 1500,
  onClick,
  className = "",
  showMeaning = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(autoReveal);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { width, height } = dimensions[size];

  useEffect(() => {
    const cardImagePath = getTarotCardImagePath(card);
    console.log(
      `Loading image for ${card.name} from generated path: ${cardImagePath}`
    );

    const img = new Image();
    img.src = cardImagePath;

    img.onload = () => {
      console.log(`Successfully loaded image: ${cardImagePath}`);
      setImageSrc(cardImagePath);
      setIsLoaded(true);
    };

    img.onerror = () => {
      console.error(`Failed to load generated image: ${cardImagePath}`);
      handleTarotImageError(card, cardImagePath, setImageSrc);
      setIsLoaded(true);
    };
  }, [card]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (autoReveal && !isFlipped) {
      console.log(`Setting up auto-reveal timer for card: ${card.name}`);
      timer = setTimeout(() => {
        console.log(`Auto-revealing card via timer: ${card.name}`);
        setIsFlipped(true);
      }, revealDelay);
    }
    return () => {
      if (timer) {
        console.log(`Clearing auto-reveal timer for card: ${card.name}`);
        clearTimeout(timer);
      }
    };
  }, [autoReveal, revealDelay, card.name, isFlipped]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsFlipped(current => !current);
    if (onClick) onClick(event);
  };

  return (
    <div
      className={`relative perspective-1000 cursor-pointer ${className}`}
      style={{ width, height }}
      onClick={handleClick}
    >
      <div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
      >
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30 overflow-hidden"
          style={{
            backgroundImage: `url(${getCardBackPath()})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30 overflow-hidden"
          style={{ transform: `rotateY(180deg)` }}
        >
          {isLoaded ? (
            <div className="relative w-full h-full">
              <div className="glowing-tarot-card">
                <img
                  className="w-full h-full object-contain"
                  src={imageSrc || ''}
                  alt={card.name}
                  style={{
                    transform: isReversed ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-sm p-2 text-center">
                <h3 className="text-gold font-heading text-sm md:text-base truncate">
                  {card.name}
                </h3>
                {showMeaning && (
                  <p className="text-light/80 text-xs mt-1 line-clamp-2">
                    {isReversed ? card.meaningReversed : card.meaningUpright}
                  </p>
                )}
              </div>

              {isReversed && (
                <div className="absolute top-2 right-2 bg-warning/80 text-dark text-xs px-1.5 py-0.5 rounded-sm font-medium">
                  Reversed
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-20">
              <div className="animate-spin w-8 h-8 border-2 border-gold rounded-full border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedTarotCard;
```

## 4. client/src/components/tarot/daily-card-improved.tsx

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TarotCard } from "@/data/tarot-cards";
import { allTarotCards } from "@/data/tarot-cards";
import { getDailyCard, getTarotCardImagePath } from "@/utils/tarot-utils";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, RefreshCw, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
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

        // Log the image path for debugging
        console.log(
          `Daily card image path: ${imagePath} for card ${dailyCard.name}`
        );

        // Log the image path for debugging
        console.log(
          `Using image path: ${imagePath} for daily card ${dailyCard.name}`
        );

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

  // Auto-flip the card after a delay, but only once when the card is loaded
  useEffect(() => {
    if (card && !isFlipped) {
      console.log("Setting up flip timer for daily card");
      const timer = setTimeout(() => {
        console.log("Flipping daily card");
        setIsFlipped(true);
      }, 1500);

      return () => {
        console.log("Clearing flip timer for daily card");
        clearTimeout(timer);
      };
    }
  }, [card]); // Only depend on card to prevent infinite flipping

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
                      {card.keywords.map((keyword: string, index: number) => (
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
                  autoReveal={false}
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
```

## 5. client/src/styles/card-flip.css

```css
/**
 * Card Flip Animation Styles
 */

.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

/* Transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-700 {
  transition-duration: 700ms;
}

/* Glowing card effect */
.glowing-tarot-card {
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  animation: glowing 2s infinite;
}

@keyframes glowing {
  0% {
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0px 0px 20px rgba(255, 255, 255, 1);
  }
}
```

## 6. netlify/functions/daily-tarot.js

```javascript
// Example Netlify Function for Daily Tarot Card
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event, context) => {
  try {
    // Parse request body if it exists
    const body = event.body ? JSON.parse(event.body) : {};
    const { user_id } = body;

    // Get random tarot card from database
    const { data: card, error } = await supabase
      .from('tarot_cards')
      .select('*')
      .order('RANDOM()')
      .limit(1)
      .single();

    if (error) throw error;

    // If user_id is provided, save this reading to user history
    if (user_id) {
      await supabase.from('user_readings').insert({
        user_id,
        card_id: card.id,
        reading_type: 'daily',
        created_at: new Date().toISOString(),
      });
    }

    // Return the card data
    return {
      statusCode: 200,
      body: JSON.stringify({
        card,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error in daily-tarot function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get daily tarot card' }),
    };
  }
};
```
