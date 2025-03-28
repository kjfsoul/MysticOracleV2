import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import ZodiacSpread from '@/components/tarot/zodiac-spread';

export default function ZodiacSpreadPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Zodiac Spread"
        subtitle="Discover insights through a specialized tarot spread based on your birth chart"
      />
      <ZodiacSpread />
    </div>
  );
}