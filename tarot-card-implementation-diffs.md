# Tarot Card Implementation Diffs

## 1. Fix Rider-Waite Image Path Issues

### client/src/config/tarot-deck-config.ts

```diff
export const TAROT_DECKS: TarotDeckConfig[] = [
  {
    id: "rider-waite",
    name: "Rider-Waite-Smith",
    description: "Classic 1909 deck by Pamela Colman Smith",
    author: "Arthur Edward Waite",
    year: 1909,
    cardBackImage: "/images/tarot/decks/rider-waite/card-back.jpg",
    imageFormat: "jpg",
-   cardPathTemplate: "/images/tarot/decks/rider-waite/{arcana}/{id}.svg",
+   cardPathTemplate: "/images/tarot/decks/rider-waite/{arcana}/{id}.jpg",
    enabledSpreadTypes: ["daily", "3-card", "love", "career", "zodiac"],
  },
  // Additional decks can be added here
];
```

### client/src/utils/tarot-utils.ts

```diff
export function getTarotCardImagePath(card: TarotCard): string {
  // First, check if the card already has an imagePath defined
  if (card.imagePath && card.imagePath.trim() !== "") {
    return card.imagePath;
  }

  // Get the active deck configuration
  const activeDeck = getActiveDeck();
  const arcana = card.arcana.toLowerCase();

+ // Determine the desired format (prioritize JPG)
+ const imageFormat = 'jpg'; // CHANGE THIS FROM 'svg'

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

- // Generate the path using the deck's template
- let path = activeDeck.cardPathTemplate
-   .replace("{arcana}", arcana)
-   .replace("{id}", formattedId);

+ // Generate the path using the chosen format
+ let path = "";
+ if (arcana === "major") {
+   path = `/images/tarot/decks/${activeDeck.id}/major/${formattedId}.${imageFormat}`; // Use imageFormat
+ } else if (card.suit) {
+   path = `/images/tarot/decks/${activeDeck.id}/minor/${card.suit.toLowerCase()}/${formattedId}.${imageFormat}`; // Use imageFormat
+ } else {
+   // Fallback logic remains the same
+   console.error(`Cannot determine path for card: ${card.name}, using placeholder.`);
+   path = "/images/tarot/placeholders/card-back.svg"; // Or use getFallbackPlaceholderPath(card)
+ }

  console.log(`Generated path for ${card.name}: ${path}`);
  return path;
}
```

## 2. Add Skeleton & Graceful Error UI

### client/src/components/tarot/daily-card-improved.tsx

```diff
  // Loading state
  if (isLoading) {
    return (
-     <Card className={`w-full max-w-md mx-auto ${className}`}>
+     <Card className={`w-full max-w-md mx-auto border border-gold/20 ${className}`}>
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
-       <CardContent className="flex justify-center py-10">
-         <div className="w-64 h-96 bg-primary-20 rounded-lg flex items-center justify-center">
-           <div className="animate-spin w-12 h-12 border-4 border-gold rounded-full border-t-transparent"></div>
+       <CardContent className="flex flex-col items-center py-10">
+         <div className="w-64 h-96 bg-primary-20 rounded-lg flex items-center justify-center relative overflow-hidden">
+           <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-primary-900/40 animate-pulse"></div>
+           <div className="animate-spin w-12 h-12 border-4 border-gold rounded-full border-t-transparent"></div>
+           <div className="absolute bottom-0 left-0 right-0 h-12 bg-primary-900/50 flex items-center justify-center">
+             <div className="h-4 w-32 bg-gold/20 rounded animate-pulse"></div>
+           </div>
          </div>
+         <p className="text-sm text-center mt-4 text-light/70">The mystical energies are aligning...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
+ if (error) {
+   return (
+     <Card className={`w-full max-w-md mx-auto border border-destructive/30 ${className}`}>
+       <CardHeader>
+         <CardTitle className="text-center text-destructive">
+           Unable to Reveal Your Card
+         </CardTitle>
+         <CardDescription className="text-center">
+           <div className="flex items-center justify-center gap-2">
+             <Calendar className="h-4 w-4" />
+             <span>{today}</span>
+           </div>
+         </CardDescription>
+       </CardHeader>
+       <CardContent className="flex flex-col items-center py-6">
+         <div className="w-64 h-96 bg-primary-20 rounded-lg flex items-center justify-center relative overflow-hidden border border-destructive/20">
+           <div className="p-6 text-center">
+             <p className="text-light/80 mb-4">The mystical energies are temporarily disrupted. Please try again later.</p>
+             <Button 
+               variant="outline" 
+               onClick={() => window.location.reload()}
+               className="border-destructive/50 text-destructive hover:bg-destructive/10"
+             >
+               <RefreshCw className="h-4 w-4 mr-2" />
+               Try Again
+             </Button>
+           </div>
+         </div>
+       </CardContent>
+     </Card>
+   );
+ }
```

