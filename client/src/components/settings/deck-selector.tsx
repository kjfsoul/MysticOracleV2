import React from 'react';
import { TAROT_DECKS, setActiveDeck, getActiveDeck } from '@client/config/tarot-deck-config';

export const DeckSelector: React.FC = () => {
  const [activeDeck, setActiveState] = React.useState(getActiveDeck().id);

  const handleDeckChange = (deckId: string) => {
    setActiveDeck(deckId);
    setActiveState(deckId);
  };

  return (
    <div className="deck-selector">
      <h3>Select Tarot Deck</h3>
      <div className="deck-options">
        {TAROT_DECKS.map(deck => (
          <div 
            key={deck.id} 
            className={`deck-option ${activeDeck === deck.id ? 'active' : ''}`}
            onClick={() => handleDeckChange(deck.id)}
          >
            <img src={deck.cardBackImage} alt={`${deck.name} card back`} />
            <div className="deck-info">
              <h4>{deck.name}</h4>
              <p>{deck.description}</p>
              <small>{deck.year} • {deck.author}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};