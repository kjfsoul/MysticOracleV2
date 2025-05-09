/**
 * Download Missing Rider-Waite Images
 * 
 * This script downloads missing Rider-Waite tarot card images from public domain sources.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);
const readFileAsync = promisify(fs.readFile);

// Configuration
const TAROT_CARDS_PATH = path.join(__dirname, '../client/client/src/data/tarot-cards.ts');
const PUBLIC_IMAGES_PATH = path.join(__dirname, '../public/images');
const RIDER_WAITE_DIR = path.join(PUBLIC_IMAGES_PATH, 'tarot', 'decks', 'rider-waite', 'major');
const PLACEHOLDERS_DIR = path.join(PUBLIC_IMAGES_PATH, 'tarot', 'placeholders');

// Public domain sources for Rider-Waite images
const SOURCES = [
  'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg',
];

// Mapping of URLs to filenames
const URL_TO_FILENAME = {
  'RWS_Tarot_00_Fool.jpg': '00-fool.jpg',
  'RWS_Tarot_01_Magician.jpg': '01-magician.jpg',
  'RWS_Tarot_02_High_Priestess.jpg': '02-high-priestess.jpg',
  'RWS_Tarot_03_Empress.jpg': '03-empress.jpg',
  'RWS_Tarot_04_Emperor.jpg': '04-emperor.jpg',
  'RWS_Tarot_05_Hierophant.jpg': '05-hierophant.jpg',
  'TheLovers.jpg': '06-lovers.jpg',
  'RWS_Tarot_07_Chariot.jpg': '07-chariot.jpg',
  'RWS_Tarot_08_Strength.jpg': '08-strength.jpg',
  'RWS_Tarot_09_Hermit.jpg': '09-hermit.jpg',
  'RWS_Tarot_10_Wheel_of_Fortune.jpg': '10-wheel-of-fortune.jpg',
  'RWS_Tarot_11_Justice.jpg': '11-justice.jpg',
  'RWS_Tarot_12_Hanged_Man.jpg': '12-hanged-man.jpg',
  'RWS_Tarot_13_Death.jpg': '13-death.jpg',
  'RWS_Tarot_14_Temperance.jpg': '14-temperance.jpg',
  'RWS_Tarot_15_Devil.jpg': '15-devil.jpg',
  'RWS_Tarot_16_Tower.jpg': '16-tower.jpg',
  'RWS_Tarot_17_Star.jpg': '17-star.jpg',
  'RWS_Tarot_18_Moon.jpg': '18-moon.jpg',
  'RWS_Tarot_19_Sun.jpg': '19-sun.jpg',
  'RWS_Tarot_20_Judgement.jpg': '20-judgement.jpg',
  'RWS_Tarot_21_World.jpg': '21-world.jpg',
};

// Function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destination, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      reject(err);
    });
  });
}

// Function to create placeholder SVGs
function createPlaceholderSVG(type, destination) {
  const svg = `<svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a2e" />
    <text x="150" y="250" font-family="Arial" font-size="24" fill="#e2e2e2" text-anchor="middle">${type} Placeholder</text>
  </svg>`;
  
  return fs.promises.writeFile(destination, svg);
}

async function main() {
  try {
    console.log('Starting download of missing Rider-Waite images...');
    
    // Create directories if they don't exist
    if (!await existsAsync(RIDER_WAITE_DIR)) {
      await mkdirAsync(RIDER_WAITE_DIR, { recursive: true });
      console.log(`Created directory: ${RIDER_WAITE_DIR}`);
    }
    
    if (!await existsAsync(PLACEHOLDERS_DIR)) {
      await mkdirAsync(PLACEHOLDERS_DIR, { recursive: true });
      console.log(`Created directory: ${PLACEHOLDERS_DIR}`);
    }
    
    // Create placeholder SVGs
    const placeholders = [
      { type: 'Major', filename: 'major-placeholder.svg' },
      { type: 'Wands', filename: 'wands-placeholder.svg' },
      { type: 'Cups', filename: 'cups-placeholder.svg' },
      { type: 'Swords', filename: 'swords-placeholder.svg' },
      { type: 'Pentacles', filename: 'pentacles-placeholder.svg' },
      { type: 'Minor', filename: 'minor-placeholder.svg' },
    ];
    
    for (const { type, filename } of placeholders) {
      const placeholderPath = path.join(PLACEHOLDERS_DIR, filename);
      if (!await existsAsync(placeholderPath)) {
        await createPlaceholderSVG(type, placeholderPath);
        console.log(`Created placeholder: ${placeholderPath}`);
      }
    }
    
    // Download Rider-Waite images
    let downloadCount = 0;
    let skipCount = 0;
    
    for (const url of SOURCES) {
      const urlParts = url.split('/');
      const originalFilename = urlParts[urlParts.length - 1];
      const targetFilename = URL_TO_FILENAME[originalFilename] || originalFilename;
      const destination = path.join(RIDER_WAITE_DIR, targetFilename);
      
      if (await existsAsync(destination)) {
        console.log(`Skipping ${targetFilename} (already exists)`);
        skipCount++;
        continue;
      }
      
      console.log(`Downloading ${url} to ${destination}...`);
      await downloadFile(url, destination);
      downloadCount++;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`
Download complete!
Downloaded: ${downloadCount} images
Skipped: ${skipCount} images
    `);
    
    // Create a card back image if it doesn't exist
    const cardBackPath = path.join(PUBLIC_IMAGES_PATH, 'tarot', 'card-back.svg');
    if (!await existsAsync(cardBackPath)) {
      const cardBackSVG = `<svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2a2a4a" />
        <rect x="10" y="10" width="280" height="480" fill="none" stroke="#c9a959" stroke-width="2" />
        <circle cx="150" cy="250" r="100" fill="none" stroke="#c9a959" stroke-width="2" />
        <path d="M150,150 L150,350 M100,250 L200,250" stroke="#c9a959" stroke-width="2" />
      </svg>`;
      
      await fs.promises.writeFile(cardBackPath, cardBackSVG);
      console.log(`Created card back: ${cardBackPath}`);
    }
    
    console.log('All tasks completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
