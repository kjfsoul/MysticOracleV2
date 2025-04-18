const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const IMAGE_DIR = path.join(process.cwd(), 'client/public/images/tarot/decks/rider-waite');

const CARD_IDS = [
  // Major Arcana
  '00-fool', '01-magician', '02-high-priestess', '03-empress', '04-emperor',
  '05-hierophant', '06-lovers', '07-chariot', '08-strength', '09-hermit',
  '10-wheel-of-fortune', '11-justice', '12-hanged-man', '13-death', 
  '14-temperance', '15-devil', '16-tower', '17-star', '18-moon', '19-sun',
  '20-judgement', '21-world'
];

async function downloadCardImage(cardId) {
  const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RWS_${cardId}.jpg/800px-RWS_${cardId}.jpg`;
  const outputPath = path.join(IMAGE_DIR, `${cardId}.webp`);

  try {
    // Create directory if needed
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

    // Download and process image
    const response = await axios({ url: imageUrl, responseType: 'stream' });
    
    await pipeline(
      response.data,
      sharp()
        .resize(800)
        .webp({ quality: 80 })
        .toBuffer()
        .then(buffer => fs.promises.writeFile(outputPath, buffer))
    );

    console.log(`✅ Downloaded and converted ${cardId}`);
  } catch (error) {
    console.error(`❌ Failed ${cardId}: ${error.message}`);
    // Copy placeholder for failed downloads
    const placeholderPath = path.join(IMAGE_DIR, '00-fool.webp');
    await fs.promises.copyFile(placeholderPath, outputPath);
  }
}

async function main() {
  console.log('Starting Rider-Waite deck download...');
  try {
    for (const cardId of CARD_IDS) {
      await downloadCardImage(cardId);
    }
    console.log('🎉 Deck download completed!');
  } catch (error) {
    console.error('💥 Critical error:', error);
  }
}

main();
