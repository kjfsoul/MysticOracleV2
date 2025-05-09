import React, { useState, useEffect } from 'react';
import { allTarotCards } from '@client/data/tarot-cards';
import { 
  getTarotCardImagePath, 
  debugCardImagePaths,
  verifyRiderWaiteDeckStructure
} from '@client/utils/tarot-utils';

export const TarotPathDebugger: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(allTarotCards[0]);
  const [imagePath, setImagePath] = useState('');
  const [imageExists, setImageExists] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (selectedCard) {
      const path = getTarotCardImagePath(selectedCard);
      setImagePath(path);
      
      // Check if image exists
      const img = new Image();
      img.onload = () => setImageExists(true);
      img.onerror = () => setImageExists(false);
      img.src = path;
    }
  }, [selectedCard]);

  const handleCardSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const card = allTarotCards.find(c => c.id === e.target.value);
    if (card) setSelectedCard(card);
  };

  const handleDebugPaths = () => {
    if (selectedCard) {
      debugCardImagePaths(selectedCard);
    }
  };

  const handleVerifyStructure = async () => {
    setIsVerifying(true);
    await verifyRiderWaiteDeckStructure();
    setIsVerifying(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Tarot Card Path Debugger</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Select Card:</label>
        <select 
          className="w-full p-2 border rounded" 
          value={selectedCard?.id || ''}
          onChange={handleCardSelect}
        >
          {allTarotCards.map(card => (
            <option key={card.id} value={card.id}>
              {card.name} ({card.arcana} {card.suit ? `- ${card.suit}` : ''})
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <p><strong>Generated Path:</strong> {imagePath}</p>
        <p><strong>Image Status:</strong> {imageExists ? '✅ Exists' : '❌ Not Found'}</p>
      </div>
      
      <div className="flex space-x-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleDebugPaths}
        >
          Debug All Possible Paths
        </button>
        
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleVerifyStructure}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Deck Structure'}
        </button>
      </div>
      
      {!imageExists && (
        <div className="mt-4 p-3 bg-yellow-100 border-yellow-300 border rounded">
          <p className="font-bold">Troubleshooting Tips:</p>
          <ol className="list-decimal ml-5">
            <li>Check if the image file exists at the path shown above</li>
            <li>Verify the file extension matches the deck configuration (.jpg, .png, etc.)</li>
            <li>Make sure the card ID format matches the filename</li>
            <li>Check the directory structure (major/minor/suits)</li>
          </ol>
        </div>
      )}
    </div>
  );
};