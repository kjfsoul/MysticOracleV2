/**
 * Tarot Interpretation Service
 *
 * This service handles the personalization and delivery of tarot card interpretations,
 * integrating with the user's spiritual profile and external data sources.
 */

import { aceOfCupsInterpretation } from '@/data/tarot-interpretations/ace-of-cups';
import { SpiritualProfile } from '@/lib/models/spiritual-profile';
import {
    InterpretationContext,
    PersonalizedInterpretation,
    TarotCardInterpretation,
    generatePersonalizedInterpretation
} from '@/lib/models/tarot-interpretation';
import { supabase } from '@/lib/supabaseClient';

// Import other card interpretations as they are created
// import { twoOfCupsInterpretation } from '@/data/tarot-interpretations/two-of-cups';
// ... and so on

/**
 * Map of card IDs to their interpretation data
 */
const cardInterpretations: Record<string, TarotCardInterpretation> = {
  'ace-of-cups': aceOfCupsInterpretation,
  // Add more cards as they are created
};

/**
 * Get the interpretation data for a specific card
 */
export async function getCardInterpretation(cardId: string): Promise<TarotCardInterpretation | null> {
  // First check our local database
  if (cardInterpretations[cardId]) {
    return cardInterpretations[cardId];
  }

  // If not found locally, try to fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('tarot_card_interpretations')
      .select('*')
      .eq('card_id', cardId)
      .single();

    if (error) throw error;

    if (data) {
      // Convert the database format to our TarotCardInterpretation format
      return {
        core: {
          cardId: data.card_id,
          name: data.name,
          arcana: data.arcana,
          suit: data.suit,
          number: data.number,
          keywords: data.keywords,
          elementalAssociation: data.elemental_association,
          astrologicalAssociation: data.astrological_association,
          numerologicalAssociation: data.numerological_association,
          generalMeaning: data.general_meaning,
          uprightMeaning: data.upright_meaning,
          reversedMeaning: data.reversed_meaning,
          symbols: data.symbols,
          colors: data.colors,
          figures: data.figures,
          story: data.story,
          journey: data.journey,
          lessons: data.lessons,
          psychologicalImplications: data.psychological_implications,
          shadowAspects: data.shadow_aspects,
          growthOpportunities: data.growth_opportunities,
          relationshipContext: data.relationship_context,
          careerContext: data.career_context,
          spiritualContext: data.spiritual_context,
          healthContext: data.health_context,
          financialContext: data.financial_context,
          complementaryCards: data.complementary_cards,
          opposingCards: data.opposing_cards,
          progressionCards: data.progression_cards
        },
        sources: data.sources,
        personalization: data.personalization,
        metadata: {
          lastUpdated: new Date(data.last_updated),
          version: data.version,
          contributors: data.contributors
        }
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching card interpretation:', error);
    return null;
  }
}

/**
 * Get a personalized interpretation for a tarot card
 */
export async function getPersonalizedCardInterpretation(
  cardId: string,
  context: Omit<InterpretationContext, 'userId'>,
  userId: string
): Promise<PersonalizedInterpretation | null> {
  try {
    // Get the card interpretation data
    const cardInterpretation = await getCardInterpretation(cardId);
    if (!cardInterpretation) {
      throw new Error(`Interpretation not found for card: ${cardId}`);
    }

    // Get the user's spiritual profile
    const { data: profileData, error: profileError } = await supabase
      .from('spiritual_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') throw profileError;

    // Create a default profile if none exists
    let profile: SpiritualProfile;
    if (!profileData) {
      profile = {
        userId,
        drawHistory: [],
        moodTrend: [],
        emotionVector: [],
        journalThemes: [],
        journalSentiment: { positive: 0, negative: 0, neutral: 0 },
        preferredSpreads: [],
        timeOfDayPreference: 'evening',
        weekdayPreference: [0, 1, 2, 3, 4, 5, 6],
        sessionFrequency: 0,
        visualTheme: 'cosmic',
        readingTone: 'supportive',
        lastUpdated: new Date(),
        createdAt: new Date()
      };
    } else {
      profile = {
        ...profileData,
        userId: profileData.user_id,
        lastUpdated: new Date(profileData.last_updated),
        createdAt: new Date(profileData.created_at),
        drawHistory: profileData.draw_history || [],
        journalThemes: profileData.journal_themes || [],
        moodTrend: profileData.mood_trend || [],
        emotionVector: profileData.emotion_vector || []
      };
    }

    // Generate the personalized interpretation
    const personalizedInterpretation = generatePersonalizedInterpretation(
      cardInterpretation,
      { ...context, userId, date: context.date || new Date() },
      profile
    );

    // Store the interpretation in the database for future reference
    await supabase
      .from('personalized_interpretations')
      .insert([{
        user_id: userId,
        card_id: cardId,
        is_reversed: context.isReversed,
        spread_position: context.spreadPosition,
        spread_type: context.spreadType,
        question: context.question,
        focus_area: context.focusArea,
        other_cards: context.otherCards,
        current_mood: context.currentMood,
        time_of_day: context.timeOfDay,
        interpretation_date: context.date || new Date(),
        title: personalizedInterpretation.title,
        summary: personalizedInterpretation.summary,
        detailed_interpretation: personalizedInterpretation.detailedInterpretation,
        personal_insight: personalizedInterpretation.personalInsight,
        advice: personalizedInterpretation.advice,
        challenge: personalizedInterpretation.challenge,
        opportunity: personalizedInterpretation.opportunity,
        relation_to_question: personalizedInterpretation.relationToQuestion,
        relation_to_other_cards: personalizedInterpretation.relationToOtherCards,
        suggested_image_url: personalizedInterpretation.suggestedImageUrl,
        suggested_colors: personalizedInterpretation.suggestedColors,
        sources_used: personalizedInterpretation.sourcesUsed,
        generated_at: personalizedInterpretation.generatedAt,
        personalization_level: personalizedInterpretation.personalizationLevel
      }]);

    // Update the user's draw history
    const updatedDrawHistory = [
      {
        cardId,
        timestamp: new Date(),
        context: context.spreadType || 'single card',
        isReversed: context.isReversed
      },
      ...(profile.drawHistory || []).slice(0, 49) // Keep only the 50 most recent draws
    ];

    await supabase
      .from('spiritual_profiles')
      .update({
        draw_history: updatedDrawHistory,
        last_updated: new Date()
      })
      .eq('user_id', userId);

    return personalizedInterpretation;
  } catch (error) {
    console.error('Error generating personalized interpretation:', error);
    return null;
  }
}

/**
 * Get interpretation data from YouTube transcripts
 */
export async function getYouTubeInterpretationData(
  cardId: string,
  videoId: string
): Promise<{ transcriptExcerpt: string; timestamp: string } | null> {
  try {
    // In a real implementation, this would fetch and process YouTube transcript data
    // For now, we'll return mock data

    const mockTranscripts: Record<string, { excerpt: string; timestamp: string }> = {
      'ace-of-cups': {
        excerpt: "The Ace of Cups is all about new emotional beginnings. When this card appears, it's telling you to open your heart to new possibilities. It's like the universe is offering you a gift of love, intuition, and emotional fulfillment.",
        timestamp: '2:45'
      },
      'two-of-cups': {
        excerpt: "The Two of Cups represents partnership and connection. It's about that beautiful moment when two energies come together in harmony. This could be a romantic relationship, a friendship, or even a business partnership.",
        timestamp: '4:12'
      }
    };

    if (mockTranscripts[cardId]) {
      return {
        transcriptExcerpt: mockTranscripts[cardId].excerpt,
        timestamp: mockTranscripts[cardId].timestamp
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching YouTube interpretation data:', error);
    return null;
  }
}

/**
 * Get community interpretations for a card
 */
export async function getCommunityInterpretations(
  cardId: string,
  limit: number = 5
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('community_interpretations')
      .select('*')
      .eq('card_id', cardId)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching community interpretations:', error);
    return [];
  }
}

/**
 * Submit a community interpretation
 */
export async function submitCommunityInterpretation(
  userId: string,
  cardId: string,
  interpretation: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('community_interpretations')
      .insert([{
        user_id: userId,
        card_id: cardId,
        interpretation,
        rating: 0,
        created_at: new Date()
      }]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error submitting community interpretation:', error);
    return false;
  }
}

/**
 * Rate a personalized interpretation
 */
export async function rateInterpretation(
  userId: string,
  interpretationId: string,
  rating: number,
  feedback?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('interpretation_ratings')
      .insert([{
        user_id: userId,
        interpretation_id: interpretationId,
        rating,
        feedback,
        created_at: new Date()
      }]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error rating interpretation:', error);
    return false;
  }
}
