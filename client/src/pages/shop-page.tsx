
import React from 'react';

const ShopPage = () => {
  const products = [
    {
      id: 1,
      name: 'Mystic Tarot Deck',
      description: 'Our signature tarot deck with beautiful custom artwork',
      price: 39.99,
      image: '/images/shop/tarot-deck.jpg',
      category: 'Tarot'
    },
    {
      id: 2,
      name: 'Zodiac Journal',
      description: 'Track your daily horoscope and reflections in this beautiful journal',
      price: 24.99,
      image: '/images/shop/zodiac-journal.jpg',
      category: 'Stationery'
    },
    {
      id: 3,
      name: 'Crystal Starter Kit',
      description: 'A collection of 5 essential crystals for beginners',
      price: 29.99,
      image: '/images/shop/crystal-kit.jpg',
      category: 'Crystals'
    },
    {
      id: 4,
      name: 'Astrology Birth Chart Poster',
      description: 'Custom printed birth chart with detailed explanations',
      price: 49.99,
      image: '/images/shop/birth-chart-poster.jpg',
      category: 'Astrology'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Mystic Shop</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/300x300?text=${product.category}`;
                }}
              />
            </div>
            <div className="p-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full mb-2">
                {product.category}
              </span>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${product.price}</span>
                <button className="bg-indigo-600 text-white py-1 px-3 rounded text-sm hover:bg-indigo-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
