#!/usr/bin/env node

/**
 * Script to copy placeholder images to problematic tarot card locations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the problematic cards
const problematicCards = [
  {
    id: '07-chariot',
    name: 'The Chariot',
    outputPath: 'client/public/images/tarot/decks/rider-waite/major/07-chariot.jpg'
  },
  {
    id: '13-death',
    name: 'Death',
    outputPath: 'client/public/images/tarot/decks/rider-waite/major/13-death.jpg'
  },
  {
    id: '16-tower',
    name: 'The Tower',
    outputPath: 'client/public/images/tarot/decks/rider-waite/major/16-tower.jpg'
  }
];

// Source placeholder image
const placeholderPath = 'client/public/images/tarot/placeholders/major-placeholder.svg';

// Function to copy a file
function copyFile(sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    console.log(`Copying ${sourcePath} to ${destinationPath}...`);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(destinationPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFile(sourcePath, destinationPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`Successfully copied to ${destinationPath}`);
      resolve();
    });
  });
}

// Main function
async function main() {
  console.log('Starting to fix problematic tarot card images...');
  
  // Check if placeholder exists
  if (!fs.existsSync(placeholderPath)) {
    console.error(`Placeholder image not found at ${placeholderPath}`);
    process.exit(1);
  }
  
  for (const card of problematicCards) {
    try {
      await copyFile(placeholderPath, card.outputPath);
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
