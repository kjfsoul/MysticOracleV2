
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gold mb-2">{title}</h1>
      {subtitle && <p className="text-light/70 md:text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
