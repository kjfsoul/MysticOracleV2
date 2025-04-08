#!/usr/bin/env node

/**
 * Setup Tarot System
 * 
 * This script sets up the tarot deck system by creating the necessary directories
 * and placeholder images, and providing instructions for downloading deck images.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { promisify } from 'util';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Paths
const TAROT_PATH = path.join(projectRoot, 'client/public/images/tarot');
const DECKS_PATH = path.join(TAROT_PATH, 'decks');
const RIDER_WAITE_PATH = path.join(DECKS_PATH, 'rider-waite');
const PLACEHOLDERS_PATH = path.join(TAROT_PATH, 'placeholders');

// Create directories
const directories = [
  TAROT_PATH,
  DECKS_PATH,
  RIDER_WAITE_PATH,
  path.join(RIDER_WAITE_PATH, 'major'),
  path.join(RIDER_WAITE_PATH, 'minor'),
  path.join(RIDER_WAITE_PATH, 'minor/cups'),
  path.join(RIDER_WAITE_PATH, 'minor/wands'),
  path.join(RIDER_WAITE_PATH, 'minor/swords'),
  path.join(RIDER_WAITE_PATH, 'minor/pentacles'),
  PLACEHOLDERS_PATH
];

// Create directories
console.log('Creating directory structure...');
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

// Run the placeholder creation script
console.log('\nCreating placeholder images...');
const createPlaceholders = spawn('node', [path.join(__dirname, 'create-tarot-placeholders.js')], {
  stdio: 'inherit'
});

createPlaceholders.on('close', (code) => {
  if (code === 0) {
    console.log('\nPlaceholder images created successfully!');
    
    // Print instructions
    console.log('\n=== Tarot Deck System Setup ===');
    console.log('\nDirectory structure has been created at:');
    console.log(TAROT_PATH);
    
    console.log('\nTo download the Rider-Waite deck, run:');
    console.log('npm run tarot:download-rider-waite');
    
    console.log('\nTo access the deck management page, visit:');
    console.log('/tarot-decks');
    
    console.log('\nTo add your own deck:');
    console.log('1. Create a new directory under /client/public/images/tarot/decks/');
    console.log('2. Add your card images following the naming convention in the README');
    console.log('3. Update the tarot-deck-config.ts file to include your new deck');
    
    console.log('\nSetup complete!');
  } else {
    console.error('\nError creating placeholder images. Please run manually:');
    console.error('npm run tarot:create-placeholders');
  }
});