## 3. User Click Required for Daily Card Flip

### client/src/components/tarot/daily-card-improved.tsx

```diff
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-primary/10 text-gold">
            <Calendar className="h-3 w-3 mr-1" />
            Daily Card
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-gold">
            {today}
          </Badge>
        </div>
        <CardTitle className="text-center mt-2 text-gold">
          {isFlipped ? dailyCard.card.name : "Your Daily Tarot"}
        </CardTitle>
        <CardDescription className="text-center">
          {isFlipped
            ? dailyCard.card.arcana === "major"
              ? "Major Arcana"
              : `${dailyCard.card.suit?.charAt(0).toUpperCase()}${dailyCard.card.suit?.slice(
                  1
                )}`
            : "Discover your cosmic guidance for today"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
-       <div className="mb-6">
+       <div className="mb-6" onClick={handleCardClick}>
          <AnimatedTarotCard
            card={card}
            isReversed={isReversed}
            size="lg"
-           autoReveal={true}
+           autoReveal={isFlipped}
          />
        </div>

+       <p className="text-sm text-center mb-4 text-light/80">
+         {isFlipped
+           ? "Tap the card again to flip"
+           : "Tap the card to reveal"}
+       </p>

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
    </Card>
  );
```

## 4. Data-Driven Probability for Reversals

### client/src/utils/tarot-utils.ts

```diff
export function getDailyCard(cards: TarotCard[], userId?: string): {
  card: TarotCard;
  isReversed: boolean;
} {
  // Get a deterministic "random" card based on today's date
  const today = new Date();
  const dateString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

+ // Add user-specific seed if available
+ const seedString = userId ? `${dateString}-${userId}` : dateString;

  // Use the date string to create a seed for the random selection
  let hash = 0;
- for (let i = 0; i < dateString.length; i++) {
-   hash = (hash << 5) - hash + dateString.charCodeAt(i);
+ for (let i = 0; i < seedString.length; i++) {
+   hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to select a card
  const index = Math.abs(hash) % cards.length;
  const selectedCard = cards[index];

- // Determine if the card is reversed (also based on the date)
- const isReversed = (hash >> 4) % 2 === 1;
+ // Determine if the card is reversed with a 30% probability
+ // But make it deterministic based on the hash
+ const reversalValue = Math.abs((hash >> 4) % 100);
+ const isReversed = reversalValue < 30; // 30% chance of reversal

  return { card: selectedCard, isReversed };
}
```

## 5. Add Shuffling Animation with Sound Effects

### client/src/components/tarot/tarot-deck.tsx

