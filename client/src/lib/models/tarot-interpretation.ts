/**
 * Tarot Card Interpretation Model
 * 
 * This model represents the comprehensive interpretation data for tarot cards,
 * including personalization aspects and multiple interpretation layers.
 */

import { SpiritualProfile } from './spiritual-profile';

/**
 * Core interpretation aspects for a tarot card
 */
export interface TarotCardInterpretationCore {
  // Basic card information
  cardId: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number | string;
  
  // Core meanings
  keywords: string[];
  elementalAssociation?: string;
  astrologicalAssociation?: string;
  numerologicalAssociation?: string;
  
  // Detailed interpretations
  generalMeaning: string;
  uprightMeaning: string;
  reversedMeaning: string;
  
  // Symbolic elements
  symbols: string[];
  colors: string[];
  figures: string[];
  
  // Narrative elements
  story: string;
  journey: string;
  lessons: string[];
  
  // Psychological aspects
  psychologicalImplications: string;
  shadowAspects: string;
  growthOpportunities: string;
  
  // Relational aspects
  relationshipContext: string;
  careerContext: string;
  spiritualContext: string;
  healthContext: string;
  financialContext: string;
  
  // Connections to other cards
  complementaryCards: string[];
  opposingCards: string[];
  progressionCards: string[];
}

/**
 * Interpretation sources for a tarot card
 */
export interface TarotCardInterpretationSources {
  // Traditional sources
  traditionalSources: {
    author: string;
    title: string;
    excerpt: string;
    year?: number;
    url?: string;
  }[];
  
  // Modern sources
  modernSources: {
    author: string;
    title: string;
    excerpt: string;
    year?: number;
    url?: string;
  }[];
  
  // Video sources (including YouTube)
  videoSources: {
    title: string;
    creator: string;
    platform: string;
    url: string;
    transcriptExcerpt: string;
    timestamp?: string;
  }[];
  
  // Community interpretations
  communityInterpretations: {
    username: string;
    interpretation: string;
    rating: number;
    date: Date;
  }[];
}

/**
 * Personalization aspects for a tarot card interpretation
 */
export interface TarotCardPersonalizationAspects {
  // Emotional resonance
  emotionalResonance: {
    emotion: string;
    resonanceLevel: number; // 1-10
    interpretation: string;
  }[];
  
  // Life area focus
  lifeAreaFocus: {
    area: 'love' | 'career' | 'spirituality' | 'health' | 'finances' | 'creativity' | 'family';
    relevance: number; // 1-10
    interpretation: string;
  }[];
  
  // Astrological connections
  astrologicalConnections: {
    sign: string;
    planet: string;
    house: number;
    interpretation: string;
  }[];
  
  // Seasonal and cyclical aspects
  seasonalAspects: {
    season: 'spring' | 'summer' | 'fall' | 'winter';
    lunarPhase: string;
    interpretation: string;
  }[];
  
  // Personal growth focus
  personalGrowthFocus: {
    growthArea: string;
    challenge: string;
    opportunity: string;
    advice: string;
  }[];
}

/**
 * Complete tarot card interpretation model
 */
export interface TarotCardInterpretation {
  // Core interpretation data
  core: TarotCardInterpretationCore;
  
  // Sources of interpretation
  sources?: TarotCardInterpretationSources;
  
  // Personalization aspects
  personalization?: TarotCardPersonalizationAspects;
  
  // Metadata
  metadata: {
    lastUpdated: Date;
    version: string;
    contributors: string[];
  };
}

/**
 * Context for generating a personalized interpretation
 */
export interface InterpretationContext {
  userId: string;
  cardId: string;
  isReversed: boolean;
  spreadPosition?: string;
  spreadType?: string;
  question?: string;
  focusArea?: string;
  otherCards?: string[];
  currentMood?: string;
  timeOfDay?: string;
  date: Date;
}

/**
 * Personalized interpretation result
 */
export interface PersonalizedInterpretation {
  cardId: string;
  cardName: string;
  isReversed: boolean;
  
  // Core interpretation elements
  title: string;
  summary: string;
  detailedInterpretation: string;
  
  // Personalized elements
  personalInsight: string;
  advice: string;
  challenge: string;
  opportunity: string;
  
  // Context-specific elements
  relationToQuestion?: string;
  relationToOtherCards?: string;
  
  // Visual elements
  suggestedImageUrl?: string;
  suggestedColors?: string[];
  
  // Sources used
  sourcesUsed?: {
    type: 'traditional' | 'modern' | 'video' | 'community';
    name: string;
    url?: string;
  }[];
  
  // Metadata
  generatedAt: Date;
  personalizationLevel: number; // 1-10
}

/**
 * Generate a personalized interpretation for a tarot card
 */
