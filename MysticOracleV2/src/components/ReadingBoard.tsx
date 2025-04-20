import React from 'react';
import { DailyCard } from './DailyCard';

interface ReadingBoardProps {
  cards: Array<{
    name: string;
    image: string;
    description: string;
  }>;
}

export const ReadingBoard: React.FC<ReadingBoardProps> = ({ cards }) => {
  return (
    <div className="reading-board">
      {/* Component implementation will go here */}
    </div>
  );
};
