#!/usr/bin/env node

/**
 * Download Rider-Waite Tarot Deck Images
 * 
 * This script downloads the Rider-Waite tarot deck images from a public source,
 * resizes them, and saves them to the appropriate directories.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { spawn } from 'child_process';

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

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        reject(`Failed to download ${url}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      reject(`Error downloading ${url}: ${err.message}`);
    });
  });
}

// Function to resize an image using ImageMagick (if available)
function resizeImage(filepath, width = 500) {
  return new Promise((resolve, reject) => {
    const tempPath = `${filepath}.temp`;
    fs.renameSync(filepath, tempPath);
    
    const convert = spawn('convert', [
      tempPath,
      '-resize', `${width}x`,
      '-quality', '85',
      filepath
    ]);
    
    convert.on('close', (code) => {
      if (code === 0) {
        fs.unlinkSync(tempPath);
        console.log(`Resized: ${filepath}`);
        resolve();
      } else {
        // If convert fails, just use the original file
        fs.renameSync(tempPath, filepath);
        console.warn(`Warning: Could not resize ${filepath}. ImageMagick may not be installed.`);
        resolve();
      }
    });
    
    convert.on('error', () => {
      // If convert fails to run, just use the original file
      fs.renameSync(tempPath, filepath);
      console.warn(`Warning: Could not resize ${filepath}. ImageMagick may not be installed.`);
      resolve();
    });
  });
}

// Main function to download and process all cards
async function downloadRiderWaiteDeck() {
  console.log('Starting download of Rider-Waite deck...');
  
  // Example source URL - replace with actual source
  const baseUrl = 'https://www.sacred-texts.com/tarot/pkt/img/';
  
  // Download major arcana
  for (const card of majorArcana) {
    const filename = `${card.id}.jpg`;
    const filepath = path.join(MAJOR_PATH, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Skipping existing file: ${filepath}`);
      continue;
    }
    
    try {
      // Convert card name to URL format (e.g., "The Fool" -> "ar00")
      const cardIndex = majorArcana.indexOf(card);
      const urlName = `ar${cardIndex.toString().padStart(2, '0')}`;
      const url = `${baseUrl}${urlName}.jpg`;
      
      await downloadImage(url, filepath);
      await resizeImage(filepath);
    } catch (error) {
      console.error(`Error processing ${card.name}: ${error}`);
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
        continue;
      }
      
      try {
        // Convert rank and suit to URL format
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
        
        const url = `${baseUrl}${suitCode}${rankCode}.jpg`;
        
        await downloadImage(url, filepath);
        await resizeImage(filepath);
      } catch (error) {
        console.error(`Error processing ${rank} of ${suit}: ${error}`);
      }
    }
  }
  
  console.log('Download complete!');
  console.log(`Deck saved to: ${DECK_PATH}`);
  console.log('Note: If some images failed to download, you may need to manually download them from another source.');
}

// Run the main function
downloadRiderWaiteDeck().catch(error => {
  console.error('An error occurred:', error);
});
