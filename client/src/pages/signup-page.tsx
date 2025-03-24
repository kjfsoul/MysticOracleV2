
import React from 'react';
import { Link } from 'react-router-dom';
import { SignupForm } from '../components/auth/signup-form';
import { TarotCardMini } from '../components/tarot/tarot-card';
import { tarotData } from '../data/tarot-data';

const SignupPage = () => {
  // Get 3 random cards for preview
  const getRandomCards = () => {
    const shuffled = [...tarotData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };
  
  const previewCards = getRandomCards();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Join Our Mystic Community</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <SignupForm />
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Why Join Us?</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Sample Tarot Reading</h3>
              <div className="flex justify-center space-x-2 mb-4">
                {previewCards.map((card, index) => (
                  <div key={index} className="transform hover:scale-105 transition-transform" style={{width: '80px'}}>
                    <TarotCardMini 
                      card={card} 
                      isFlipped={true} 
                      miniVersion={true}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-center italic">Experience full readings after signup!</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Birth Chart Analysis</h3>
              <div className="flex justify-center mb-4">
                <img 
                  src="/images/astrology/sample-chart.png" 
                  alt="Sample Birth Chart" 
                  className="w-40 h-40 rounded-full border-2 border-purple-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholders/birth-chart-placeholder.jpg';
                    // If that fails too, use a generic fallback
                    target.onerror = () => {
                      target.src = '/images/placeholders/default-placeholder.jpg';
                      target.onerror = null; // Prevent infinite loop
                    };
                  }}
                />
              </div>
              <p className="text-sm text-center italic">Discover your cosmic blueprint!</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Link to="/blog" className="bg-indigo-600 text-white py-2 px-4 rounded text-center hover:bg-indigo-700 transition-colors">
                Explore Blog
              </Link>
              <Link to="/shop" className="bg-pink-600 text-white py-2 px-4 rounded text-center hover:bg-pink-700 transition-colors">
                Visit Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
