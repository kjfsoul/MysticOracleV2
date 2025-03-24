import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TarotCard from "./tarot-card";
import { CardDefinition, tarotDeck } from "@/data/tarot-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Info, Shuffle } from "lucide-react";

interface TarotDeckProps {
  spread: string;
  onCardSelection: (cards: CardDefinition[]) => void;
  isLoading?: boolean;
}

const getSpreadCardCount = (spread: string): number => {
  switch (spread) {
    case "single": return 1;
    case "past-present-future": return 3;
    case "celtic-cross": return 10;
    default: return 3; // Default to PPF
  }
};

export default function TarotDeck({ 
  spread, 
  onCardSelection, 
  isLoading = false 
}: TarotDeckProps) {
  const [availableCards, setAvailableCards] = useState<CardDefinition[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardDefinition[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [deckShuffled, setDeckShuffled] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const selectionCount = getSpreadCardCount(spread);

  // References for animations
  const deckRef = useRef<HTMLDivElement>(null);

  // Initialize and shuffle the deck
  useEffect(() => {
    // Reset selection when spread changes
    setSelectedCards([]);
    setIsSelecting(false);
    setDeckShuffled(false);

    // Create a new shuffled deck
    const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
    setAvailableCards(shuffledDeck);
  }, [spread]);

  // Handle card click during selection with enhanced animation
  const handleCardClick = (card: CardDefinition, index: number) => {
    if (!isSelecting || selectedCards.length >= selectionCount) return;

    // Play card selection sound (if browser allows)
    try {
      const audio = new Audio();
      audio.src = "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3";
      audio.volume = 0.2;
      audio.play().catch(e => console.log('Audio play prevented by browser policy'));
    } catch (e) {
      console.log('Audio not supported');
    }

    // Visual flash effect via class (we'll add the CSS for this)
    const cardElements = document.querySelectorAll('.card-container');
    const selectedElement = cardElements[index];
    if (selectedElement) {
      selectedElement.classList.add('card-selected-flash');
      setTimeout(() => {
        selectedElement.classList.remove('card-selected-flash');
      }, 600);
    }

    // Add card to selected cards with a slight delay to allow animation to show
    setTimeout(() => {
      setSelectedCards(prev => [...prev, card]);
      
      // Remove selected card from available cards
      setAvailableCards(prev => prev.filter((_, i) => i !== index));
    }, 300);
  };

  const handleStartSelection = () => {
    setIsSelecting(true);
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

    // Shuffle with animation delay
    setTimeout(() => {
      const newShuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
      setAvailableCards(newShuffledDeck);

      // Reset shuffle state after animation completes
      setTimeout(() => {
        setDeckShuffled(false);
      }, 500);
    }, 500);
  };

  // Animation variants
  const deckVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7,
        staggerChildren: 0.05
      }
    },
    shuffle: {
      opacity: 1,
      y: [0, -15, 0],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    },
    shuffleItem: {
      scale: [1, 1.05, 0.98, 1],
      y: [0, -10, 5, 0],
      x: [0, 5, -3, 0],
      rotate: [0, 5, -3, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Spread info */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-light">
          {spread.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Spread
        </h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-light/70 hover:text-light"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Info box */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark/70 border border-light/20 rounded-lg p-4 mb-6 max-w-md"
          >
            <p className="text-light/80 text-sm">
              {spread === "single" && "Draw a single card for quick insight into your question or the day ahead."}
              {spread === "past-present-future" && "This three-card spread reveals influences from your past, current situation, and likely outcome."}
              {spread === "celtic-cross" && "A comprehensive ten-card spread that provides a detailed analysis of your situation, including obstacles, influences, hopes, and outcomes."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card selection UI */}
      <div className="text-center mb-8">
        <p className="text-light/80 mb-6">
          {!isSelecting 
            ? "Shuffle the deck and focus on your question" 
            : `Select ${selectionCount} ${selectionCount === 1 ? 'card' : 'cards'} from the deck (${selectedCards.length}/${selectionCount})`
          }
        </p>
        {!isSelecting && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleShuffleDeck}
              className="bg-indigo-800 hover:bg-indigo-700 flex items-center gap-2"
              disabled={isLoading}
            >
              <Shuffle size={16} />
              Shuffle Deck
            </Button>
            <Button
              onClick={handleStartSelection}
              className="bg-gold hover:bg-gold/80 text-dark flex items-center gap-2"
              disabled={isLoading || deckShuffled}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Select Cards
            </Button>
          </div>
        )}
      </div>

      {/* Tarot Deck */}
      <motion.div className="flex justify-center mb-12"
        ref={deckRef}
        variants={deckVariants}
        initial="initial"
        animate={deckShuffled ? "shuffle" : "animate"}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
          <AnimatePresence>
            {availableCards.slice(0, selectionCount * 3).map((card, index) => (
              <motion.div 
                key={card.id + index}
                variants={cardVariants}
                initial="initial"
                animate={deckShuffled ? "shuffleItem" : "animate"}
                exit="exit"
                layout
                className="card-container"
              >
                <TarotCard
                  onClick={() => handleCardClick(card, index)}
                  card={card}
                  isSelectable={isSelecting && selectedCards.length < selectionCount}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Selected Cards Preview */}
      {selectedCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mb-8"
        >
          <h3 className="text-center text-light/80 mb-4">Selected Cards</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {selectedCards.map((card, index) => (
              <motion.div 
                key={`selected-${card.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TarotCard card={card} isFlipped={true} size="sm" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}