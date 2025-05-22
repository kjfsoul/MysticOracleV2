// client/src/components/sections/DailyCardSection.tsx
import React from 'react';
import DailyCardImproved from '@client/components/tarot/daily-card-improved';
import { id } from 'date-fns/locale';

const DailyCardSection: React.FC = () => {
  return (
    // Section ID matches the scroll link from HeroSection
    <div id="daily-card">
      <DailyCardImproved />
    </div>
  );
};

export default DailyCardSection;
