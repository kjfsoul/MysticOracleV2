#!/usr/bin/env node

/**
 * Download Key Rider-Waite Tarot Cards
 * This script downloads a few key Rider-Waite tarot cards from Wikimedia Commons
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { execSync } from 'child_process';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Paths
const DECK_PATH = path.join(projectRoot, 'client/public/images/tarot/decks/rider-waite');
const MAJOR_PATH = path.join(DECK_PATH, 'major');

// Ensure directories exist
if (!fs.existsSync(MAJOR_PATH)) {
  fs.mkdirSync(MAJOR_PATH, { recursive: true });
}

// Key cards to download
const keyCards = [
  { 
    id: '00-fool', 
    url: 'https://upload.wikimedia.org/wikipedia/en/9/90/RWS_Tarot_00_Fool.jpg',
    path: path.join(MAJOR_PATH, '00-fool.jpg')
  },
  { 
    id: '01-magician', 
    url: 'https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg',
    path: path.join(MAJOR_PATH, '01-magician.jpg')
  },
  { 
    id: '02-high-priestess', 
    url: 'https://upload.wikimedia.org/wikipedia/en/8/88/RWS_Tarot_02_High_Priestess.jpg',
    path: path.join(MAJOR_PATH, '02-high-priestess.jpg')
  }
];

// Download each card using curl
for (const card of keyCards) {
  console.log(`Downloading ${card.id}...`);
  try {
    execSync(`curl -o "${card.path}" "${card.url}"`, { stdio: 'inherit' });
    console.log(`Successfully downloaded ${card.id}`);
  } catch (error) {
    console.error(`Failed to download ${card.id}: ${error.message}`);
  }
}

console.log('Download complete!');
