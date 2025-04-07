/**
 * Spiritual Profile Model
 *
 * This model represents a user's spiritual profile, which is used for personalization
 * and recommendation purposes.
 */

export interface SpiritualProfile {
  // User identification
  userId: string;

  // Astrological information
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
  birthChart?: {
    houses: Record<string, string>;
    planets: Record<string, { sign: string; house: number; degree: number }>;
  };

  // Tarot preferences and history
  drawHistory: {
    cardId: string;
    timestamp: Date;
    context: string;
    reaction?: 'positive' | 'neutral' | 'negative';
  }[];
  significatorCard?: string;
  preferredSpreads: string[];

  // Emotional and mood data
  moodTrend: string[];
  emotionVector: number[];

  // Journal themes and patterns
  journalThemes: {
    theme: string;
    weight: number;
  }[];
  journalSentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };

  // Usage patterns
  timeOfDayPreference: 'morning' | 'afternoon' | 'evening' | 'night';
  weekdayPreference: number[]; // 0-6, where 0 is Sunday
  sessionFrequency: number; // Average sessions per week

  // Personalization preferences
  visualTheme: 'light' | 'dark' | 'cosmic' | 'earthy' | 'fiery' | 'watery' | 'airy';
  readingTone: 'supportive' | 'direct' | 'mystical' | 'practical' | 'philosophical';

  // Vector embeddings
  profileEmbedding?: number[];

  // Metadata
  lastUpdated: Date;
  createdAt: Date;
}

/**
 * Create a new spiritual profile with default values
 */
export function createDefaultSpiritualProfile(userId: string): SpiritualProfile {
  return {
    userId,
    drawHistory: [],
    moodTrend: [],
    emotionVector: Array(1536).fill(0), // Default empty embedding vector
    journalThemes: [],
    journalSentiment: { positive: 0, negative: 0, neutral: 0 },
    preferredSpreads: [],
    timeOfDayPreference: 'evening',
    weekdayPreference: [0, 1, 2, 3, 4, 5, 6], // No preference initially
    sessionFrequency: 0,
    visualTheme: 'cosmic',
    readingTone: 'supportive',
    lastUpdated: new Date(),
    createdAt: new Date()
  };
}

/**
 * Update the spiritual profile with new journal data
 */
