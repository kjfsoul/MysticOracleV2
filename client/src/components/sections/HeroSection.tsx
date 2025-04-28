// client/src/components/sections/HeroSection.tsx
import { id } from 'date-fns/locale';
import { a } from 'framer-motion/dist/types.d-B50aGbjN';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-center py-24 px-6 overflow-hidden">
      {/* Ensure logo path is correct - assumes /public/assets/ */}
      <img src="/assets/mysticarcana-logo.png" alt="Mystic Arcana Logo" className="mx-auto mb-6 w-28 h-28 md:w-32 md:h-32" />
      <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-wide drop-shadow-lg">
        Discover Your Cosmic Path
      </h1>
      <p className="text-lg md:text-2xl text-gray-300 mb-8">
        Daily guidance, celestial insights, and mystical magic await you.
      </p>
      {/* Button scrolls to the section with id='daily-card' */}
      <a href="#daily-card" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105">
        Begin Your Journey
      </a>
    </section>
  );
};

export default HeroSection;
