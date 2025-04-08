#!/usr/bin/env node

/**
 * Simple Rider-Waite Tarot Deck Downloader
 * 
 * This script downloads Rider-Waite tarot deck images from a reliable source
 * and saves them to the appropriate directories.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Paths
const DECK_PATH = path.join(projectRoot, 'client/public/images/tarot/decks/rider-waite');
const MAJOR_PATH = path.join(DECK_PATH, 'major');
const MINOR_CUPS_PATH = path.join(DECK_PATH, 'minor/cups');
const MINOR_WANDS_PATH = path.join(DECK_PATH, 'minor/wands');
const MINOR_SWORDS_PATH = path.join(DECK_PATH, 'minor/swords');
const MINOR_PENTACLES_PATH = path.join(DECK_PATH, 'minor/pentacles');

// Ensure directories exist
[MAJOR_PATH, MINOR_CUPS_PATH, MINOR_WANDS_PATH, MINOR_SWORDS_PATH, MINOR_PENTACLES_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Skipping existing file: ${filepath}`);
      resolve();
      return;
    }

    console.log(`Downloading: ${url} to ${filepath}`);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
        file.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file if there's an error
          reject(`Error writing file: ${err.message}`);
        });
      } else {
        console.log(`Failed to download ${url}: ${response.statusCode}`);
        // Create a placeholder file instead
        fs.copyFileSync(
          path.join(projectRoot, 'client/public/images/tarot/placeholders/major-placeholder.svg'), 
          filepath
        );
        console.log(`Created placeholder for: ${filepath}`);
        resolve();
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${url}: ${err.message}`);
      // Create a placeholder file instead
      try {
        fs.copyFileSync(
          path.join(projectRoot, 'client/public/images/tarot/placeholders/major-placeholder.svg'), 
          filepath
        );
        console.log(`Created placeholder for: ${filepath}`);
        resolve();
      } catch (copyErr) {
        reject(`Error creating placeholder: ${copyErr.message}`);
      }
    });
  });
}

// Card definitions
const majorArcana = [
  { id: '00-fool', name: 'The Fool' },
  { id: '01-magician', name: 'The Magician' },
  { id: '02-high-priestess', name: 'The High Priestess' },
  { id: '03-empress', name: 'The Empress' },
  { id: '04-emperor', name: 'The Emperor' },
  { id: '05-hierophant', name: 'The Hierophant' },
  { id: '06-lovers', name: 'The Lovers' },
  { id: '07-chariot', name: 'The Chariot' },
  { id: '08-strength', name: 'Strength' },
  { id: '09-hermit', name: 'The Hermit' },
  { id: '10-wheel-of-fortune', name: 'Wheel of Fortune' },
  { id: '11-justice', name: 'Justice' },
  { id: '12-hanged-man', name: 'The Hanged Man' },
  { id: '13-death', name: 'Death' },
  { id: '14-temperance', name: 'Temperance' },
  { id: '15-devil', name: 'The Devil' },
  { id: '16-tower', name: 'The Tower' },
  { id: '17-star', name: 'The Star' },
  { id: '18-moon', name: 'The Moon' },
  { id: '19-sun', name: 'The Sun' },
  { id: '20-judgement', name: 'Judgement' },
  { id: '21-world', name: 'The World' }
];

const minorRanks = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'page', 'knight', 'queen', 'king'];
const suits = ['cups', 'wands', 'swords', 'pentacles'];

// Sources for Rider-Waite images (try multiple sources)
const sources = [
  // Source 1: GitHub repository
  {
    baseUrl: 'https://raw.githubusercontent.com/davidpots/tarot-flashcards/master/deck/',
    majorFormat: (id) => `major-${id}.jpg`,
    minorFormat: (suit, rank, rankNum) => `minor-${suit}-${rankNum}-${rank}.jpg`
  },
  // Source 2: Alternative source
  {
    baseUrl: 'https://www.sacred-texts.com/tarot/pkt/img/',
    majorFormat: (id) => {
      const num = id.split('-')[0];
      return `ar${num}.jpg`;
    },
    minorFormat: (suit, rank, rankNum) => {
      let suitCode;
      switch (suit) {
        case 'cups': suitCode = 'cu'; break;
        case 'wands': suitCode = 'wa'; break;
        case 'swords': suitCode = 'sw'; break;
        case 'pentacles': suitCode = 'pe'; break;
      }
      
      let rankCode;
      if (rank === 'ace') rankCode = '01';
      else if (rank === 'two') rankCode = '02';
      else if (rank === 'three') rankCode = '03';
      else if (rank === 'four') rankCode = '04';
      else if (rank === 'five') rankCode = '05';
      else if (rank === 'six') rankCode = '06';
      else if (rank === 'seven') rankCode = '07';
      else if (rank === 'eight') rankCode = '08';
      else if (rank === 'nine') rankCode = '09';
      else if (rank === 'ten') rankCode = '10';
      else if (rank === 'page') rankCode = 'pa';
      else if (rank === 'knight') rankCode = 'kn';
      else if (rank === 'queen') rankCode = 'qu';
      else if (rank === 'king') rankCode = 'ki';
      
      return `${suitCode}${rankCode}.jpg`;
    }
  }
];

// Try downloading from multiple sources
async function tryDownloadFromSources(filepath, urlGenerators) {
  for (const generator of urlGenerators) {
    try {
      await downloadImage(generator(), filepath);
      return true; // Successfully downloaded
    } catch (error) {
      console.log(`Failed from source: ${error}`);
      // Continue to next source
    }
  }
  
  console.log(`Failed to download from all sources for: ${filepath}`);
  return false;
}

// Main function to download all cards
async function downloadRiderWaiteDeck() {
  console.log('Starting download of Rider-Waite deck...');
  let successCount = 0;
  let failCount = 0;
  
  // Download major arcana
  for (const card of majorArcana) {
    const filename = `${card.id}.jpg`;
    const filepath = path.join(MAJOR_PATH, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    const urlGenerators = sources.map(source => 
      () => `${source.baseUrl}${source.majorFormat(card.id)}`
    );
    
    const success = await tryDownloadFromSources(filepath, urlGenerators);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Download minor arcana
  for (const suit of suits) {
    for (const rank of minorRanks) {
      const filename = `${rank}-${suit}.jpg`;
      let filepath;
      
      switch (suit) {
        case 'cups':
          filepath = path.join(MINOR_CUPS_PATH, filename);
          break;
        case 'wands':
          filepath = path.join(MINOR_WANDS_PATH, filename);
          break;
        case 'swords':
          filepath = path.join(MINOR_SWORDS_PATH, filename);
          break;
        case 'pentacles':
          filepath = path.join(MINOR_PENTACLES_PATH, filename);
          break;
      }
      
      // Skip if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`Skipping existing file: ${filepath}`);
        successCount++;
        continue;
      }
      
      // Get rank number for URL formatting
      let rankNum;
      if (rank === 'ace') rankNum = '01';
      else if (rank === 'two') rankNum = '02';
      else if (rank === 'three') rankNum = '03';
      else if (rank === 'four') rankNum = '04';
      else if (rank === 'five') rankNum = '05';
      else if (rank === 'six') rankNum = '06';
      else if (rank === 'seven') rankNum = '07';
      else if (rank === 'eight') rankNum = '08';
      else if (rank === 'nine') rankNum = '09';
      else if (rank === 'ten') rankNum = '10';
      else if (rank === 'page') rankNum = '11';
      else if (rank === 'knight') rankNum = '12';
      else if (rank === 'queen') rankNum = '13';
      else if (rank === 'king') rankNum = '14';
      
      const urlGenerators = sources.map(source => 
        () => `${source.baseUrl}${source.minorFormat(suit, rank, rankNum)}`
      );
      
      const success = await tryDownloadFromSources(filepath, urlGenerators);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }
  
  console.log('\nDownload summary:');
  console.log(`Successfully downloaded/processed: ${successCount} cards`);
  console.log(`Failed to download: ${failCount} cards`);
  console.log(`Total cards: ${successCount + failCount}`);
  
  if (failCount > 0) {
    console.log('\nSome cards could not be downloaded. Placeholder images have been created instead.');
    console.log('You may want to manually download these cards from another source.');
  }
  
  console.log(`\nDeck saved to: ${DECK_PATH}`);
}

// Create placeholder images first
console.log('Creating placeholder images...');
try {
  // Run the placeholder creation script
  const placeholderScript = path.join(__dirname, 'create-tarot-placeholders.js');
  if (fs.existsSync(placeholderScript)) {
    const { execSync } = require('child_process');
    execSync(`node ${placeholderScript}`, { stdio: 'inherit' });
  } else {
    console.log('Placeholder script not found. Continuing without creating placeholders.');
  }
} catch (error) {
  console.log('Error creating placeholders:', error.message);
  console.log('Continuing with download...');
}

// Run the main function
downloadRiderWaiteDeck().catch(error => {
  console.error('An error occurred:', error);
});
