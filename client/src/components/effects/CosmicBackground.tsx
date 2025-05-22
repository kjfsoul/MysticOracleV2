// client/src/components/effects/CosmicBackground.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import './cosmic-background.css'; // Import the CSS styles
import { ref } from 'process';

const CosmicBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const celestialIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to create a single star
  const createStar = useCallback(() => {
    if (!containerRef.current) return;
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 1 + 1.5}s`; // Vary twinkle speed
    containerRef.current.appendChild(star);

    // Remove star after animation + buffer
    setTimeout(() => star.remove(), 3000);
  }, []);

  // Function to create a shooting star
  const createShootingStar = useCallback(() => {
    if (!containerRef.current) return;
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    const startSide = Math.random() > 0.5 ? 'left' : 'top';
    shootingStar.style[startSide] = `${Math.random() * 80 - 10}%`; // Start off-screen slightly
    if (startSide === 'left') {
      shootingStar.style.top = '-10%';
    } else {
      shootingStar.style.left = '-10%';
    }
    shootingStar.style.animationDuration = `${Math.random() * 3 + 4}s`; // Vary speed
    containerRef.current.appendChild(shootingStar);

    setTimeout(() => shootingStar.remove(), 7000);
  }, []);

  // Function to create celestial groups (Sun + planets, etc.)
  const createCelestialGroup = useCallback(() => {
    if (!containerRef.current) return;

    const celestialGroups: Record<string, string[]> = {
      'sun': ['mercury', 'venus'], // Simplified group
      'planet': ['moon'],
      'black-hole': [],
      'moon': []
    };
    const mainTypes = ['sun', 'planet', 'black-hole', 'moon'];
    const mainType = mainTypes[Math.floor(Math.random() * mainTypes.length)];
    const group = celestialGroups[mainType] || [];

    const createSingleCelestial = (type: string, delay: number = 0) => {
      if (!containerRef.current) return;
      const celestial = document.createElement('div');
      celestial.classList.add('celestial', type);
      // TODO: Use actual images for celestial types
      // celestial.style.backgroundImage = `url('/assets/celestials/${type}.png')`; 
      celestial.style.width = type === 'sun' ? '80px' : type === 'planet' ? '50px' : type === 'moon' ? '20px' : '40px';
      celestial.style.height = celestial.style.width;
      celestial.style.position = 'absolute'; // Ensure positioning context
      celestial.style.top = `${Math.random() * 70 + 10}%`; // Avoid edges initially
      celestial.style.left = `${Math.random() * 70 + 10}%`;
      celestial.style.opacity = '0'; // Start faded out

      setTimeout(() => { // Stagger appearance
        if (containerRef.current) {
          containerRef.current.appendChild(celestial);
          // Fade in
          setTimeout(() => celestial.style.opacity = '0.8', 100);
          // Start sharpening after 30s
          setTimeout(() => celestial.classList.add('focused'), 30000);
          // Add float animation if applicable
          if (['planet', 'moon', 'sun'].includes(type)) {
             setTimeout(() => celestial.classList.add('float'), 31000); // Start floating after sharpening starts
          }
          // Remove after 60s total
          setTimeout(() => celestial.remove(), 60000);
        }
      }, delay);
    };

    // Create main celestial
    createSingleCelestial(mainType);

    // Create nearby bodies after short delay
    group.forEach((body, index) => {
      createSingleCelestial(body, 3000 * (index + 1)); // Staggered appearance
    });

  }, []);

  // Effect to manage intervals
  useEffect(() => {
    if (!containerRef.current) return;

    // Initial stars
    for (let i = 0; i < 50; i++) createStar();

    // Continuous stars & shooting stars
    starIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) createShootingStar();
      createStar();
    }, 500); // Adjust frequency as needed

    // Randomly timed celestial groups (average 15s)
    const scheduleCelestial = () => {
      createCelestialGroup();
      const nextDelay = Math.random() * (18000 - 12000) + 12000; // 12-18 seconds
      celestialIntervalRef.current = setTimeout(scheduleCelestial, nextDelay);
    };
    scheduleCelestial(); // Start the first one

    // Cleanup intervals on unmount
    return () => {
      if (starIntervalRef.current) clearInterval(starIntervalRef.current);
      if (celestialIntervalRef.current) clearTimeout(celestialIntervalRef.current);
    };
  }, [createStar, createShootingStar, createCelestialGroup]);

  return (
    <div ref={containerRef} className="background-stars fixed inset-0 z-[-1] overflow-hidden">
      {/* Stars, shooting stars, and celestial elements are added dynamically here */}
    </div>
  );
};

export default CosmicBackground;