export function generatePersonalizedInterpretation(
  card: TarotCardInterpretation,
  context: InterpretationContext,
  userProfile: SpiritualProfile
): PersonalizedInterpretation {
  // This is a placeholder implementation
  // In a real implementation, this would use the card data, context, and user profile
  // to generate a personalized interpretation
  
  const isReversed = context.isReversed;
  const cardMeaning = isReversed ? card.core.reversedMeaning : card.core.uprightMeaning;
  
  // Get the user's current mood or most recent mood
  const currentMood = context.currentMood || userProfile.moodTrend[0] || 'reflective';
  
  // Get the user's most relevant journal themes
  const journalThemes = userProfile.journalThemes.slice(0, 3).map(theme => theme.theme);
  
  // Get the user's most recent tarot cards
  const recentCards = userProfile.drawHistory.slice(0, 3).map(draw => draw.cardId);
  
  // Generate a personalized title
  let title = '';
  if (currentMood === 'anxious' || currentMood === 'stressed') {
    title = `Finding Peace Through ${card.core.name}`;
  } else if (currentMood === 'inspired' || currentMood === 'energetic') {
    title = `Channeling Your Energy with ${card.core.name}`;
  } else if (currentMood === 'reflective' || currentMood === 'contemplative') {
    title = `Deeper Insights from ${card.core.name}`;
  } else {
    title = `${card.core.name}: Your Personal Guide Today`;
  }
  
  // Generate a personalized summary
  const summary = `The ${card.core.name} appears in your reading today, bringing energy that resonates with your current ${currentMood} state. This card suggests a focus on ${journalThemes[0] || 'personal growth'}.`;
  
  // Generate a personalized detailed interpretation
  const detailedInterpretation = `${cardMeaning} As you navigate through feelings of ${currentMood}, this card offers unique guidance. The symbols of ${card.core.symbols.join(', ')} speak directly to your journey.`;
  
  // Generate personalized advice
  let advice = '';
  if (journalThemes.includes('meditation') || journalThemes.includes('mindfulness')) {
    advice = `Take time for meditation today, focusing on the energy of ${card.core.name}. Visualize the card's imagery and let it speak to you in the silence.`;
  } else if (journalThemes.includes('creativity') || journalThemes.includes('expression')) {
    advice = `Express the energy of ${card.core.name} through creative work today. Notice how this card's themes emerge in your creative process.`;
  } else {
    advice = `Reflect on how the energy of ${card.core.name} is manifesting in your life right now. Journal about any insights that arise.`;
  }
  
  // Generate personalized challenge
  const challenge = `You may find it challenging to embrace the ${isReversed ? 'reversed' : 'upright'} energy of ${card.core.name}, especially when feeling ${currentMood}. Be mindful of ${card.core.shadowAspects}.`;
  
  // Generate personalized opportunity
  const opportunity = `This card offers an opportunity to explore ${journalThemes[0] || 'personal growth'} more deeply. The ${card.core.name} invites you to ${card.core.growthOpportunities}.`;
  
  // Generate relation to question if provided
  let relationToQuestion = '';
  if (context.question) {
    relationToQuestion = `Regarding your question about ${context.question}, the ${card.core.name} suggests ${isReversed ? 'challenges around' : 'opportunities for'} ${card.core.keywords[0]}.`;
  }
  
  // Generate relation to other cards if provided
  let relationToOtherCards = '';
  if (context.otherCards && context.otherCards.length > 0) {
    relationToOtherCards = `The ${card.core.name} works with ${context.otherCards.join(', ')} to create a narrative about ${journalThemes[0] || 'your current journey'}.`;
  } else if (recentCards.length > 0) {
    relationToOtherCards = `In the context of your recent cards (${recentCards.join(', ')}), the ${card.core.name} suggests a progression in your spiritual journey.`;
  }
  
  return {
    cardId: card.core.cardId,
    cardName: card.core.name,
    isReversed,
    title,
    summary,
    detailedInterpretation,
    personalInsight: `Based on your journal entries about ${journalThemes.join(', ')}, the ${card.core.name} suggests a connection between these themes and your current path.`,
    advice,
    challenge,
    opportunity,
    relationToQuestion,
    relationToOtherCards,
    suggestedImageUrl: `/images/tarot/${card.core.arcana === 'major' ? 'major' : `minor-arcana/${card.core.suit}`}/${card.core.cardId}.jpg`,
    suggestedColors: card.core.colors,
    sourcesUsed: card.sources ? [
      { type: 'traditional', name: card.sources.traditionalSources[0]?.title || 'Traditional Tarot Wisdom' },
      { type: 'modern', name: card.sources.modernSources[0]?.title || 'Modern Interpretation' }
    ] : undefined,
    generatedAt: new Date(),
    personalizationLevel: 8
  };
}
