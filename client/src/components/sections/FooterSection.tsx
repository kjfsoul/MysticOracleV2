// client/src/components/sections/FooterSection.tsx
import React from 'react';

const FooterSection: React.FC = () => {
  return (
    <footer className="relative text-center py-12 px-6 mt-24 border-t border-gray-800/50">
      {/* Background handled by parent CosmicBackground component */}
      <div className="flex flex-col items-center space-y-6 relative z-10">
        {/* Ensure logo path is correct - assumes /public/assets/ */}
        <img src="/assets/mysticarcana-logo-small.png" alt="Mystic Arcana Logo" className="w-16 h-16 opacity-80" />

        {/* Tagline */}
        <p className="text-gray-400 font-serif text-lg">
          Awaken your cosmic self
        </p>

        {/* Footer Links Placeholder (future-proofed) */}
        <div className="text-xs text-gray-600 space-x-4 mt-4">
          <span>© {new Date().getFullYear()} Mystic Arcana</span>
          {/* <a href="/privacy" className="hover:text-white transition">Privacy Policy</a> */}
          {/* <a href="/terms" className="hover:text-white transition">Terms of Service</a> */}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
