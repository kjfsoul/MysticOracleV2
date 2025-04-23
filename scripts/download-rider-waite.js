/**
 * Download Rider-Waite Images
 *
 * This script downloads Rider-Waite tarot card images from public domain sources.
 */

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const mkdirAsync = promisify(fs.mkdir);

// Function to check if a file exists
async function existsAsync(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_IMAGES_PATH = path.join(__dirname, '../public/images');
const RIDER_WAITE_DIR = path.join(PUBLIC_IMAGES_PATH, 'tarot', 'decks', 'rider-waite', 'major');

// Public domain sources for Rider-Waite images
const CARD_SOURCES = [
  { id: '00-fool', url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg' },
  { id: '01-magician', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg' },
  { id: '02-high-priestess', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg' },
  { id: '03-empress', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg' },
  { id: '04-emperor', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg' },
  { id: '05-hierophant', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg' },
  { id: '06-lovers', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg' },
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
  { id: '21-world', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg' },
];

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

async function main() {
  try {
    console.log('Starting download of Rider-Waite images...');

    // Create directories if they don't exist
    try {
      await fs.promises.access(RIDER_WAITE_DIR);
    } catch (error) {
      await mkdirAsync(RIDER_WAITE_DIR, { recursive: true });
      console.log(`Created directory: ${RIDER_WAITE_DIR}`);
    }

    // Download Rider-Waite images
    let downloadCount = 0;
    let skipCount = 0;

    for (const { id, url } of CARD_SOURCES) {
      const destination = path.join(RIDER_WAITE_DIR, `${id}.jpg`);

      try {
        await fs.promises.access(destination);
        console.log(`Skipping ${id} (already exists)`);
        skipCount++;
        continue;
      } catch (error) {
        // File doesn't exist, proceed with download
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

    console.log('All tasks completed successfully!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Execute the main function
main();
