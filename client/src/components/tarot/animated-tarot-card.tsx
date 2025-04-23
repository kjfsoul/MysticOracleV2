import type { TarotCard } from "@client/data/tarot-cards";
import {
  getCardBackPath,
  getTarotCardImagePath,
  handleTarotImageError,
} from "@client/utils/tarot-utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface AnimatedTarotCardProps {
  card: TarotCard;
  isReversed?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  autoReveal?: boolean;
  revealDelay?: number;
  onClick?: () => void;
  className?: string;
  showMeaning?: boolean;
}

/**
 * AnimatedTarotCard Component
 *
 * A tarot card component with flip animation and customizable appearance.
 */
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  // Card dimensions based on size
  const dimensions = {
    sm: { width: 100, height: 170 },
    md: { width: 140, height: 240 },
    lg: { width: 180, height: 300 },
    xl: { width: 220, height: 370 },
  };

  const { width, height } = dimensions[size];

  // Load the card image
  useEffect(() => {
    // ALWAYS generate the path, ignore card.imagePath for now
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
      // Use the utility function for fallback logic
      handleTarotImageError(card, cardImagePath, setImageSrc);
      setIsLoaded(true); // Still mark as loaded even with fallback
    };
  }, [card]);

  // Auto-reveal the card after delay if enabled
  useEffect(() => {
    if (autoReveal && !isFlipped) {
      console.log(`Setting up auto-reveal for card: ${card.name}`);
      const timer = setTimeout(() => {
        console.log(`Auto-revealing card: ${card.name}`);
        setIsFlipped(true);
      }, revealDelay);

      return () => {
        console.log(`Clearing auto-reveal timer for card: ${card.name}`);
        clearTimeout(timer);
      };
    }
  }, [autoReveal, revealDelay, card.name]); // Removed isFlipped dependency to prevent infinite flipping

  // Handle card click
  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (onClick) onClick();
  };

  // Get the card meaning based on orientation
  const cardMeaning = isReversed ? card.meaningReversed : card.meaningUpright;

  return (
    <div
      className={`relative perspective-1000 cursor-pointer ${className}`}
      style={{ width, height }}
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Card Back */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30"
          style={{
            backgroundImage: `url(${getCardBackPath()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: isFlipped ? -1 : 1,
          }}
        />

        {/* Card Front */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30 overflow-hidden rotate-y-180"
          style={{ zIndex: isFlipped ? 1 : -1 }}
        >
          {isLoaded ? (
            <div className="relative w-full h-full">
              {/* Card Image */}
              <img
                className="w-full h-full object-contain"
                src={imageSrc}
                style={{
                  transform: isReversed ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />

              {/* Card Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-sm p-2 text-center">
                <h3 className="text-gold font-heading text-sm md:text-base truncate">
                  {card.name}
                </h3>
                {showMeaning && (
                  <p className="text-light/80 text-xs mt-1 line-clamp-2">
                    {cardMeaning}
                  </p>
                )}
              </div>

              {/* Reversed Indicator */}
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
      </motion.div>
    </div>
  );
};

export default AnimatedTarotCard;
