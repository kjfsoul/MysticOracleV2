/**
 * Verify Tarot Paths Script
 * 
 * This script verifies the paths for tarot card images.
 * It checks if the images exist at the expected paths and creates a report
 * of any missing images.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);

// Paths
const TAROT_CARDS_PATH = path.join(__dirname, '../client/client/src/data/tarot-cards.ts');
const PUBLIC_IMAGES_PATH = path.join(__dirname, '../public/images');
const REPORT_PATH = path.join(__dirname, '../tarot-image-report.json');

async function main() {
  try {
    console.log('Starting tarot path verification...');
    
    // Read the tarot cards data
    const tarotCardsContent = await readFileAsync(TAROT_CARDS_PATH, 'utf8');
    
    // Extract the cards array using regex (simple approach)
    const cardsMatch = tarotCardsContent.match(/export const allTarotCards: TarotCard\[\] = \[([\s\S]*?)\];/);
    
    if (!cardsMatch) {
      throw new Error('Could not find tarot cards array in the file');
    }
    
    // Parse the cards array (simple approach)
    const cardsContent = cardsMatch[1];
    const cardObjects = cardsContent.split('},').map(card => card.trim() + '}');
    
    // Check each card's image path
    const report = {
      totalCards: cardObjects.length,
      missingImages: [],
      errors: []
    };
    
    for (const cardObj of cardObjects) {
      try {
        // Extract card properties using regex
        const idMatch = cardObj.match(/id: ["']([^"']*)/);
        const nameMatch = cardObj.match(/name: ["']([^"']*)/);
        const arcanaMatch = cardObj.match(/arcana: ["']([^"']*)/);
        
        if (!idMatch || !nameMatch) {
          report.errors.push(`Could not parse card: ${cardObj.substring(0, 100)}...`);
          continue;
        }
        
        const id = idMatch[1];
        const name = nameMatch[1];
        const arcana = arcanaMatch ? arcanaMatch[1] : 'major';
        
        // Generate the expected path based on the template
        const expectedPath = `/images/tarot/decks/rider-waite/major/${id}.jpg`;
        
        // Remove the leading slash for fs.exists
        const relativeExpectedPath = expectedPath.startsWith('/') 
          ? expectedPath.substring(1) 
          : expectedPath;
        
        const fullExpectedPath = path.join(PUBLIC_IMAGES_PATH, '..', relativeExpectedPath);
        
        // Check if the file exists at the expected path
        const exists = await existsAsync(fullExpectedPath);
        
        if (!exists) {
          report.missingImages.push({
            card: name,
            id,
            expectedPath,
            arcana
          });
        }
      } catch (error) {
        report.errors.push(`Error processing card: ${error.message}`);
      }
    }
    
    // Write the report
    await writeFileAsync(REPORT_PATH, JSON.stringify(report, null, 2));
    
    console.log(`
Tarot image verification complete!
Total cards: ${report.totalCards}
Missing images: ${report.missingImages.length}
Errors: ${report.errors.length}

Report saved to: ${REPORT_PATH}
    `);
    
    // If there are missing images, provide instructions
    if (report.missingImages.length > 0) {
      console.log('\nMissing images detected. Please check the report for details.');
      console.log('You can run the download script to get the missing images:');
      console.log('npm run download:rider-waite');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
