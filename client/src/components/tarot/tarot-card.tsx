import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Moon, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface TarotCardProps {
  card?: any;
  isFlipped?: boolean;
  isSelectable?: boolean;
  onClick?: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isAnimated?: boolean;
  imageUrl?: string;
  cardName?: string;
  isReversed?: boolean;
  arcana?: string;
  suit?: string;
  number?: string;
}

export default function TarotCard({
  card,
  isFlipped = false,
  isSelectable = false,
  onClick,
  size = "md",
  isAnimated = false,
  imageUrl,
  cardName,
  isReversed = false,
  arcana,
  suit,
  number,
}: TarotCardProps) {
  const [flipped, setFlipped] = useState(isFlipped);
  const [hover, setHover] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loadedImage, setLoadedImage] = useState("");

  // Use provided values or get from card object
  const cardImageUrl =
    imageUrl ||
    (card && card.imagePath) ||
    (card && card.imageUrl) ||
    "/images/tarot/card-back.svg";
  const name = cardName || (card && card.name) || "Unknown Card";
  const cardArcana = arcana || (card && card.arcana) || "";
  const cardSuit = suit || (card && card.suit) || "";
  const cardNumber = number || (card && card.number) || "";

  // Card dimensions based on size
  const dimensions = {
    xs: { width: 80, height: 140 },
    sm: { width: 100, height: 170 },
    md: { width: 130, height: 220 },
    lg: { width: 160, height: 270 },
    xl: { width: 200, height: 340 },
  };

  // Animation variants with enhanced effects
  const cardVariants = {
    initial: {
      scale: 1,
      y: 0,
      boxShadow: `
        0 10px 15px -3px rgba(0, 0, 0, 0.3),
        0 4px 6px -2px rgba(0, 0, 0, 0.1)
      `,
    },
    hover: {
      y: -10,
      boxShadow: `
        0 20px 25px -5px rgba(0, 0, 0, 0.3),
        0 10px 10px -5px rgba(0, 0, 0, 0.2),
        0 0 15px rgba(180, 140, 230, 0.4)
      `,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
      boxShadow: `
        0 10px 15px -3px rgba(0, 0, 0, 0.2),
        0 4px 6px -2px rgba(0, 0, 0, 0.1)
      `,
      transition: { duration: 0.2, ease: "easeIn" },
    },
    selected: {
      scale: 1.05,
      y: -20,
      boxShadow: `
        0 25px 50px -12px rgba(0, 0, 0, 0.4),
        0 0 20px rgba(180, 140, 230, 0.5)
      `,
      transition: {
        duration: 0.5,
        ease: [0.19, 1.0, 0.22, 1.0], // Expo ease out for smooth motion
      },
    },
    flipped: {
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
        delayChildren: 0.2,
      },
    },
    notFlipped: {
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    pulse: {
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 10px 15px -3px rgba(126, 94, 162, 0.4)",
        "0 15px 20px -3px rgba(126, 94, 162, 0.5), 0 0 15px rgba(180, 140, 230, 0.3)",
        "0 10px 15px -3px rgba(126, 94, 162, 0.4)",
      ],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
    enterAnimation: {
      opacity: [0, 1],
      scale: [0.9, 1],
      y: [10, 0],
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Determine card back pattern based on arcana/suit
  const getCardBackPattern = () => {
    if (cardArcana === "major") {
      return "bg-gradient-to-br from-purple-900/90 to-indigo-900/90";
    } else {
      switch (cardSuit) {
        case "wands":
          return "bg-gradient-to-br from-orange-900/90 to-red-900/90"; // Fire
        case "cups":
          return "bg-gradient-to-br from-blue-900/90 to-cyan-900/90"; // Water
        case "swords":
          return "bg-gradient-to-br from-sky-900/90 to-indigo-900/90"; // Air
        case "pentacles":
          return "bg-gradient-to-br from-emerald-900/90 to-green-900/90"; // Earth
        default:
          return "bg-gradient-to-br from-purple-900/90 to-indigo-900/90";
      }
    }
  };

  // Get appropriate symbol based on suit
  const getSuitSymbol = () => {
    if (cardArcana === "major") {
      return <Star className="h-6 w-6 text-gold/80" />;
    } else {
      switch (cardSuit) {
        case "wands":
          return (
            <div className="h-6 w-6 flex items-center justify-center text-amber-500/80 font-bold">
              🔥
            </div>
          );
        case "cups":
          return (
            <div className="h-6 w-6 flex items-center justify-center text-blue-500/80 font-bold">
              💧
            </div>
          );
        case "swords":
          return (
            <div className="h-6 w-6 flex items-center justify-center text-sky-400/80 font-bold">
              💨
            </div>
          );
        case "pentacles":
          return (
            <div className="h-6 w-6 flex items-center justify-center text-emerald-500/80 font-bold">
              🌱
            </div>
          );
        default:
          return <Moon className="h-6 w-6 text-gold/80" />;
      }
    }
  };

  // Preload the image
  useEffect(() => {
    if (cardImageUrl) {
      console.log("Preloading image:", cardImageUrl);
      const img = new Image();
      img.src = cardImageUrl;
      img.onload = () => {
        console.log("Image loaded successfully:", cardImageUrl);
        setIsImageLoaded(true);
        setLoadedImage(cardImageUrl); // Store the loaded image URL
      };
      img.onerror = (error) => {
        console.error("Error loading image:", cardImageUrl, error);
        // Try to load a placeholder instead
        const fallbackPath = getFallbackImagePath();
        console.log("Using fallback image:", fallbackPath);

        // Try to load the fallback image
        const fallbackImg = new Image();
        fallbackImg.src = fallbackPath;
        fallbackImg.onload = () => {
          setLoadedImage(fallbackPath);
          setIsImageLoaded(true);
        };
        fallbackImg.onerror = () => {
          // If even the fallback fails, use the card back
          console.error("Fallback image also failed to load");
          setLoadedImage("/images/tarot/card-back.svg");
          setIsImageLoaded(true);
        };
      };

      // Helper function to get fallback image path
      function getFallbackImagePath() {
        if (cardArcana === "major") {
          // Try to use a specific placeholder for this card if available
          const cardId = cardName?.toLowerCase().replace(/\s+/g, "-");
          if (cardId) {
            const specificPlaceholder = `/images/tarot/placeholders/${cardId}.svg`;
            // Check if the specific placeholder exists
            try {
              const img = new Image();
              img.src = specificPlaceholder;
              return specificPlaceholder;
            } catch (e) {
              // Fall back to generic placeholder
            }
          }
          return "/images/tarot/placeholders/major-placeholder.svg";
        } else if (cardSuit) {
          return `/images/tarot/placeholders/${cardSuit}-placeholder.svg`;
        } else {
          return "/images/tarot/card-back.svg";
        }
      }
    }
  }, [cardImageUrl, cardArcana, cardSuit]);

  // Ensure card name and image consistency
  useEffect(() => {
    if (cardName && isFlipped && !cardImageUrl) {
      console.warn(`Card ${cardName} has no image URL`);
    }
  }, [cardName, cardImageUrl, isFlipped]);

  // Handle click
  const handleClick = () => {
    if (isSelectable) {
      setFlipped(!flipped);
      if (onClick) onClick();
    }
  };

  // Update flipped state if prop changes
  useEffect(() => {
    setFlipped(isFlipped);
  }, [isFlipped]);

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer perspective-1000 transform-style-3d",
        isSelectable ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        width: dimensions[size].width,
        height: dimensions[size].height,
      }}
      variants={cardVariants}
      initial="initial"
      animate={flipped ? "flipped" : isAnimated ? "pulse" : "enterAnimation"}
      whileHover={isSelectable ? "hover" : undefined}
      whileTap={isSelectable ? "tap" : undefined}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={handleClick}
    >
      {/* Card Back */}
      <motion.div
        className={cn(
          "absolute w-full h-full backface-hidden rounded-lg border-2 tarot-card-back overflow-hidden",
          hover && isSelectable
            ? "border-purple-300/70"
            : "border-purple-400/30",
          getCardBackPattern(),
          "mystic-glow"
        )}
        style={{
          backfaceVisibility: "hidden",
          opacity: flipped ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
        animate={{
          zIndex: flipped ? -1 : 1,
        }}
      >
        <div className="absolute inset-0 m-1 rounded-md bg-[url('/images/tarot/card-back-pattern.jpg')] bg-cover bg-center opacity-70">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
            <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center backdrop-blur-sm border border-purple-300/20">
              <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-300/20">
                {getSuitSymbol()}
              </div>
            </div>

            {cardArcana === "major" && cardNumber && (
              <div className="text-white/80 text-xs font-medium">
                {cardNumber}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Card Front */}
      <motion.div
        className={cn(
          "absolute w-full h-full backface-hidden rounded-lg overflow-hidden border-2",
          hover && isSelectable
            ? "border-purple-300/70"
            : "border-purple-400/30",
          "mystic-glow"
        )}
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          opacity: flipped ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        animate={{
          zIndex: flipped ? 1 : -1,
        }}
      >
        <div className="relative w-full h-full bg-gradient-to-b from-slate-800 to-slate-900">
          {/* Card image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                isImageLoaded && loadedImage ? `url(${loadedImage})` : "none",
              transform: isReversed ? "rotate(180deg)" : "none",
            }}
          ></div>

          {/* Loading state */}
          {isFlipped && !isImageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/90 to-slate-900/95">
              <Sparkles className="h-8 w-8 text-purple-300/70 animate-pulse mb-3" />
              <div className="text-center text-purple-200/90 text-sm">
                {name}
              </div>
              <div className="text-center text-purple-400/70 text-xs mt-1">
                {cardArcana === "major"
                  ? "Major Arcana"
                  : `${
                      cardSuit
                        ? cardSuit.charAt(0).toUpperCase() + cardSuit.slice(1)
                        : ""
                    }`}
              </div>
              <div className="mt-4 h-1 w-16 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full">
                <div className="h-full w-1/2 bg-purple-400/80 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          )}

          {/* Card name overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-2 backdrop-blur-sm">
            <p className="text-white text-xs font-medium text-center">
              {name} {isReversed ? "(Reversed)" : ""}
            </p>
            {cardArcana && (
              <p className="text-white/70 text-[10px] text-center mt-0.5">
                {cardArcana === "major"
                  ? "Major Arcana"
                  : `${
                      cardSuit
                        ? cardSuit.charAt(0).toUpperCase() + cardSuit.slice(1)
                        : ""
                    } • ${cardNumber}`}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
