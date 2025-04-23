import { TarotCard } from "@client/data/tarot-cards";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { getDailyCard } from "../utils/tarot-utils";
import TarotCardImage from "./tarot/TarotCardImage";

interface DailyCardProps {
  card?: TarotCard;
  interpretation?: string;
  allCards: TarotCard[];
}

export const DailyCard: React.FC<DailyCardProps> = ({
  card,
  interpretation,
  allCards,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dailyCard, setDailyCard] = useState<TarotCard | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [cardInterpretation, setCardInterpretation] = useState(
    interpretation || ""
  );
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

  // Initialize the daily card
  useEffect(() => {
    if (card) {
      setDailyCard(card);
    } else if (allCards && allCards.length > 0) {
      const { card: selectedCard, isReversed: cardIsReversed } =
        getDailyCard(allCards);
      setDailyCard(selectedCard);
      setIsReversed(cardIsReversed);

      // If no interpretation was provided, generate a simple one
      if (!interpretation) {
        const reversedText = cardIsReversed ? " (Reversed)" : "";
        setCardInterpretation(
          `Today's card is ${selectedCard.name}${reversedText}. ` +
            `This card represents ${selectedCard.keywords.join(", ")}. ` +
            `Reflect on how these energies might manifest in your day.`
        );
      }
    }
  }, [card, allCards, interpretation]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      setIsFlipped(!isFlipped);
    }
  };

  if (!dailyCard) {
    return <div className="tarot-card-loading">Loading your daily card...</div>;
  }

  return (
    <div
      className="tarot-card"
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`${dailyCard.name} card. Press Enter to flip.`}
    >
      <div
        className="card-inner"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "none",
          transition: prefersReducedMotion ? "none" : "transform 0.6s",
        }}
      >
        <div className="card-front">
          <TarotCardImage
            card={dailyCard}
            isReversed={isReversed}
            className="daily-card-image"
          />
        </div>
        <div className="card-back">
          <h3>
            {dailyCard.name}
            {isReversed ? " (Reversed)" : ""}
          </h3>
          <p>{cardInterpretation}</p>
          <div className="card-keywords">
            <strong>Keywords:</strong> {dailyCard.keywords.join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
};
