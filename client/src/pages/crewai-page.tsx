import React from 'react';
import { Helmet } from 'react-helmet';
import CrewAIConnector from '@/components/crewai/crewai-connector';

/**
 * CrewAI Page
 * 
 * This page provides an interface for interacting with the CrewAI integration.
 */
const CrewAIPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>CrewAI Integration | Mystic Oracle</title>
        <meta name="description" content="Interact with CrewAI agents for tarot readings, UI analysis, and more" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gold mb-2">CrewAI Integration</h1>
        <p className="text-light/80 mb-8">
          Interact with autonomous AI agents powered by CrewAI. These agents can provide tarot readings,
          analyze UI, assist with development, and more.
        </p>
        
        <CrewAIConnector />
        
        <div className="mt-12 bg-primary-10 border border-gold/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gold mb-4">About CrewAI</h2>
          <p className="text-light/80 mb-4">
            CrewAI is a framework for creating and orchestrating autonomous AI agents that can work together
            to accomplish complex tasks. The Mystic Oracle application uses CrewAI to power various features
            and provide enhanced capabilities.
          </p>
          
          <h3 className="text-lg font-bold text-gold mb-2">Available Crews</h3>
          <ul className="list-disc list-inside space-y-2 text-light/80 mb-4">
            <li>
              <strong className="text-gold">Tarot Crew</strong> - Specialized in tarot card readings and interpretations
            </li>
            <li>
              <strong className="text-gold">Development Crew</strong> - Focused on UI analysis, code generation, and testing
            </li>
            <li>
              <strong className="text-gold">Astrology Crew</strong> - Experts in astrological charts and interpretations (Coming Soon)
            </li>
          </ul>
          
          <p className="text-light/80">
            To use these features, make sure the CrewAI server is running. You can start it by running
            <code className="bg-primary/30 px-2 py-1 rounded mx-1">python main.py</code>
            in the <code className="bg-primary/30 px-2 py-1 rounded">crewai</code> directory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrewAIPage;