```diff
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard } from "@/components/tarot/tarot-card";
import { allTarotCards } from "@/data/tarot-cards";
import { Button } from "@/components/ui/button";
+ import useSound from "use-sound";

export interface TarotDeckProps {
  spread: string;
  onCardSelection: (cards: any[]) => void;
  isLoading?: boolean;
}

export function TarotDeck({
  spread,
  onCardSelection,
  isLoading = false,
}: TarotDeckProps) {
  const [availableCards, setAvailableCards] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [deckShuffled, setDeckShuffled] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  
+ // Sound effects
+ const [playShuffleSound] = useSound('/sounds/card-shuffle.mp3', { volume: 0.5 });
+ const [playCardSelectSound] = useSound('/sounds/card-select.mp3', { volume: 0.4 });

  // Get the number of cards to select based on the spread
  const selectionCount = getSelectionCount(spread);

  // Initialize and shuffle the deck
  useEffect(() => {
    // Reset selection when spread changes
    setSelectedCards([]);
    setIsSelecting(false);
    setDeckShuffled(false);

    // Create a new shuffled deck
    const shuffledDeck = [...allTarotCards].sort(() => Math.random() - 0.5);
    setAvailableCards(shuffledDeck);
  }, [spread]);

  // Handle card selection
  const handleCardClick = (card: any, index: number) => {
    if (!isSelecting || selectedCards.length >= selectionCount) return;
    
    if (selectedCards.find((c) => c.id === card.id)) return;
    
+   // Play card selection sound
+   playCardSelectSound();
    
    setSelectedCards([...selectedCards, card]);

    // Visual flash effect via class (we'll add the CSS for this)
    const cardElements = document.querySelectorAll(".card-container");
    const selectedElement = cardElements[index];
    if (selectedElement) {
      selectedElement.classList.add("card-selected-flash");
      setTimeout(() => {
        selectedElement.classList.remove("card-selected-flash");
      }, 600);
    }

    // Create a dramatic pause before revealing the card
    const selectedCard = document.querySelector(
      `.card-container:nth-child(${index + 1}) .tarot-card`
    );
    if (selectedCard) {
      selectedCard.classList.add("selected-card-animation");
    }
  };

  // Start the selection process
  const handleStartSelection = () => {
    setIsSelecting(true);
    handleShuffleDeck();
  };

  // Auto-complete selection when enough cards are selected
  useEffect(() => {
    if (selectedCards.length === selectionCount && isSelecting) {
      // Small delay to allow animation to be visible
      const timer = setTimeout(() => {
        onCardSelection(selectedCards);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedCards, selectionCount, isSelecting, onCardSelection]);

  // Shuffle animation and reset
  const handleShuffleDeck = () => {
    setDeckShuffled(true);
    setSelectedCards([]);
    
+   // Play shuffle sound
+   playShuffleSound();

    // Shuffle with animation delay
    setTimeout(() => {
      const newShuffledDeck = [...allTarotCards].sort(() => Math.random() - 0.5);
      setAvailableCards(newShuffledDeck);

      // Reset shuffle state after animation completes
      setTimeout(() => {
        setDeckShuffled(false);
      }, 500);
    }, 500);
  };
```

## 6. Add Randomized Card Animations

### client/src/components/tarot/animated-tarot-card.tsx

```diff
import type { TarotCard } from "@client/data/tarot-cards";
import {
  getTarotCardImagePath,
  handleTarotImageError,
  getCardBackPath
} from "@client/utils/tarot-utils";
import React, { useEffect, useState } from "react";
import "@client/styles/card-flip.css";
+ import { motion } from "framer-motion";

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

+ // Card reveal animations
+ const cardRevealAnimations = [
+   "glow", // Glowing effect
+   "sparkle", // Sparkle effect
+   "jump", // Card jumps out
+   "pulse", // Card pulses
+   "rotate", // Card rotates slightly
+ ];

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
+ const [revealAnimation, setRevealAnimation] = useState<string>("");

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
    
+   // Select a random animation for this card
+   const randomAnimation = cardRevealAnimations[Math.floor(Math.random() * cardRevealAnimations.length)];
+   setRevealAnimation(randomAnimation);
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

+ // Animation variants based on the selected animation type
+ const getCardFrontAnimationClass = () => {
+   switch (revealAnimation) {
+     case "glow":
+       return "animate-glow";
+     case "sparkle":
+       return "animate-sparkle";
+     case "jump":
+       return "animate-jump";
+     case "pulse":
+       return "animate-pulse-card";
+     case "rotate":
+       return "animate-rotate";
+     default:
+       return "";
+   }
+ };

  return (
    <div
      className={`relative perspective-1000 cursor-pointer ${className}`}
      style={{ width, height }}
      onClick={handleClick}
    >
-     <div
+     <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
-       style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
+       animate={{ rotateY: isFlipped ? 180 : 0 }}
+       transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
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
-             <div className="glowing-tarot-card">
+             <div className={`tarot-card-front ${isFlipped ? getCardFrontAnimationClass() : ""}`}>
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
-     </div>
+     </motion.div>
    </div>
  );
};

export default AnimatedTarotCard;
```

### client/src/styles/card-flip.css

```diff
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

+ /* Card reveal animations */
+ .animate-glow {
+   animation: card-glow 3s infinite alternate;
+ }
+ 
+ .animate-sparkle {
+   animation: card-sparkle 2s infinite;
+ }
+ 
+ .animate-jump {
+   animation: card-jump 1s ease-out;
+ }
+ 
+ .animate-pulse-card {
+   animation: card-pulse 2s infinite;
+ }
+ 
+ .animate-rotate {
+   animation: card-rotate 2s ease-in-out;
+ }
+ 
+ @keyframes card-glow {
+   0% {
+     box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
+   }
+   100% {
+     box-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 50px rgba(255, 215, 0, 0.5);
+   }
+ }
+ 
+ @keyframes card-sparkle {
+   0%, 100% {
+     filter: brightness(1);
+   }
+   50% {
+     filter: brightness(1.3) contrast(1.1);
+   }
+ }
+ 
+ @keyframes card-jump {
+   0% {
+     transform: translateY(0) scale(1);
+   }
+   50% {
+     transform: translateY(-20px) scale(1.1);
+   }
+   100% {
+     transform: translateY(0) scale(1);
+   }
+ }
+ 
+ @keyframes card-pulse {
+   0%, 100% {
+     transform: scale(1);
+   }
+   50% {
+     transform: scale(1.05);
+   }
+ }
+ 
+ @keyframes card-rotate {
+   0% {
+     transform: rotate(0deg);
+   }
+   25% {
+     transform: rotate(5deg);
+   }
+   75% {
+     transform: rotate(-5deg);
+   }
+   100% {
+     transform: rotate(0deg);
+   }
+ }
```

## 7. User-Specific Daily Cards

### netlify/functions/daily-tarot.js

```diff
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
    
+   // Get today's date for consistent card selection
+   const today = new Date();
+   const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
+   
+   // Create a deterministic seed based on date and user_id if available
+   let seed = dateString;
+   if (user_id) {
+     seed = `${dateString}-${user_id}`;
+   }
+   
+   // Create a hash from the seed
+   let hash = 0;
+   for (let i = 0; i < seed.length; i++) {
+     hash = (hash << 5) - hash + seed.charCodeAt(i);
+     hash = hash & hash; // Convert to 32bit integer
+   }

    // Get random tarot card from database
    const { data: cards, error: cardsError } = await supabase
      .from('tarot_cards')
      .select('*');
      
    if (cardsError) throw cardsError;
    
+   // Use the hash to select a card deterministically
+   const index = Math.abs(hash) % cards.length;
+   const card = cards[index];
+   
+   // Determine if the card is reversed with a 30% probability
+   const reversalValue = Math.abs((hash >> 4) % 100);
+   const isReversed = reversalValue < 30; // 30% chance of reversal

-   // Get random tarot card from database
-   const { data: card, error } = await supabase
-     .from('tarot_cards')
-     .select('*')
-     .order('RANDOM()')
-     .limit(1)
-     .single();
-
-   if (error) throw error;

    // If user_id is provided, save this reading to user history
    if (user_id) {
      await supabase.from('user_readings').insert({
        user_id,
        card_id: card.id,
+       is_reversed: isReversed,
        reading_type: 'daily',
        created_at: new Date().toISOString(),
      });
    }

    // Return the card data
    return {
      statusCode: 200,
      body: JSON.stringify({
        card,
+       isReversed,
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
