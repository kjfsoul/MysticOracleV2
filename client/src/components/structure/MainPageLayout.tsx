// client/src/components/structure/MainPageLayout.tsx
import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import DailyCardSection from '@/components/sections/DailyCardSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import FooterSection from '@/components/sections/FooterSection';
import CosmicBackground from '@/components/effects/CosmicBackground';

const MainPageLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Cosmic Background Layer - ensure z-index places it behind content */}
      <CosmicBackground />

      {/* Content Sections - ensure z-index places them above background */}
      <main className="relative z-10">
        <HeroSection />
        <DailyCardSection />
        <FeaturesSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default MainPageLayout;
