import React, { useState, useEffect } from 'react';
import { TAROT_DECKS, getActiveDeck, setActiveDeck } from '../../config/tarot-deck-config';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface DeckSelectorProps {
  onDeckChange?: (deckId: string) => void;
  className?: string;
}

export default function DeckSelector({ onDeckChange, className }: DeckSelectorProps) {
  const [selectedDeckId, setSelectedDeckId] = useState(getActiveDeck().id);

  const handleDeckChange = (deckId: string) => {
    setSelectedDeckId(deckId);
    setActiveDeck(deckId);
    if (onDeckChange) {
      onDeckChange(deckId);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Tarot Deck</CardTitle>
        <CardDescription>Select which tarot deck to use for readings</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedDeckId} onValueChange={handleDeckChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a deck" />
          </SelectTrigger>
          <SelectContent>
            {TAROT_DECKS.map((deck) => (
              <SelectItem key={deck.id} value={deck.id}>
                {deck.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {TAROT_DECKS.find(deck => deck.id === selectedDeckId)?.description}
        </p>
      </CardFooter>
    </Card>
  );
}
