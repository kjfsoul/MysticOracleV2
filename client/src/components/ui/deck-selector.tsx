import React from 'react';
import { TAROT_DECKS, setActiveDeck, type TarotDeckConfig } from '../../config/tarot-deck-config';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Select } from 'react-day-picker';

interface DeckSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const DeckSelector = ({ className, ...props }: DeckSelectorProps) => {
  return (
    <div {...props} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Select Tarot Deck</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TAROT_DECKS.map((deck: TarotDeckConfig) => (
            <div key={deck.id} className="flex flex-col items-center gap-2" data-testid={`deck-${deck.id}`}>
              <div className="relative w-32 h-48 perspective-1000 group">
                <div className="relative w-full h-full transition-transform duration-500 preserve-3d group-hover:rotate-y-180">
                  <img
                    src={deck.cardBackImage}
                    alt={`${deck.name} card back`}
                    className="absolute w-full h-full object-cover rounded-lg shadow-md backface-hidden"
                    role="img"
                  />
                  <img
                    src={deck.cards[0].image}
                    alt={`${deck.cards[0].name} card front`}
                    className="absolute w-full h-full object-cover rounded-lg shadow-md backface-hidden rotate-y-180"
                    role="img"
                  />
                </div>
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">{deck.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {deck.author} ({deck.year})
                </p>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => setActiveDeck(deck.id)}
                  aria-label={`Select ${deck.name} deck`}
                >
                  Select Deck
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
