// client/src/components/sections/FeaturesSection.tsx
import { id } from 'date-fns/locale';
import React from 'react';

// Define structure for feature items
interface FeatureItem {
  icon: string; // Path to icon asset
  alt: string;
  title: string;
  description: string;
  link?: string; // Optional link for the feature
}

const features: FeatureItem[] = [
  {
    icon: '/assets/tarot-icon.png', // Assumes DALL-E generated icon saved here
    alt: 'Tarot Readings Icon',
    title: 'Tarot Readings',
    description: 'Personalized guidance through the ancient cards.',
    // link: '/tarot'
  },
  {
    icon: '/assets/astrology-icon.png', // Assumes DALL-E generated icon saved here
    alt: 'Astrology Charts Icon',
    title: 'Astrology Charts',
    description: 'Navigate your cosmic destiny through the stars.',
    // link: '/astrology'
  },
  {
    icon: '/assets/journal-icon.png', // Assumes DALL-E generated icon saved here
    alt: 'Cosmic Journal Icon',
    title: 'Cosmic Journal',
    description: 'Reflect, grow, and manifest your journey.',
    // link: '/journal'
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="relative text-center py-24 px-6 overflow-hidden">
      {/* Background handled by parent CosmicBackground component */}
      <h2 className="text-3xl md:text-5xl font-serif text-gold mb-12">
        Mystical Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 z-10 relative max-w-5xl mx-auto">
        {features.map((feature) => (
          // TODO: Wrap with Link component if links are added
          <div key={feature.title} className="p-8 bg-gradient-to-b from-indigo-800/80 via-purple-800/80 to-black/80 rounded-lg shadow-lg hover:scale-105 transform transition backdrop-blur-sm border border-purple-900/50">
            <img src={feature.icon} alt={feature.alt} className="mx-auto mb-4 w-16 h-16" />
            <h3 className="text-2xl font-serif text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
