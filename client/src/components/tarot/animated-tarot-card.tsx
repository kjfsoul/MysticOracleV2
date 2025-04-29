import type { TarotCard } from "@client/data/tarot-cards";
import "@client/styles/card-flip.css";
import {
  getCardBackPath,
  getTarotCardImagePath,
  handleTarotImageError,
} from "@client/utils/tarot-utils";
import { motion } from "framer-motion"; // Import motion
import React, { useEffect, useState } from "react";

interface AnimatedTarotCardProps {
  card: TarotCard;
  isReversed?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  autoReveal?: boolean;
  revealDelay?: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  showMeaning?: boolean;
  imagePath?: string; // Custom image path override
}

const dimensions = {
  sm: { width: 100, height: 170 },
  md: { width: 140, height: 240 },
  lg: { width: 180, height: 300 },
  xl: { width: 220, height: 370 },
};

// Card reveal animations
const cardRevealAnimations = [
  "glow", // Glowing effect
  "sparkle", // Sparkle effect
  "jump", // Card jumps out
  "pulse", // Card pulses
  "rotate", // Card rotates slightly
];

const AnimatedTarotCard: React.FC<AnimatedTarotCardProps> = ({
  card,
  isReversed = false,
  size = "md",
  autoReveal = false,
  revealDelay = 1500,
  onClick,
  className = "",
  showMeaning = false,
  imagePath,
}) => {
  const [isFlipped, setIsFlipped] = useState(autoReveal);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [revealAnimation, setRevealAnimation] = useState<string>("");

  const { width, height } = dimensions[size];

  useEffect(() => {
    // Use provided imagePath if available, otherwise generate one
    const cardImagePath = imagePath || getTarotCardImagePath(card);
    console.log(
      `Loading image for ${card.name} from ${
        imagePath ? "provided" : "generated"
      } path: ${cardImagePath}`
    );

    const img = new Image();
    img.src = cardImagePath;

    img.onload = () => {
      console.log(`Successfully loaded image: ${cardImagePath}`);
      setImageSrc(cardImagePath);
      setIsLoaded(true);
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${cardImagePath}`);
      // If custom path fails, try the default path as fallback
      if (imagePath && imagePath !== getTarotCardImagePath(card)) {
        console.log(`Trying fallback image path for ${card.name}`);
        const fallbackPath = getTarotCardImagePath(card);
        const fallbackImg = new Image();
        fallbackImg.src = fallbackPath;
        fallbackImg.onload = () => {
          setImageSrc(fallbackPath);
          setIsLoaded(true);
        };
        fallbackImg.onerror = () => {
          handleTarotImageError(card, cardImagePath, setImageSrc);
          setIsLoaded(true);
        };
      } else {
        handleTarotImageError(card, cardImagePath, setImageSrc);
        setIsLoaded(true);
      }
    };

    // Select a random animation for this card reveal
    const randomAnimation =
      cardRevealAnimations[
        Math.floor(Math.random() * cardRevealAnimations.length)
      ];
    setRevealAnimation(randomAnimation);
  }, [card, imagePath]);

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
    setIsFlipped((current) => !current);
    if (onClick) onClick(event);
  };

  // Animation variants based on the selected animation type
  const getCardFrontAnimationClass = () => {
    switch (revealAnimation) {
      case "glow":
        return "animate-glow";
      case "sparkle":
        return "animate-sparkle";
      case "jump":
        return "animate-jump";
      case "pulse":
        return "animate-pulse-card";
      case "rotate":
        return "animate-rotate";
      default:
        return "";
    }
  };

  return (
    <div
      className={`relative perspective-1000 cursor-pointer ${className}`}
      style={{ width, height }}
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30 overflow-hidden"
          style={{
            backgroundImage: `url(${getCardBackPath()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30 overflow-hidden"
          style={{ transform: `rotateY(180deg)` }}
        >
          {isLoaded ? (
            <div className="relative w-full h-full">
              <div
                className={`tarot-card-front ${
                  isFlipped ? getCardFrontAnimationClass() : ""
                }`}
              >
                <img
                  className="w-full h-full object-contain"
                  src={imageSrc || ""}
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
      </motion.div>
    </div>
  );
};

export default AnimatedTarotCard;
