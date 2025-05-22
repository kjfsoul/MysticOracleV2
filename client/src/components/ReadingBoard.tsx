import { TarotCard } from "@client/data/tarot-cards";
import React from "react";
import { DailyCard } from "./DailyCard";

interface ReadingBoardProps {
  cards: TarotCard[];
  layout: "daily" | "three-card" | "celtic-cross";
  interpretations?: Record<string, string>;
}

export const ReadingBoard: React.FC<ReadingBoardProps> = ({
  cards,
  layout,
  interpretations = {},
}) => {
  // Get all cards for the daily card component
  const allCards = cards;

  return (
    <div className={`reading-board ${layout}`}>
      {layout === "daily" && cards.length > 0 ? (
        <DailyCard
          card={cards[0]}
          interpretation={interpretations[cards[0].id]}
          allCards={allCards}
        />
      ) : (
        cards.map((card) => (
          <DailyCard
            key={card.id}
            card={card}
            interpretation={interpretations[card.id]}
            allCards={allCards}
          />
        ))
      )}
    </div>
  );
};
