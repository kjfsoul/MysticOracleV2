/**
 * Agent Learning Service
 * 
 * This service handles the agent learning and personalization framework for Mystic Arcana.
 * It integrates with the user's spiritual profile and provides personalized recommendations.
 */

import { supabase } from '@/lib/supabaseClient';
import { SpiritualProfile, updateProfileWithJournalEntry, updateProfileWithTarotDraw } from '@/lib/models/spiritual-profile';
import { generateEmbedding } from '@/lib/services/embedding-service';

/**
 * Interface for user interaction data
 */
export interface UserInteraction {
  userId: string;
  interactionType: 'page_view' | 'card_draw' | 'journal_entry' | 'reading_feedback' | 'ritual_completion';
  data: Record<string, any>;
  timestamp: Date;
}

/**
 * Interface for personalization context
 */
export interface PersonalizationContext {
  userId: string;
  currentPage: string;
  currentTheme: string;
  currentMood?: string;
  recentCards?: string[];
  recentJournalThemes?: string[];
  seasonalContext?: string;
  lunarPhase?: string;
}

/**
 * Interface for personalized content
 */
export interface PersonalizedContent {
  contentType: 'tarot_reading' | 'journal_prompt' | 'ritual_suggestion' | 'astrology_insight';
  content: string;
  tone: 'supportive' | 'direct' | 'mystical' | 'practical' | 'philosophical';
  visualTheme?: 'light' | 'dark' | 'cosmic' | 'earthy' | 'fiery' | 'watery' | 'airy';
  relatedCards?: string[];
  relatedThemes?: string[];
}

/**
 * Track a user interaction
 */
export async function trackUserInteraction(interaction: UserInteraction): Promise<void> {
  try {
    // Store the interaction in Supabase
    const { error } = await supabase
      .from('user_interactions')
      .insert([{
        user_id: interaction.userId,
        interaction_type: interaction.interactionType,
        data: interaction.data,
        created_at: interaction.timestamp
      }]);
    
    if (error) throw error;
    
    // Update the user's spiritual profile based on the interaction
    await updateSpiritualProfile(interaction);
    
  } catch (error) {
    console.error('Error tracking user interaction:', error);
  }
}

/**
 * Update the user's spiritual profile based on an interaction
 */
