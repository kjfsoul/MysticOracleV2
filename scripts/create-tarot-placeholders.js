#!/usr/bin/env node

/**
 * Create Tarot Card Placeholder Images
 * 
 * This script creates placeholder SVG images for tarot cards that might be missing.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Paths
const PLACEHOLDERS_PATH = path.join(projectRoot, 'client/public/images/tarot/placeholders');

// Ensure directory exists
if (!fs.existsSync(PLACEHOLDERS_PATH)) {
  fs.mkdirSync(PLACEHOLDERS_PATH, { recursive: true });
}

// Create placeholder SVGs
const placeholders = [
  { name: 'major-placeholder.svg', title: 'Major Arcana', color: '#9333EA' },
  { name: 'cups-placeholder.svg', title: 'Cups', color: '#3B82F6' },
  { name: 'wands-placeholder.svg', title: 'Wands', color: '#F59E0B' },
  { name: 'swords-placeholder.svg', title: 'Swords', color: '#6B7280' },
  { name: 'pentacles-placeholder.svg', title: 'Pentacles', color: '#10B981' },
  { name: 'minor-placeholder.svg', title: 'Minor Arcana', color: '#6366F1' }
];

// Function to create an SVG placeholder
function createPlaceholderSVG(title, color) {
  return `<svg width="500" height="800" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="800" rx="20" fill="#1E1B4B" />
  <rect x="10" y="10" width="480" height="780" rx="15" stroke="${color}" stroke-width="2" fill="none" />
  <text x="250" y="400" font-family="serif" font-size="32" text-anchor="middle" fill="#FFFFFF">Tarot Card</text>
  <text x="250" y="450" font-family="serif" font-size="24" text-anchor="middle" fill="${color}">${title}</text>
  <text x="250" y="500" font-family="serif" font-size="18" text-anchor="middle" fill="#FFFFFF">Placeholder Image</text>
  <circle cx="250" cy="250" r="100" fill="none" stroke="${color}" stroke-width="2" />
  <path d="M250,150 L250,350 M150,250 L350,250" stroke="${color}" stroke-width="2" />
</svg>`;
}

// Create each placeholder
placeholders.forEach(placeholder => {
  const svgContent = createPlaceholderSVG(placeholder.title, placeholder.color);
  const filePath = path.join(PLACEHOLDERS_PATH, placeholder.name);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created placeholder: ${filePath}`);
});

// Create a card back image placeholder
const cardBackSVG = `<svg width="500" height="800" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="800" rx="20" fill="#1E1B4B" />
  <rect x="10" y="10" width="480" height="780" rx="15" stroke="#9333EA" stroke-width="2" fill="none" />
  <text x="250" y="400" font-family="serif" font-size="32" text-anchor="middle" fill="#FFFFFF">Mystic Arcana</text>
  <text x="250" y="450" font-family="serif" font-size="24" text-anchor="middle" fill="#9333EA">Tarot Deck</text>
  <pattern id="pattern1" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(45)">
    <rect width="25" height="25" fill="#2D2A6E" />
  </pattern>
  <rect x="50" y="100" width="400" height="600" rx="10" fill="url(#pattern1)" />
  <circle cx="250" cy="250" r="80" fill="none" stroke="#9333EA" stroke-width="2" />
  <path d="M250,170 L250,330 M170,250 L330,250" stroke="#9333EA" stroke-width="2" />
</svg>`;

const cardBackPath = path.join(projectRoot, 'client/public/images/tarot/card-back.svg');
fs.writeFileSync(cardBackPath, cardBackSVG);
console.log(`Created card back: ${cardBackPath}`);

console.log('All placeholder images created successfully!');
