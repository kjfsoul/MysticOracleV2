import React from 'react';
// prettier-ignore
import { animate, motion } from 'framer-motion'; // eslint-disable-line

const EnhancedCosmicBackground: React.FC = () => (
  <motion.div
    className="fixed inset-0 z-0 cosmic-gradient"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2 }}
  >
    <div className="absolute inset-0 animate-pulse-slow opacity-20" />
  </motion.div>
);

export default EnhancedCosmicBackground;