async function updateSpiritualProfile(interaction: UserInteraction): Promise<void> {
  try {
    // Get the user's current spiritual profile
    const { data: profileData, error: profileError } = await supabase
      .from('spiritual_profiles')
      .select('*')
      .eq('user_id', interaction.userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') throw profileError;
    
    // Create a default profile if none exists
    let profile: SpiritualProfile;
    if (!profileData) {
      profile = {
        userId: interaction.userId,
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
        createdAt: new Date(profileData.created_at)
      };
    }
    
    // Update the profile based on the interaction type
    let updatedProfile = { ...profile };
    
    switch (interaction.interactionType) {
      case 'journal_entry':
        // Generate embedding for the journal entry
        const journalContent = interaction.data.content;
        const embedding = await generateEmbedding(journalContent);
        
        // Update the profile with the journal entry
        updatedProfile = updateProfileWithJournalEntry(profile, {
          content: journalContent,
          emotions: interaction.data.emotions || [],
          tags: interaction.data.tags || [],
          embedding,
          sentiment: interaction.data.sentiment || { positive: 0.33, negative: 0.33, neutral: 0.34 }
        });
        break;
      
      case 'card_draw':
        // Update the profile with the tarot draw
        updatedProfile = updateProfileWithTarotDraw(profile, {
          cardId: interaction.data.cardId,
          timestamp: interaction.timestamp,
          context: interaction.data.context || 'general',
          reaction: interaction.data.reaction,
          spreadType: interaction.data.spreadType
        });
        break;
      
      case 'reading_feedback':
        // Update the profile with the reading feedback
        if (interaction.data.rating) {
          // Update the reaction for the most recent card draw
          if (updatedProfile.drawHistory.length > 0) {
            updatedProfile.drawHistory[0].reaction = 
              interaction.data.rating > 3 ? 'positive' : 
              interaction.data.rating < 3 ? 'negative' : 'neutral';
          }
        }
        break;
      
      case 'page_view':
        // Update usage patterns
        const hour = new Date(interaction.timestamp).getHours();
        if (hour >= 5 && hour < 12) {
          updatedProfile.timeOfDayPreference = 'morning';
        } else if (hour >= 12 && hour < 17) {
          updatedProfile.timeOfDayPreference = 'afternoon';
        } else if (hour >= 17 && hour < 22) {
          updatedProfile.timeOfDayPreference = 'evening';
        } else {
          updatedProfile.timeOfDayPreference = 'night';
        }
        
        // Update weekday preference
        const day = new Date(interaction.timestamp).getDay();
        updatedProfile.weekdayPreference = updatedProfile.weekdayPreference || [0, 0, 0, 0, 0, 0, 0];
        updatedProfile.weekdayPreference[day] += 1;
        break;
      
      default:
        break;
    }
    
    // Store the updated profile in Supabase
    const { error: updateError } = await supabase
      .from('spiritual_profiles')
      .upsert({
        user_id: updatedProfile.userId,
        sun_sign: updatedProfile.sunSign,
        moon_sign: updatedProfile.moonSign,
        rising_sign: updatedProfile.risingSign,
        birth_chart: updatedProfile.birthChart,
        draw_history: updatedProfile.drawHistory,
        significator_card: updatedProfile.significatorCard,
        preferred_spreads: updatedProfile.preferredSpreads,
        mood_trend: updatedProfile.moodTrend,
        emotion_vector: updatedProfile.emotionVector,
        journal_themes: updatedProfile.journalThemes,
        journal_sentiment: updatedProfile.journalSentiment,
        time_of_day_preference: updatedProfile.timeOfDayPreference,
        weekday_preference: updatedProfile.weekdayPreference,
        session_frequency: updatedProfile.sessionFrequency,
        visual_theme: updatedProfile.visualTheme,
        reading_tone: updatedProfile.readingTone,
        profile_embedding: updatedProfile.profileEmbedding,
        last_updated: updatedProfile.lastUpdated,
        created_at: updatedProfile.createdAt
      });
    
    if (updateError) throw updateError;
    
  } catch (error) {
    console.error('Error updating spiritual profile:', error);
  }
}

/**
 * Get personalized content based on the user's spiritual profile
 */
export async function getPersonalizedContent(
  context: PersonalizationContext
): Promise<PersonalizedContent> {
  try {
    // Get the user's spiritual profile
    const { data: profileData, error: profileError } = await supabase
      .from('spiritual_profiles')
      .select('*')
      .eq('user_id', context.userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Convert the profile data to a SpiritualProfile object
    const profile: SpiritualProfile = {
      ...profileData,
      userId: profileData.user_id,
      lastUpdated: new Date(profileData.last_updated),
      createdAt: new Date(profileData.created_at)
    };
    
    // Generate personalized content based on the context and profile
    let content: string = '';
    let tone: 'supportive' | 'direct' | 'mystical' | 'practical' | 'philosophical' = profile.readingTone || 'supportive';
    let relatedCards: string[] = [];
    let relatedThemes: string[] = [];
    
    // Determine the content type based on the current page
    let contentType: 'tarot_reading' | 'journal_prompt' | 'astrology_insight' | 'ritual_suggestion';
    
    if (context.currentPage.includes('tarot')) {
      contentType = 'tarot_reading';
      
      // Generate a personalized tarot reading
      content = generateTarotReading(profile, context);
      relatedCards = profile.drawHistory.slice(0, 3).map(draw => draw.cardId);
      
    } else if (context.currentPage.includes('journal')) {
      contentType = 'journal_prompt';
      
      // Generate a personalized journal prompt
      content = generateJournalPrompt(profile, context);
      relatedThemes = profile.journalThemes.slice(0, 3).map(theme => theme.theme);
      
    } else if (context.currentPage.includes('astrology')) {
      contentType = 'astrology_insight';
      
      // Generate a personalized astrology insight
      content = generateAstrologyInsight(profile, context);
      
    } else {
      contentType = 'ritual_suggestion';
      
      // Generate a personalized ritual suggestion
      content = generateRitualSuggestion(profile, context);
      relatedThemes = profile.journalThemes.slice(0, 2).map(theme => theme.theme);
    }
    
    return {
      contentType,
      content,
      tone,
      visualTheme: profile.visualTheme,
      relatedCards,
      relatedThemes
    };
    
  } catch (error) {
    console.error('Error getting personalized content:', error);
    
    // Return a default content if there's an error
    return {
      contentType: 'tarot_reading',
      content: 'Your mystical journey awaits. Explore the cards to reveal insights about your path.',
      tone: 'supportive'
    };
  }
}

/**
 * Generate a personalized tarot reading
 */
function generateTarotReading(profile: SpiritualProfile, context: PersonalizationContext): string {
  // This is a placeholder implementation
  // In a real implementation, this would use the profile data and context
  // to generate a personalized tarot reading using AI or templates
  
  const mood = context.currentMood || profile.moodTrend[0] || 'reflective';
  const theme = profile.journalThemes[0]?.theme || 'spiritual growth';
  const tone = profile.readingTone || 'supportive';
  
  let reading = '';
  
  switch (tone) {
    case 'supportive':
      reading = `As you navigate through feelings of ${mood}, the cards reveal a path of ${theme}. Trust in your inner wisdom as you move forward.`;
      break;
    case 'direct':
      reading = `Your ${mood} state is directly connected to your journey of ${theme}. The cards suggest focusing on what truly matters now.`;
      break;
    case 'mystical':
      reading = `The veil between worlds thins as you explore ${theme} through your ${mood} lens. The cosmic energies align to guide your steps.`;
      break;
    case 'practical':
      reading = `Consider how your ${mood} feelings can be channeled into practical steps toward ${theme}. The cards suggest a grounded approach.`;
      break;
    case 'philosophical':
      reading = `What deeper meaning lies within your ${mood} state? The cards invite you to contemplate how ${theme} connects to your broader life journey.`;
      break;
    default:
      reading = `Your reading today focuses on ${theme}, especially as it relates to your current ${mood} energy.`;
  }
  
  return reading;
}

/**
 * Generate a personalized journal prompt
 */
function generateJournalPrompt(profile: SpiritualProfile, context: PersonalizationContext): string {
  // This is a placeholder implementation
  
  const mood = context.currentMood || profile.moodTrend[0] || 'reflective';
  const theme = profile.journalThemes[0]?.theme || 'spiritual growth';
  const card = profile.drawHistory[0]?.cardId || 'your intuition';
  
  const prompts = [
    `How does your current ${mood} state relate to your journey of ${theme}? What insights does ${card} offer about this connection?`,
    `Reflect on a moment when you felt deeply connected to ${theme}. How does this memory influence your current ${mood} feelings?`,
    `What would ${card} advise you about embracing your ${mood} energy in relation to ${theme}?`,
    `Write a letter to your future self about how you're navigating ${theme} while experiencing ${mood} emotions.`,
    `How might the energy of ${card} help you transform your relationship with ${theme}, especially during times of ${mood}?`
  ];
  
  // Select a prompt based on the day of the month (for variety)
  const day = new Date().getDate();
  const promptIndex = day % prompts.length;
  
  return prompts[promptIndex];
}

/**
 * Generate a personalized astrology insight
 */
function generateAstrologyInsight(profile: SpiritualProfile, context: PersonalizationContext): string {
  // This is a placeholder implementation
  
  const sunSign = profile.sunSign || 'your sun sign';
  const moonSign = profile.moonSign || 'your moon sign';
  const theme = profile.journalThemes[0]?.theme || 'personal growth';
  
  return `With ${sunSign} energy guiding your conscious self and ${moonSign} influencing your emotional landscape, you're uniquely positioned to explore ${theme}. The current planetary alignments suggest focusing on balance and integration.`;
}

/**
 * Generate a personalized ritual suggestion
 */
function generateRitualSuggestion(profile: SpiritualProfile, context: PersonalizationContext): string {
  // This is a placeholder implementation
  
  const mood = context.currentMood || profile.moodTrend[0] || 'reflective';
  const theme = profile.journalThemes[0]?.theme || 'spiritual growth';
  const timeOfDay = profile.timeOfDayPreference || 'evening';
  
  const rituals = {
    morning: `Begin your day with a ${mood === 'energetic' ? 'grounding' : 'energizing'} ritual. Take 5 minutes to sit quietly, focusing on your breath and setting an intention related to ${theme}.`,
    afternoon: `Create a midday reset ritual. Step outside for a few minutes, feel the sun on your skin, and visualize releasing any tension that's blocking your connection to ${theme}.`,
    evening: `Before sleep, create a sacred space for reflection. Light a candle, write three insights about ${theme} from your day, and express gratitude for your journey.`,
    night: `Under the night sky, connect with the moon's energy. Visualize its light filling you with clarity about ${theme}, especially as it relates to your ${mood} feelings.`
  };
  
  return rituals[timeOfDay];
}

/**
 * Get agent learning prompt template
 */
export function getAgentLearningPrompt(profile: SpiritualProfile, context: PersonalizationContext): string {
  // This is the prompt template for the agent learning system
  
  const mood = context.currentMood || profile.moodTrend[0] || 'reflective';
  const theme = profile.journalThemes[0]?.theme || 'spiritual growth';
  const card = profile.drawHistory[0]?.cardId || 'The Fool';
  const tone = profile.readingTone || 'supportive';
  
  return `
You are Augment, a continuously learning UX assistant embedded in the Mystic Arcana platform.
Your role is to:
- Observe user interactions (readings, mood tags, journaling)
- Evolve spiritual archetype profiles
- Adjust interface tone, card suggestions, and prompts accordingly

Current user profile:
- Recent mood: "${mood}"
- Sun sign: ${profile.sunSign || 'Unknown'}
- Recent card drawn: ${card}
- Journal theme: "${theme}"
- Visual theme: ${profile.visualTheme || 'cosmic'}
- Preferred tone: ${tone}

Current context:
- Page: ${context.currentPage}
- Theme: ${context.currentTheme}
- Seasonal context: ${context.seasonalContext || 'Spring'}
- Lunar phase: ${context.lunarPhase || 'Waxing'}

Your decisions must align with:
- Current monthly archetype theme
- User feedback and prior resonance metrics
- Visual consistency with mood/emotion overlays

Generate a personalized response that:
1. Acknowledges the user's current emotional state
2. Connects to their recent spiritual explorations
3. Offers guidance aligned with their preferred tone
4. Suggests a next step that builds on their journey
`;
}
