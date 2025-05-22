import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Tarot card data
const tarotDeck = [
  { id: 0, name: 'The Fool', image: '/api/placeholder/180/300', meaning: 'New beginnings, innocence, spontaneity' },
  { id: 1, name: 'The Magician', image: '/api/placeholder/180/300', meaning: 'Manifestation, resourcefulness, power' },
  { id: 2, name: 'The High Priestess', image: '/api/placeholder/180/300', meaning: 'Intuition, unconscious, inner voice' },
  { id: 3, name: 'The Empress', image: '/api/placeholder/180/300', meaning: 'Femininity, beauty, nature, abundance' },
  { id: 4, name: 'The Emperor', image: '/api/placeholder/180/300', meaning: 'Authority, structure, control, leadership' },
  { id: 5, name: 'The Hierophant', image: '/api/placeholder/180/300', meaning: 'Tradition, conformity, morality, ethics' },
  { id: 6, name: 'The Lovers', image: '/api/placeholder/180/300', meaning: 'Love, harmony, relationships, values alignment' },
  { id: 7, name: 'The Chariot', image: '/api/placeholder/180/300', meaning: 'Control, willpower, success, assertion' },
  { id: 8, name: 'Strength', image: '/api/placeholder/180/300', meaning: 'Courage, patience, control, compassion' },
  { id: 9, name: 'The Hermit', image: '/api/placeholder/180/300', meaning: 'Soul-searching, introspection, guidance' },
  // More cards would be added here
];

// Different spread types and their layouts
const spreadTypes = {
  single: { name: 'Single Card', count: 1, positions: ['Present'] },
  threeCard: { name: 'Three Card', count: 3, positions: ['Past', 'Present', 'Future'] },
  celtic: { name: 'Celtic Cross', count: 10, positions: [
    'Present', 'Challenge', 'Foundation', 'Recent Past', 
    'Potential', 'Near Future', 'Self', 'Environment', 
    'Hopes/Fears', 'Outcome'
  ]}
};

// Main component
const TarotReading = () => {
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState('threeCard');
  const [cards, setCards] = useState([]);
  const [shuffling, setShuffling] = useState(false);
  const [reading, setReading] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]);
  const [readingStarted, setReadingStarted] = useState(false);
  const [readingCompleted, setReadingCompleted] = useState(false);

  // Shuffle the deck
  const shuffleDeck = () => {
    setShuffling(true);
    setTimeout(() => {
      const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
      setCards(shuffled.slice(0, spreadTypes[selectedSpread].count));
      setShuffling(false);
      setReadingStarted(true);
    }, 1500);
  };

  // Select a card
  const selectCard = (index) => {
    if (revealedCards.includes(index)) return;
    
    setSelectedCard(index);
    setRevealedCards([...revealedCards, index]);
    
    if (revealedCards.length + 1 === spreadTypes[selectedSpread].count) {
      generateReading();
    }
  };

  // Generate a reading interpretation
  const generateReading = () => {
    setReadingCompleted(true);
    
    // Here, you would typically call your backend API
    // For now, we'll generate a simple interpretation
    const positions = spreadTypes[selectedSpread].positions;
    
    const interpretation = `Based on your question "${question}," the cards reveal: \n` +
      cards.map((card, i) => 
        `${positions[i]}: ${card.name} - ${card.meaning}`
      ).join('\n\n') + 
      '\n\nThis spread suggests that...';
      
    setReading(interpretation);
  };

  // Reset the reading
  const resetReading = () => {
    setQuestion('');
    setCards([]);
    setSelectedCard(null);
    setRevealedCards([]);
    setReading(null);
    setReadingStarted(false);
    setReadingCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-indigo-50 min-h-screen">
      {!readingStarted ? (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-serif text-indigo-900 mb-6 text-center">Mystic Arcana Tarot</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              What question seeks an answer?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Focus your intention..."
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              Choose your spread
            </label>
            <select
              value={selectedSpread}
              onChange={(e) => setSelectedSpread(e.target.value)}
              className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(spreadTypes).map(([key, spread]) => (
                <option key={key} value={key}>{spread.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={shuffleDeck}
            disabled={!question || shuffling}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${!question || shuffling 
                ? 'bg-indigo-300' 
                : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'}`}
          >
            {shuffling ? 'Shuffling cards...' : 'Begin Reading'}
          </button>
        </div>
      ) : readingCompleted ? (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-serif text-indigo-900 mb-6 text-center">Your Reading</h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {cards.map((card, i) => (
              <div key={i} className="relative">
                <img 
                  src={card.image} 
                  alt={card.name}
                  className="h-64 w-40 rounded-lg shadow-md"
                />
                <div className="mt-2 text-center text-sm font-medium text-indigo-900">
                  {spreadTypes[selectedSpread].positions[i]}
                </div>
                <div className="text-center text-xs text-indigo-700">{card.name}</div>
              </div>
            ))}
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-serif text-indigo-900 mb-2">Interpretation</h2>
            <p className="whitespace-pre-line text-indigo-800">{reading}</p>
          </div>
          
          <button
            onClick={resetReading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md text-white font-medium"
          >
            Begin New Reading
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-serif text-indigo-900 mb-6 text-center">Select Your Cards</h1>
          
          <p className="text-center text-indigo-700 mb-6">
            Focus on your question as you select {spreadTypes[selectedSpread].count} cards
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {Array.from({ length: cards.length }).map((_, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                onClick={() => selectCard(i)}
                className={`cursor-pointer ${revealedCards.includes(i) ? '' : 'hover:shadow-lg'}`}
              >
                {revealedCards.includes(i) ? (
                  <img 
                    src={cards[i].image} 
                    alt={cards[i].name} 
                    className="h-64 w-40 rounded-lg shadow-md"
                  />
                ) : (
                  <div className="h-64 w-40 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md flex items-center justify-center">
                    <span className="text-white text-opacity-20 text-4xl font-serif">✦</span>
                  </div>
                )}
                {revealedCards.includes(i) && (
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-indigo-900">
                      {spreadTypes[selectedSpread].positions[i]}
                    </div>
                    <div className="text-xs text-indigo-700">{cards[i].name}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center text-sm text-indigo-500">
            Selected {revealedCards.length} of {spreadTypes[selectedSpread].count} cards
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotReading;