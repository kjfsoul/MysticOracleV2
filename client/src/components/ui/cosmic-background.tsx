import React, { useEffect, useState } from 'react';
import '../../styles/cosmic-background.css';

interface CosmicBackgroundProps {
  enableShootingStars?: boolean;
  enableMysticSymbols?: boolean;
  enableGlowEffects?: boolean;
}

/**
 * CosmicBackground Component
 *
 * A multi-layered animated cosmic background with stars, shooting stars,
 * and mystic symbols for the Mystic Oracle application.
 */
const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  enableShootingStars = true,
  enableMysticSymbols = true,
  enableGlowEffects = true
}) => {
  const [shootingStars, setShootingStars] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const [glowEffects, setGlowEffects] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  // Generate shooting stars at random intervals
  useEffect(() => {
    if (!enableShootingStars) return;

    // Function to create a shooting star
    const createShootingStar = () => {
      // Use a more unique ID by combining timestamp with a random number
      const id = Date.now() + Math.random();
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      const angle = Math.random() * 60 - 30 + 45; // 45° ± 30°

      const style: React.CSSProperties = {
        left: `${startX}px`,
        top: `${startY}px`,
        transform: `rotate(${angle}deg)`,
        animationDuration: `${3 + Math.random() * 3}s`,
      };

      setShootingStars((prev) => [...prev, { id, style }]);

      // Remove the shooting star after animation completes
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((star) => star.id !== id));
      }, 6000);
    };

    // Create a shooting star immediately
    createShootingStar();

    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      createShootingStar();
    }, 8000 + Math.random() * 10000); // Random interval between 8-18 seconds

    return () => clearInterval(interval);
  }, [enableShootingStars]);

  // Generate glow effects at random positions
  useEffect(() => {
    if (!enableGlowEffects) return;

    // Function to create a glow effect
    const createGlowEffect = () => {
      // Use a more unique ID by combining timestamp with a random number
      const id = Date.now() + Math.random();
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const size = 150 + Math.random() * 300;
      const hue = Math.floor(Math.random() * 60) + 240; // Blue to purple range

      const style: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, hsla(${hue}, 70%, 50%, 0.1) 0%, hsla(${hue}, 70%, 50%, 0) 70%)`,
        animationDelay: `${Math.random() * 10}s`,
      };

      setGlowEffects((prev) => [...prev, { id, style }]);
    };

    // Create initial glow effects
    for (let i = 0; i < 5; i++) {
      createGlowEffect();
    }

    // Periodically refresh glow effects
    const interval = setInterval(() => {
      setGlowEffects(prev => {
        // Remove one random glow effect
        if (prev.length > 0) {
          const indexToRemove = Math.floor(Math.random() * prev.length);
          return [...prev.slice(0, indexToRemove), ...prev.slice(indexToRemove + 1)];
        }
        return prev;
      });

      createGlowEffect();
    }, 20000); // Every 20 seconds

    return () => clearInterval(interval);
  }, [enableGlowEffects]);

  return (
    <div className="cosmic-background">
      {/* Base gradient background */}
      <div className="cosmic-gradient"></div>

      {/* Stars layers for parallax effect */}
      <div className="stars"></div>
      <div className="stars-parallax"></div>

      {/* Mystic symbols layer */}
      {enableMysticSymbols && <div className="mystic-symbols"></div>}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div key={star.id} className="shooting-star" style={star.style}></div>
      ))}

      {/* Glow effects */}
      {glowEffects.map((glow) => (
        <div key={glow.id} className="mystic-glow" style={glow.style}></div>
      ))}
    </div>
  );
};

export default CosmicBackground;
