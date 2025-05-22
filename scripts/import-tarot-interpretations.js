/**
 * Import Tarot Card Interpretations
 * 
 * This script imports tarot card interpretations from the data files into the Supabase database.
 * Run this script after setting up the database schema.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Import the Ace of Cups interpretation
const { aceOfCupsInterpretation } = require('../client/client/src/data/tarot-interpretations/ace-of-cups');

// Add more card imports as they are created
// const { twoOfCupsInterpretation } = require('../client/client/src/data/tarot-interpretations/two-of-cups');
// ... and so on

/**
 * Convert a card interpretation to the database format
 */
function convertToDbFormat(card) {
  return {
    card_id: card.core.cardId,
    name: card.core.name,
    arcana: card.core.arcana,
    suit: card.core.suit,
    number: card.core.number,
    keywords: card.core.keywords,
    elemental_association: card.core.elementalAssociation,
    astrological_association: card.core.astrologicalAssociation,
    numerological_association: card.core.numerologicalAssociation,
    general_meaning: card.core.generalMeaning,
    upright_meaning: card.core.uprightMeaning,
    reversed_meaning: card.core.reversedMeaning,
    symbols: card.core.symbols,
    colors: card.core.colors,
    figures: card.core.figures,
    story: card.core.story,
    journey: card.core.journey,
    lessons: card.core.lessons,
    psychological_implications: card.core.psychologicalImplications,
    shadow_aspects: card.core.shadowAspects,
    growth_opportunities: card.core.growthOpportunities,
    relationship_context: card.core.relationshipContext,
    career_context: card.core.careerContext,
    spiritual_context: card.core.spiritualContext,
    health_context: card.core.healthContext,
    financial_context: card.core.financialContext,
    complementary_cards: card.core.complementaryCards,
    opposing_cards: card.core.opposingCards,
    progression_cards: card.core.progressionCards,
    sources: card.sources,
    personalization: card.personalization,
    last_updated: new Date(),
    version: card.metadata.version,
    contributors: card.metadata.contributors
  };
}

/**
 * Import a card interpretation into the database
 */
async function importCardInterpretation(card) {
  try {
    const dbCard = convertToDbFormat(card);
    
    // Check if the card already exists
    const { data: existingCard, error: checkError } = await supabase
      .from('tarot_card_interpretations')
      .select('id')
      .eq('card_id', dbCard.card_id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingCard) {
      // Update the existing card
      const { error: updateError } = await supabase
        .from('tarot_card_interpretations')
        .update(dbCard)
        .eq('card_id', dbCard.card_id);
      
      if (updateError) throw updateError;
      
      console.log(`Updated interpretation for ${dbCard.name}`);
    } else {
      // Insert a new card
      const { error: insertError } = await supabase
        .from('tarot_card_interpretations')
        .insert([dbCard]);
      
      if (insertError) throw insertError;
      
      console.log(`Inserted interpretation for ${dbCard.name}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error importing ${card.core.name}:`, error);
    return false;
  }
}

/**
 * Import all card interpretations
 */
async function importAllCards() {
  console.log('Starting import of tarot card interpretations...');
  
  // Import the Ace of Cups
  await importCardInterpretation(aceOfCupsInterpretation);
  
  // Import more cards as they are created
  // await importCardInterpretation(twoOfCupsInterpretation);
  // ... and so on
  
  console.log('Import completed!');
}

// Run the import
importAllCards().catch(console.error);
