/**
 * Fix Tarot Paths Script
 * 
 * This script verifies and fixes the paths for tarot card images.
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
const TAROT_CARDS_PATH = path.join(__dirname, '../client/src/data/tarot-cards.ts');
const TAROT_CONFIG_PATH = path.join(__dirname, '../client/src/config/tarot-deck-config.ts');
const PUBLIC_IMAGES_PATH = path.join(__dirname, '../public/images');
const REPORT_PATH = path.join(__dirname, '../tarot-image-report.json');

async function main() {
  try {
    console.log('Starting tarot path verification...');
    
    // Read the tarot cards data
    const tarotCardsContent = await readFileAsync(TAROT_CARDS_PATH, 'utf8');
    const tarotConfigContent = await readFileAsync(TAROT_CONFIG_PATH, 'utf8');
    
    // Extract the cards array using regex (simple approach)
    const cardsMatch = tarotCardsContent.match(/export const allTarotCards: TarotCard\[\] = \[([\s\S]*?)\];/);
    
    if (!cardsMatch) {
      throw new Error('Could not find tarot cards array in the file');
    }
    
    // Extract deck config
    const deckConfigMatch = tarotConfigContent.match(/export const TAROT_DECKS: TarotDeckConfig\[\] = \[([\s\S]*?)\];/);
    
    if (!deckConfigMatch) {
      throw new Error('Could not find tarot deck config in the file');
    }
    
    // Parse the deck config to get the path template
    const deckConfig = deckConfigMatch[1];
    const cardPathTemplateMatch = deckConfig.match(/cardPathTemplate: ['"]([^'"]*)['"]/);
    const cardPathTemplate = cardPathTemplateMatch ? cardPathTemplateMatch[1] : null;
    
    if (!cardPathTemplate) {
      throw new Error('Could not find card path template in deck config');
    }
    
    console.log(`Card path template: ${cardPathTemplate}`);
    
    // Parse the cards array (simple approach)
    const cardsContent = cardsMatch[1];
    const cardObjects = cardsContent.split('},').map(card => card.trim() + '}');
    
    // Check each card's image path
    const report = {
      totalCards: cardObjects.length,
      missingImages: [],
      fixedPaths: [],
      errors: []
    };
    
    for (const cardObj of cardObjects) {
      try {
        // Extract card properties using regex
        const idMatch = cardObj.match(/id: ["']([^"']*)/);
        const imageIdMatch = cardObj.match(/imageId: ["']([^"']*)/);
        const nameMatch = cardObj.match(/name: ["']([^"']*)/);
        const normalizedNameMatch = cardObj.match(/normalizedName: ["']([^"']*)/);
        const arcanaMatch = cardObj.match(/arcana: ["']([^"']*)/);
        const suitMatch = cardObj.match(/suit?: ["']([^"']*)/);
        const imagePathMatch = cardObj.match(/imagePath: ["']([^"']*)/);
        
        if (!idMatch || !nameMatch || !imagePathMatch) {
          report.errors.push(`Could not parse card: ${cardObj.substring(0, 100)}...`);
          continue;
        }
        
        const id = idMatch[1];
        const imageId = imageIdMatch ? imageIdMatch[1] : '';
        const name = nameMatch[1];
        const normalizedName = normalizedNameMatch ? normalizedNameMatch[1] : '';
        const arcana = arcanaMatch ? arcanaMatch[1] : '';
        const suit = suitMatch ? suitMatch[1] : '';
        const currentImagePath = imagePathMatch[1];
        
        // Generate the expected path based on the template
        let expectedPath = cardPathTemplate
          .replace('{deckId}', 'rider-waite')
          .replace('{id}', id)
          .replace('{imageId}', imageId)
          .replace('{normalizedName}', normalizedName);
        
        // Remove the leading slash for fs.exists
        const relativeExpectedPath = expectedPath.startsWith('/') 
          ? expectedPath.substring(1) 
          : expectedPath;
        
        const fullExpectedPath = path.join(PUBLIC_IMAGES_PATH, '..', relativeExpectedPath);
        
        // Check if the file exists at the expected path
        const exists = await existsAsync(fullExpectedPath);
        
        if (!exists) {
          // Try alternative paths
          const alternativePaths = [
            // Try with just the ID
            path.join(PUBLIC_IMAGES_PATH, 'tarot', 'decks', 'rider-waite', 'major', `${id}.jpg`),
            // Try with numeric ID format (e.g., "00-fool.jpg")
            path.join(PUBLIC_IMAGES_PATH, 'tarot', 'decks', 'rider-waite', 'major', `${id.padStart(2, '0')}-${normalizedName}.jpg`),
            // Try with the name
            path.join(PUBLIC_IMAGES_PATH, 'tarot', 'decks', 'rider-waite', 'major', `${normalizedName}.jpg`),
            // Try placeholder
            path.join(PUBLIC_IMAGES_PATH, 'tarot', 'placeholders', `${arcana}-placeholder.svg`),
          ];
          
          let foundAlternative = false;
          let alternativePath = '';
          
          for (const altPath of alternativePaths) {
            if (await existsAsync(altPath)) {
              foundAlternative = true;
              alternativePath = altPath.replace(PUBLIC_IMAGES_PATH, '/images');
              break;
            }
          }
          
          if (foundAlternative) {
            report.fixedPaths.push({
              card: name,
              id,
              originalPath: currentImagePath,
              newPath: alternativePath
            });
          } else {
            report.missingImages.push({
              card: name,
              id,
              expectedPath,
              currentPath: currentImagePath
            });
          }
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
Fixed paths: ${report.fixedPaths.length}
Errors: ${report.errors.length}

Report saved to: ${REPORT_PATH}
    `);
    
    // If there are missing images, provide instructions
    if (report.missingImages.length > 0) {
      console.log('\nMissing images detected. Please check the report for details.');
      console.log('You may need to:');
      console.log('1. Download the missing images');
      console.log('2. Update the path template in the tarot deck config');
      console.log('3. Update the image paths in the tarot cards data');
    }
    
    // If there are fixed paths, provide instructions to update the code
    if (report.fixedPaths.length > 0) {
      console.log('\nFixed paths detected. You can update the tarot cards data with these paths.');
      console.log('Example of fixed paths:');
      report.fixedPaths.slice(0, 3).forEach(fix => {
        console.log(`- ${fix.card}: ${fix.newPath}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
