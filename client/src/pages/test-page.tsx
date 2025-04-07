import React from 'react';
import Navbar from '@/components/layout/navbar';
import MobileNavigation from '@/components/layout/mobile-navigation';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-light">
            Test Page
          </h1>
          <p className="text-light/80 max-w-2xl mx-auto">
            This is a simple test page to verify routing is working correctly.
          </p>
        </div>
        
        <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6">
          <p className="text-light/90 mb-4">
            If you can see this page, routing is working correctly.
          </p>
          <p className="text-light/90">
            Try accessing the following pages:
          </p>
          <ul className="list-disc list-inside text-light/90 mt-2">
            <li><a href="/tarot" className="text-accent hover:underline">/tarot</a></li>
            <li><a href="/tarot-interpretation" className="text-accent hover:underline">/tarot-interpretation</a></li>
            <li><a href="/agent-learning" className="text-accent hover:underline">/agent-learning</a></li>
          </ul>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
