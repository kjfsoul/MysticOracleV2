import React, { useEffect, useState, useRef } from 'react';
import '../../styles/cosmic-background.css';

interface EnhancedCosmicBackgroundProps {
  enableShootingStars?: boolean;
  enableMysticSymbols?: boolean;
  enableGlowEffects?: boolean;
  density?: 'low' | 'medium' | 'high';
  colorScheme?: 'default' | 'blue' | 'purple' | 'gold';
}

/**
 * EnhancedCosmicBackground Component
 *
 * An improved version of the cosmic background with more customization options,
 * better performance, and enhanced visual effects.
 */
const EnhancedCosmicBackground: React.FC<EnhancedCosmicBackgroundProps> = ({
  enableShootingStars = true,
  enableMysticSymbols = false,
  enableGlowEffects = true,
  density = 'medium',
  colorScheme = 'default',
}) => {
  const [shootingStars, setShootingStars] = useState<
    { id: number; style: React.CSSProperties }[]
  >([]);
  const [glowEffects, setGlowEffects] = useState<
    { id: number; style: React.CSSProperties }[]
  >([]);
  
  // Refs to store intervals for cleanup
  const shootingStarIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const glowEffectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Determine star density
  const getStarDensity = () => {
    switch (density) {
      case 'low': return 'opacity-20';
      case 'high': return 'opacity-50';
      default: return 'opacity-30'; // medium
    }
  };
  
  // Determine color scheme
  const getColorScheme = () => {
    switch (colorScheme) {
      case 'blue': return 'cosmic-gradient-blue';
      case 'purple': return 'cosmic-gradient-purple';
      case 'gold': return 'cosmic-gradient-gold';
      default: return 'cosmic-gradient';
    }
  };

  // Generate shooting stars at random intervals
  useEffect(() => {
    if (!enableShootingStars) return;

    // Function to create a shooting star
    const createShootingStar = () => {
      const id = Date.now() + Math.random();
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * (window.innerHeight / 2); // Start in top half
      const angle = Math.random() * 60 - 30 + 45; // 45° ± 30°
      const duration = 2 + Math.random() * 4; // 2-6 seconds
      const size = 80 + Math.random() * 40; // 80-120px
      const opacity = 0.7 + Math.random() * 0.3; // 0.7-1.0

      const style: React.CSSProperties = {
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${size}px`,
        transform: `rotate(${angle}deg)`,
        animationDuration: `${duration}s`,
        opacity: opacity,
      };

      setShootingStars((prev) => [...prev, { id, style }]);

      // Remove the shooting star after animation completes
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((star) => star.id !== id));
      }, duration * 1000 + 100);
    };

    // Create a shooting star immediately
    createShootingStar();

    // Create shooting stars at random intervals based on density
    const intervalTime = density === 'high' ? 5000 : density === 'low' ? 15000 : 10000;
    const randomFactor = intervalTime / 2;
    
    shootingStarIntervalRef.current = setInterval(() => {
      createShootingStar();
    }, intervalTime + Math.random() * randomFactor);

    return () => {
      if (shootingStarIntervalRef.current) {
        clearInterval(shootingStarIntervalRef.current);
      }
    };
  }, [enableShootingStars, density]);

  // Generate glow effects at random positions
  useEffect(() => {
    if (!enableGlowEffects) return;

    // Function to create a glow effect
    const createGlowEffect = () => {
      const id = Date.now() + Math.random();
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const size = 150 + Math.random() * 300;
      
      // Color based on color scheme
      let hue = 260; // Default purple
      if (colorScheme === 'blue') hue = 220;
      if (colorScheme === 'gold') hue = 45;
      
      // Add some variation
      hue += Math.floor(Math.random() * 30) - 15;

      const style: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, hsla(${hue}, 70%, 50%, 0.1) 0%, hsla(${hue}, 70%, 50%, 0) 70%)`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
      };

      setGlowEffects((prev) => [...prev, { id, style }]);
    };

    // Number of glow effects based on density
    const numGlowEffects = density === 'high' ? 8 : density === 'low' ? 3 : 5;
    
    // Create initial glow effects
    for (let i = 0; i < numGlowEffects; i++) {
      createGlowEffect();
    }

    // Periodically refresh glow effects
    glowEffectIntervalRef.current = setInterval(() => {
      setGlowEffects((prev) => {
        // Remove one random glow effect
        if (prev.length > 0) {
          const indexToRemove = Math.floor(Math.random() * prev.length);
          return [
            ...prev.slice(0, indexToRemove),
            ...prev.slice(indexToRemove + 1),
          ];
        }
        return prev;
      });

      createGlowEffect();
    }, 15000); // Every 15 seconds

    return () => {
      if (glowEffectIntervalRef.current) {
        clearInterval(glowEffectIntervalRef.current);
      }
    };
  }, [enableGlowEffects, density, colorScheme]);

  return (
    <div className="cosmic-background">
      {/* Base gradient background */}
      <div className={getColorScheme()}></div>

      {/* Stars layers for parallax effect */}
      <div className={`stars ${getStarDensity()}`}></div>
      <div className={`stars-parallax ${getStarDensity()}`}></div>

      {/* Mystic symbols layer */}
      {enableMysticSymbols && (
        <div className={`mystic-symbols ${density === 'low' ? 'opacity-[0.03]' : density === 'high' ? 'opacity-[0.08]' : 'opacity-[0.05]'}`}></div>
      )}

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

export default EnhancedCosmicBackground;
