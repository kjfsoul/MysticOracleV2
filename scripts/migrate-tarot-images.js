const fs = require('fs-extra');
const sharp = require('sharp');
const { allTarotCards } = require('../client/src/data/tarot-cards');

async function convertImage(sourcePath, targetPath) {
  try {
    await sharp(sourcePath)
      .webp({ quality: 80 })
      .toFile(targetPath);
    await fs.remove(sourcePath); // Remove original JPG
    return true;
  } catch (error) {
    console.error(`Conversion failed for ${sourcePath}:`, error);
    return false;
  }
}

async function migrateTarotImages() {
  const deckId = 'rider-waite';
  const sourceRoot = 'client/public/images/tarot/decks/rider-waite';
  const targetRoot = 'client/public/images/tarot/decks/rider-waite';

  try {
    for (const card of allTarotCards) {
      // Determine source path based on old structure
      let sourcePath = '';
      if (card.arcana === 'major') {
        sourcePath = `${sourceRoot}/major/${card.id}.jpg`;
      } else if (card.suit) {
        sourcePath = `${sourceRoot}/minor/${card.suit}/${card.id}.jpg`;
      }

      // Create new filename
      const newFilename = `${card.imageId}-${card.normalizedName}.webp`;
      const targetPath = `${targetRoot}/${newFilename}`;

      // Check if source file exists
      if (!(await fs.pathExists(sourcePath))) {
        console.error(`Source file not found: ${sourcePath}`);
        continue;
      }

      // Ensure target directory exists
      await fs.ensureDir(targetRoot);
      
      // Convert and migrate the file
      const success = await convertImage(sourcePath, targetPath);
      if (success) {
        console.log(`Migrated: ${sourcePath} -> ${targetPath}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateTarotImages();
