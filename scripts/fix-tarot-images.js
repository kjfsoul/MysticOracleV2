#!/usr/bin/env node

/**
 * Script to fix problematic tarot card images
 *
 * This script downloads replacement images for cards that are causing issues
 */

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the problematic cards and their source URLs
const problematicCards = [
  {
    id: '07-chariot',
    name: 'The Chariot',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
    outputPath: 'client/public/images/tarot/decks/rider-waite/major/07-chariot.jpg'
  },
  {
    id: '13-death',
    name: 'Death',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg',
    outputPath: 'client/public/images/tarot/decks/rider-waite/major/13-death.jpg'
  },
  {
    id: '16-tower',
    name: 'The Tower',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
    outputPath: 'client/public/images/tarot/decks/rider-waite/major/16-tower.jpg'
  }
];

// Function to download an image
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${outputPath}...`);

    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Download the image with proper User-Agent
    const file = fs.createWriteStream(outputPath);
    const options = {
      headers: {
        'User-Agent': 'MysticArcana/1.0 (https://github.com/kjfsoul/MysticOracleV2; kjfsoul@gmail.com) Node.js/23.1.0'
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded ${url}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Main function
async function main() {
  console.log('Starting to fix problematic tarot card images...');

  for (const card of problematicCards) {
    try {
      await downloadImage(card.url, card.outputPath);
      console.log(`Fixed ${card.name} (${card.id})`);
    } catch (error) {
      console.error(`Error fixing ${card.name} (${card.id}):`, error.message);
    }
  }

  console.log('Finished fixing tarot card images');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
