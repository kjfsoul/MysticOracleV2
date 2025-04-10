#!/usr/bin/env node

/**
 * Download Rider-Waite Tarot Deck Images from Alternative Sources
 *
 * This script downloads the Rider-Waite tarot deck images from alternative sources
 * and saves them to the appropriate directories.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { execSync } from 'child_process';

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

// Function to download an image using curl
function downloadImageWithCurl(url, filepath) {
  try {
    console.log(`Downloading: ${url} to ${filepath}`);
    execSync(`curl -L -o "${filepath}" "${url}"`, { stdio: 'inherit' });
    console.log(`Successfully downloaded: ${filepath}`);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
    return false;
  }
}

// Alternative source for Rider-Waite tarot deck
// Using Sacred Texts website which hosts public domain images
const baseUrl = "https://www.sacred-texts.com/tarot/pkt/img/";

// Major Arcana cards
const majorArcana = [
  { id: '00-fool', filename: 'ar00.jpg' },
  { id: '01-magician', filename: 'ar01.jpg' },
  { id: '02-high-priestess', filename: 'ar02.jpg' },
  { id: '03-empress', filename: 'ar03.jpg' },
  { id: '04-emperor', filename: 'ar04.jpg' },
  { id: '05-hierophant', filename: 'ar05.jpg' },
  { id: '06-lovers', filename: 'ar06.jpg' },
  { id: '07-chariot', filename: 'ar07.jpg' },
  { id: '08-strength', filename: 'ar08.jpg' },
  { id: '09-hermit', filename: 'ar09.jpg' },
  { id: '10-wheel-of-fortune', filename: 'ar10.jpg' },
  { id: '11-justice', filename: 'ar11.jpg' },
  { id: '12-hanged-man', filename: 'ar12.jpg' },
  { id: '13-death', filename: 'ar13.jpg' },
  { id: '14-temperance', filename: 'ar14.jpg' },
  { id: '15-devil', filename: 'ar15.jpg' },
  { id: '16-tower', filename: 'ar16.jpg' },
  { id: '17-star', filename: 'ar17.jpg' },
  { id: '18-moon', filename: 'ar18.jpg' },
  { id: '19-sun', filename: 'ar19.jpg' },
  { id: '20-judgement', filename: 'ar20.jpg' },
  { id: '21-world', filename: 'ar21.jpg' }
];

// Minor Arcana - Wands
const wands = [
  { id: 'ace-wands', filename: 'wapa.jpg' },
  { id: 'two-wands', filename: 'wa02.jpg' },
  { id: 'three-wands', filename: 'wa03.jpg' },
  { id: 'four-wands', filename: 'wa04.jpg' },
  { id: 'five-wands', filename: 'wa05.jpg' },
  { id: 'six-wands', filename: 'wa06.jpg' },
  { id: 'seven-wands', filename: 'wa07.jpg' },
  { id: 'eight-wands', filename: 'wa08.jpg' },
  { id: 'nine-wands', filename: 'wa09.jpg' },
  { id: 'ten-wands', filename: 'wa10.jpg' },
  { id: 'page-wands', filename: 'wapa.jpg' },
  { id: 'knight-wands', filename: 'wakn.jpg' },
  { id: 'queen-wands', filename: 'waqu.jpg' },
  { id: 'king-wands', filename: 'waki.jpg' }
];

// Minor Arcana - Cups
const cups = [
  { id: 'ace-cups', filename: 'cupa.jpg' },
  { id: 'two-cups', filename: 'cu02.jpg' },
  { id: 'three-cups', filename: 'cu03.jpg' },
  { id: 'four-cups', filename: 'cu04.jpg' },
  { id: 'five-cups', filename: 'cu05.jpg' },
  { id: 'six-cups', filename: 'cu06.jpg' },
  { id: 'seven-cups', filename: 'cu07.jpg' },
  { id: 'eight-cups', filename: 'cu08.jpg' },
  { id: 'nine-cups', filename: 'cu09.jpg' },
  { id: 'ten-cups', filename: 'cu10.jpg' },
  { id: 'page-cups', filename: 'cupa.jpg' },
  { id: 'knight-cups', filename: 'cukn.jpg' },
  { id: 'queen-cups', filename: 'cuqu.jpg' },
  { id: 'king-cups', filename: 'cuki.jpg' }
];

// Minor Arcana - Swords
const swords = [
  { id: 'ace-swords', filename: 'swa.jpg' },
  { id: 'two-swords', filename: 'sw02.jpg' },
  { id: 'three-swords', filename: 'sw03.jpg' },
  { id: 'four-swords', filename: 'sw04.jpg' },
  { id: 'five-swords', filename: 'sw05.jpg' },
  { id: 'six-swords', filename: 'sw06.jpg' },
  { id: 'seven-swords', filename: 'sw07.jpg' },
  { id: 'eight-swords', filename: 'sw08.jpg' },
  { id: 'nine-swords', filename: 'sw09.jpg' },
  { id: 'ten-swords', filename: 'sw10.jpg' },
  { id: 'page-swords', filename: 'swpa.jpg' },
  { id: 'knight-swords', filename: 'swkn.jpg' },
  { id: 'queen-swords', filename: 'swqu.jpg' },
  { id: 'king-swords', filename: 'swki.jpg' }
];

// Minor Arcana - Pentacles
const pentacles = [
  { id: 'ace-pentacles', filename: 'pea.jpg' },
  { id: 'two-pentacles', filename: 'pe02.jpg' },
  { id: 'three-pentacles', filename: 'pe03.jpg' },
  { id: 'four-pentacles', filename: 'pe04.jpg' },
  { id: 'five-pentacles', filename: 'pe05.jpg' },
  { id: 'six-pentacles', filename: 'pe06.jpg' },
  { id: 'seven-pentacles', filename: 'pe07.jpg' },
  { id: 'eight-pentacles', filename: 'pe08.jpg' },
  { id: 'nine-pentacles', filename: 'pe09.jpg' },
  { id: 'ten-pentacles', filename: 'pe10.jpg' },
  { id: 'page-pentacles', filename: 'pepa.jpg' },
  { id: 'knight-pentacles', filename: 'pekn.jpg' },
  { id: 'queen-pentacles', filename: 'pequ.jpg' },
  { id: 'king-pentacles', filename: 'peki.jpg' }
];

// Main function to download all cards
async function downloadRiderWaiteDeck() {
  console.log('Starting download of Rider-Waite deck from alternative source...');
  let successCount = 0;
  let failCount = 0;
  
  // Download major arcana
  for (const card of majorArcana) {
    const filepath = path.join(MAJOR_PATH, `${card.id}.jpg`);
    const url = `${baseUrl}${card.filename}`;
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    const success = downloadImageWithCurl(url, filepath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Download cups
  for (const card of cups) {
    const filepath = path.join(MINOR_CUPS_PATH, `${card.id}.jpg`);
    const url = `${baseUrl}${card.filename}`;
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    const success = downloadImageWithCurl(url, filepath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Download pentacles
  for (const card of pentacles) {
    const filepath = path.join(MINOR_PENTACLES_PATH, `${card.id}.jpg`);
    const url = `${baseUrl}${card.filename}`;
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    const success = downloadImageWithCurl(url, filepath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Download swords
  for (const card of swords) {
    const filepath = path.join(MINOR_SWORDS_PATH, `${card.id}.jpg`);
    const url = `${baseUrl}${card.filename}`;
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    const success = downloadImageWithCurl(url, filepath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Download wands
  for (const card of wands) {
    const filepath = path.join(MINOR_WANDS_PATH, `${card.id}.jpg`);
    const url = `${baseUrl}${card.filename}`;
    
    // Skip if file already exists and is not empty
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`Skipping existing file: ${filepath}`);
      successCount++;
      continue;
    }
    
    const success = downloadImageWithCurl(url, filepath);
    if (success) {
      successCount++;
    } else {
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
