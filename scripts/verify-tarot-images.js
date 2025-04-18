#!/usr/bin/env node

/**
 * Verify Tarot Images
 * 
 * This script verifies that the Rider-Waite tarot card images are in the correct location.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

// Log with color
function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

// Main function
function main() {
  log('=== VERIFY TAROT IMAGES ===', colors.blue);
  log('');
  
  // The correct path should be:
  // /client/public/images/tarot/decks/rider-waite
  const riderWaitePath = path.join(process.cwd(), 'client', 'public', 'images', 'tarot', 'decks', 'rider-waite');
  const majorArcanaPath = path.join(riderWaitePath, 'major-arcana');
  const minorArcanaPath = path.join(riderWaitePath, 'minor-arcana');
  
  log('Looking for Rider-Waite deck at:', colors.blue);
  log(riderWaitePath, colors.yellow);
  log('');
  
  // Function to get image files from a directory
  const getImageFiles = (dirPath) => {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return [];
    }
    
    const dirFiles = fs.readdirSync(dirPath);
    return dirFiles.filter(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) return false;
      return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.svg');
    });
  };
  
  if (fs.existsSync(riderWaitePath)) {
    log(`Found Rider-Waite deck at: ${riderWaitePath}`, colors.green);
    log('Checking for card images...', colors.blue);
    log('');
    
    // Check main directory
    const mainDirImages = getImageFiles(riderWaitePath);
    log(`Found ${mainDirImages.length} card images in the main Rider-Waite folder.`, colors.green);
    
    // Check Major Arcana subfolder
    const hasMajorArcanaFolder = fs.existsSync(majorArcanaPath) && fs.statSync(majorArcanaPath).isDirectory();
    log(`Major Arcana subfolder: ${hasMajorArcanaFolder ? 'Found' : 'Not found'}`, hasMajorArcanaFolder ? colors.green : colors.red);
    const majorArcanaImages = hasMajorArcanaFolder ? getImageFiles(majorArcanaPath) : [];
    if (hasMajorArcanaFolder) {
      log(`Found ${majorArcanaImages.length} card images in the Major Arcana subfolder.`, colors.green);
    }
    
    // Check Minor Arcana subfolder
    const hasMinorArcanaFolder = fs.existsSync(minorArcanaPath) && fs.statSync(minorArcanaPath).isDirectory();
    log(`Minor Arcana subfolder: ${hasMinorArcanaFolder ? 'Found' : 'Not found'}`, hasMinorArcanaFolder ? colors.green : colors.red);
    const minorArcanaImages = hasMinorArcanaFolder ? getImageFiles(minorArcanaPath) : [];
    if (hasMinorArcanaFolder) {
      log(`Found ${minorArcanaImages.length} card images in the Minor Arcana subfolder.`, colors.green);
    }
    
    // Total images
    const totalImages = mainDirImages.length + majorArcanaImages.length + minorArcanaImages.length;
    log('', colors.reset);
    log(`Found a total of ${totalImages} card images across all directories.`, colors.green);
    
    if (totalImages > 0) {
      log('', colors.reset);
      log('Sample images:', colors.blue);
      
      // Show samples from main directory
      if (mainDirImages.length > 0) {
        log('Main directory:', colors.yellow);
        mainDirImages.slice(0, 3).forEach(file => log(`- ${file}`, colors.reset));
      }
      
      // Show samples from Major Arcana
      if (majorArcanaImages.length > 0) {
        log('Major Arcana:', colors.yellow);
        majorArcanaImages.slice(0, 3).forEach(file => log(`- major-arcana/${file}`, colors.reset));
      }
      
      // Show samples from Minor Arcana
      if (minorArcanaImages.length > 0) {
        log('Minor Arcana:', colors.yellow);
        minorArcanaImages.slice(0, 3).forEach(file => log(`- minor-arcana/${file}`, colors.reset));
      }
    }
    
    // Check if we have enough images
    if (totalImages < 78) {
      log('', colors.reset);
      log('WARNING: Not enough tarot card images found.', colors.red);
      log('A complete Rider-Waite deck should have 78 cards:', colors.yellow);
      log('- 22 Major Arcana cards', colors.yellow);
      log('- 56 Minor Arcana cards', colors.yellow);
      log('', colors.reset);
      log('You may need to download the missing images.', colors.red);
    } else {
      log('', colors.reset);
      log('SUCCESS: Found a complete set of tarot card images.', colors.green);
    }
  } else {
    log(`Rider-Waite deck folder not found at: ${riderWaitePath}`, colors.red);
    log('', colors.reset);
    log('The Rider-Waite deck should be located at:', colors.yellow);
    log('/client/public/images/tarot/decks/rider-waite', colors.yellow);
    log('', colors.reset);
    log('Would you like to create this directory structure? (y/n)', colors.blue);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('> ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        // Create directory structure
        fs.mkdirSync(riderWaitePath, { recursive: true });
        fs.mkdirSync(majorArcanaPath, { recursive: true });
        fs.mkdirSync(minorArcanaPath, { recursive: true });
        
        log('', colors.reset);
        log('Directory structure created successfully.', colors.green);
        log('', colors.reset);
        log('You will need to download the Rider-Waite tarot card images and place them in:', colors.yellow);
        log('- Major Arcana: /client/public/images/tarot/decks/rider-waite/major-arcana', colors.yellow);
        log('- Minor Arcana: /client/public/images/tarot/decks/rider-waite/minor-arcana', colors.yellow);
      }
      
      rl.close();
    });
  }
}

// Run the main function
main();
