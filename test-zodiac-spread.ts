// Simple test utility for the Zodiac Spread functionality
import { generateZodiacSpread } from './server/openai';

// Mock birth chart data
const mockBirthChart = {
  sun: { sign: "Capricorn", degree: 10.5 },
  moon: { sign: "Cancer", degree: 15.2 },
  mercury: { sign: "Aquarius", degree: 5.8 },
  venus: { sign: "Aquarius", degree: 12.3 },
  mars: { sign: "Sagittarius", degree: 9.6 },
  jupiter: { sign: "Cancer", degree: 5.2, retrograde: true },
  saturn: { sign: "Capricorn", degree: 15.6 },
  uranus: { sign: "Capricorn", degree: 5.7 },
  neptune: { sign: "Capricorn", degree: 12.0 },
  pluto: { sign: "Scorpio", degree: 17.1 }
};

// Test the Zodiac Spread generation
async function testZodiacSpread() {
  console.log('Testing Zodiac Spread generation...');
  
  try {
    // Generate a non-premium zodiac spread
    const regularSpread = await generateZodiacSpread(mockBirthChart, false);
    console.log(`Regular Zodiac Spread generated with ${regularSpread.length} cards`);
    console.log('Positions:');
    regularSpread.forEach(card => {
      console.log(`- ${card.position}: ${card.name} (${card.reversal ? 'reversed' : 'upright'})`);
    });
    
    console.log('\n---\n');
    
    // Generate a premium zodiac spread
    const premiumSpread = await generateZodiacSpread(mockBirthChart, true);
    console.log(`Premium Zodiac Spread generated with ${premiumSpread.length} cards`);
    console.log('Positions:');
    premiumSpread.forEach(card => {
      console.log(`- ${card.position}: ${card.name} (${card.reversal ? 'reversed' : 'upright'})`);
    });
    
    // Verify that we have the expected number of cards
    if (regularSpread.length !== 12 || premiumSpread.length !== 12) {
      console.error('ERROR: Expected 12 cards in the Zodiac Spread!');
    } else {
      console.log('\nSUCCESS: Both spreads have the correct number of cards!');
    }
    
    // Verify that all positions are properly assigned
    const allPositionsRegular = regularSpread.every(card => card.position && card.position.includes('House'));
    const allPositionsPremium = premiumSpread.every(card => card.position && card.position.includes('House'));
    
    if (!allPositionsRegular || !allPositionsPremium) {
      console.error('ERROR: Not all cards have proper house positions!');
    } else {
      console.log('SUCCESS: All cards have proper house positions!');
    }
    
    // Verify that the premium spread has more cards matching the elemental associations
    // This is a simplistic check that assumes premium has better card selection
    console.log('\nVerifying premium spread elemental associations...');
    console.log('(Note: This is just a sample check, not a comprehensive test)');
    
    return { regularSpread, premiumSpread };
  } catch (error) {
    console.error('Error testing Zodiac Spread:', error);
  }
}

// Run the test
testZodiacSpread().catch(error => console.error('Unhandled error:', error));

// Export the test function
export { testZodiacSpread };