export function updateProfileWithJournalEntry(
  profile: SpiritualProfile,
  journalEntry: {
    content: string;
    emotions: string[];
    tags: string[];
    embedding: number[];
    sentiment: { positive: number; negative: number; neutral: number };
  }
): SpiritualProfile {
  // Create a copy of the profile to update
  const updatedProfile = { ...profile };

  // Update mood trend with the latest emotions
  updatedProfile.moodTrend = [
    ...journalEntry.emotions,
    ...updatedProfile.moodTrend
  ].slice(0, 10); // Keep only the 10 most recent moods

  // Update journal themes
  const newThemes = journalEntry.tags.map(tag => ({ theme: tag, weight: 1 }));
  const existingThemes = updatedProfile.journalThemes || [];

  // Combine and merge themes
  const mergedThemes: Record<string, number> = {};

  // Add existing themes
  existingThemes.forEach(({ theme, weight }) => {
    mergedThemes[theme] = (mergedThemes[theme] || 0) + weight * 0.9; // Decay factor for older themes
  });

  // Add new themes
  newThemes.forEach(({ theme, weight }) => {
    mergedThemes[theme] = (mergedThemes[theme] || 0) + weight;
  });

  // Convert back to array and sort by weight
  updatedProfile.journalThemes = Object.entries(mergedThemes)
    .map(([theme, weight]) => ({ theme, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 20); // Keep only the top 20 themes

  // Update journal sentiment
  updatedProfile.journalSentiment = {
    positive: (updatedProfile.journalSentiment.positive * 0.9) + journalEntry.sentiment.positive,
    negative: (updatedProfile.journalSentiment.negative * 0.9) + journalEntry.sentiment.negative,
    neutral: (updatedProfile.journalSentiment.neutral * 0.9) + journalEntry.sentiment.neutral
  };

  // Update emotion vector (simple weighted average)
  if (!updatedProfile.emotionVector || updatedProfile.emotionVector.length === 0) {
    updatedProfile.emotionVector = journalEntry.embedding;
  } else {
    updatedProfile.emotionVector = updatedProfile.emotionVector.map((val, i) =>
      (val * 0.8) + (journalEntry.embedding[i] * 0.2)
    );
  }

  // Update timestamp
  updatedProfile.lastUpdated = new Date();

  return updatedProfile;
}

/**
 * Update the spiritual profile with new tarot draw data
 */
export function updateProfileWithTarotDraw(
  profile: SpiritualProfile,
  tarotDraw: {
    cardId: string;
    timestamp: Date;
    context: string;
    reaction?: 'positive' | 'neutral' | 'negative';
    spreadType?: string;
  }
): SpiritualProfile {
  // Create a copy of the profile to update
  const updatedProfile = { ...profile };

  // Add the new draw to the history
  updatedProfile.drawHistory = [
    tarotDraw,
    ...updatedProfile.drawHistory
  ].slice(0, 50); // Keep only the 50 most recent draws

  // Update preferred spreads if a spread type is provided
  if (tarotDraw.spreadType) {
    const spreadIndex = updatedProfile.preferredSpreads.indexOf(tarotDraw.spreadType);

    if (spreadIndex === -1) {
      // Add the spread if it's not already in the list
      updatedProfile.preferredSpreads.push(tarotDraw.spreadType);
    } else {
      // Move the spread to the front of the list
      updatedProfile.preferredSpreads.splice(spreadIndex, 1);
      updatedProfile.preferredSpreads.unshift(tarotDraw.spreadType);
    }

    // Keep only the top 5 preferred spreads
    updatedProfile.preferredSpreads = updatedProfile.preferredSpreads.slice(0, 5);
  }

  // Update timestamp
  updatedProfile.lastUpdated = new Date();

  return updatedProfile;
}

/**
 * Generate a personalized recommendation based on the spiritual profile
 */
export function generatePersonalizedRecommendation(
  profile: SpiritualProfile,
  recommendationType: 'tarot' | 'astrology' | 'journal' | 'ritual'
): string {
  // This is a placeholder implementation
  // In a real implementation, this would use the profile data to generate
  // personalized recommendations using AI or rule-based systems

  switch (recommendationType) {
    case 'tarot':
      return `Based on your recent ${profile.moodTrend[0] || 'reflective'} mood and interest in ${profile.journalThemes[0]?.theme || 'spiritual growth'}, we recommend a ${profile.preferredSpreads[0] || 'three-card spread'} focusing on guidance for your current path.`;

    case 'astrology':
      return `With your ${profile.sunSign || 'unique'} energy, today's planetary alignments suggest focusing on ${profile.journalThemes[0]?.theme || 'inner reflection'} and ${profile.journalThemes[1]?.theme || 'personal growth'}.`;

    case 'journal':
      return `Consider exploring how ${profile.journalThemes[0]?.theme || 'recent events'} connect with your ${profile.moodTrend[0] || 'current'} emotional state. How might ${profile.drawHistory[0]?.cardId || "the cards you've drawn recently"} relate to this experience?`;

    case 'ritual':
      return `A ${profile.moodTrend[0] === 'energetic' ? 'grounding' : 'energizing'} ritual involving ${profile.journalThemes[0]?.theme || 'meditation'} could help you align with your current spiritual needs.`;

    default:
      return `We've personalized your experience based on your unique spiritual journey. Explore your recommendations in the dashboard.`;
  }
}

/**
 * Calculate the compatibility between two spiritual profiles
 */
export function calculateProfileCompatibility(
  profileA: SpiritualProfile,
  profileB: SpiritualProfile
): number {
  // This is a placeholder implementation
  // In a real implementation, this would use vector similarity and other factors

  // Simple vector similarity if both profiles have embeddings
  if (profileA.emotionVector && profileB.emotionVector) {
    return cosineSimilarity(profileA.emotionVector, profileB.emotionVector);
  }

  // Fallback to a simple compatibility score
  return 0.5; // Default medium compatibility
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}
