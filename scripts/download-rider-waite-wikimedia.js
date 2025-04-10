#!/usr/bin/env node

/**
 * Download Rider-Waite Tarot Deck Images from Wikimedia Commons
 *
 * This script downloads the Rider-Waite tarot deck images from Wikimedia Commons
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
        reject(`Failed to download ${url}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${url}: ${err.message}`);
      reject(`Error downloading ${url}: ${err.message}`);
    });
  });
}

// Major Arcana cards with Wikimedia URLs
const majorArcana = [
  { id: '00-fool', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg' },
  { id: '01-magician', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg' },
  { id: '02-high-priestess', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg' },
  { id: '03-empress', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg' },
  { id: '04-emperor', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg' },
  { id: '05-hierophant', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg' },
  { id: '06-lovers', url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg' },
  { id: '07-chariot', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg' },
  { id: '08-strength', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg' },
  { id: '09-hermit', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg' },
  { id: '10-wheel-of-fortune', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg' },
  { id: '11-justice', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg' },
  { id: '12-hanged-man', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg' },
  { id: '13-death', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg' },
  { id: '14-temperance', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg' },
  { id: '15-devil', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg' },
  { id: '16-tower', url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg' },
  { id: '17-star', url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg' },
  { id: '18-moon', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg' },
  { id: '19-sun', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg' },
  { id: '20-judgement', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg' },
  { id: '21-world', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg' }
];

// Minor Arcana - Cups
const cups = [
  { id: 'ace-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Cups01.jpg' },
  { id: 'two-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Cups02.jpg' },
  { id: 'three-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Cups03.jpg' },
  { id: 'four-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Cups04.jpg' },
  { id: 'five-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Cups05.jpg' },
  { id: 'six-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Cups06.jpg' },
  { id: 'seven-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Cups07.jpg' },
  { id: 'eight-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Cups08.jpg' },
  { id: 'nine-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Cups09.jpg' },
  { id: 'ten-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Cups10.jpg' },
  { id: 'page-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Cups11.jpg' },
  { id: 'knight-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Cups12.jpg' },
  { id: 'queen-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Cups13.jpg' },
  { id: 'king-cups', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Cups14.jpg' }
];

// Minor Arcana - Pentacles
const pentacles = [
  { id: 'ace-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Pents01.jpg' },
  { id: 'two-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Pents02.jpg' },
  { id: 'three-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Pents03.jpg' },
  { id: 'four-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Pents04.jpg' },
  { id: 'five-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Pents05.jpg' },
  { id: 'six-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Pents06.jpg' },
  { id: 'seven-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents07.jpg' },
  { id: 'eight-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Pents08.jpg' },
  { id: 'nine-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Pents09.jpg' },
  { id: 'ten-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Pents10.jpg' },
  { id: 'page-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Pents11.jpg' },
  { id: 'knight-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Pents12.jpg' },
  { id: 'queen-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Pents13.jpg' },
  { id: 'king-pentacles', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Pents14.jpg' }
];

// Minor Arcana - Swords
const swords = [
  { id: 'ace-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg' },
  { id: 'two-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Swords02.jpg' },
  { id: 'three-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Swords03.jpg' },
  { id: 'four-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Swords04.jpg' },
  { id: 'five-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Swords05.jpg' },
  { id: 'six-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Swords06.jpg' },
  { id: 'seven-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Swords07.jpg' },
  { id: 'eight-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Swords08.jpg' },
  { id: 'nine-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Swords09.jpg' },
  { id: 'ten-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords10.jpg' },
  { id: 'page-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Swords11.jpg' },
  { id: 'knight-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Swords12.jpg' },
  { id: 'queen-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords13.jpg' },
  { id: 'king-swords', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Swords14.jpg' }
];

// Minor Arcana - Wands
const wands = [
  { id: 'ace-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Wands01.jpg' },
  { id: 'two-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Wands02.jpg' },
  { id: 'three-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands03.jpg' },
  { id: 'four-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Wands04.jpg' },
  { id: 'five-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Wands05.jpg' },
  { id: 'six-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Wands06.jpg' },
  { id: 'seven-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Wands07.jpg' },
  { id: 'eight-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Wands08.jpg' },
  { id: 'nine-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Tarot_Nine_of_Wands.jpg' },
  { id: 'ten-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands10.jpg' },
  { id: 'page-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Wands11.jpg' },
  { id: 'knight-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Wands12.jpg' },
  { id: 'queen-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Wands13.jpg' },
  { id: 'king-wands', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Wands14.jpg' }
];

// Main function to download all cards
async function downloadRiderWaiteDeck() {
  console.log('Starting download of Rider-Waite deck from Wikimedia Commons...');
  let successCount = 0;
  let failCount = 0;
  
  // Download major arcana
  for (const card of majorArcana) {
    const filepath = path.join(MAJOR_PATH, `${card.id}.jpg`);
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    try {
      await downloadImage(card.url, filepath);
      successCount++;
    } catch (error) {
      console.error(`Error downloading ${card.id}: ${error}`);
      failCount++;
    }
  }
  
  // Download cups
  for (const card of cups) {
    const filepath = path.join(MINOR_CUPS_PATH, `${card.id}.jpg`);
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    try {
      await downloadImage(card.url, filepath);
      successCount++;
    } catch (error) {
      console.error(`Error downloading ${card.id}: ${error}`);
      failCount++;
    }
  }
  
  // Download pentacles
  for (const card of pentacles) {
    const filepath = path.join(MINOR_PENTACLES_PATH, `${card.id}.jpg`);
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    try {
      await downloadImage(card.url, filepath);
      successCount++;
    } catch (error) {
      console.error(`Error downloading ${card.id}: ${error}`);
      failCount++;
    }
  }
  
  // Download swords
  for (const card of swords) {
    const filepath = path.join(MINOR_SWORDS_PATH, `${card.id}.jpg`);
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    try {
      await downloadImage(card.url, filepath);
      successCount++;
    } catch (error) {
      console.error(`Error downloading ${card.id}: ${error}`);
      failCount++;
    }
  }
  
  // Download wands
  for (const card of wands) {
    const filepath = path.join(MINOR_WANDS_PATH, `${card.id}.jpg`);
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    try {
      await downloadImage(card.url, filepath);
      successCount++;
    } catch (error) {
      console.error(`Error downloading ${card.id}: ${error}`);
      failCount++;
    }
  }
  
  console.log('\nDownload summary:');
  console.log(`Successfully downloaded/processed: ${successCount} cards`);
  console.log(`Failed to download: ${failCount} cards`);
  console.log(`Total cards: ${successCount + failCount}`);
  
  if (failCount > 0) {
    console.log('\nSome cards could not be downloaded. You may want to manually download these cards from another source.');
  }
  
  console.log(`\nDeck saved to: ${DECK_PATH}`);
}

// Run the main function
downloadRiderWaiteDeck().catch(error => {
  console.error('An error occurred:', error);
});
