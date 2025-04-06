/**
 * Embedding Service
 *
 * This service handles the generation and management of vector embeddings
 * for personalization and recommendation features.
 */

import { supabase } from '@/lib/supabaseClient';

// Types for embeddings
export interface Embedding {
  id: string;
  userId: string;
  type: 'journal' | 'tarot' | 'profile' | 'astrology';
  vector: number[];
  metadata: Record<string, any>;
  createdAt: Date;
}

// Types for journal entries
export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  emotions: string[];
  tags: string[];
  createdAt: Date;
  embedding?: number[];
  similarity?: number;
}

/**
 * Generate an embedding for text using OpenAI's API
 * In a production environment, this would call the OpenAI API
 * For development, we'll use a mock implementation
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // In a real implementation, this would call the OpenAI API
  // For development, we'll generate a mock embedding

  // Simple hash function to generate a deterministic but seemingly random value
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  // Generate a mock embedding vector of 1536 dimensions (same as OpenAI's ada-002)
  const mockEmbedding: number[] = [];
  const seed = hashString(text);

  for (let i = 0; i < 1536; i++) {
    // Generate a deterministic but seemingly random value between -1 and 1
    const value = Math.sin(seed * i) / 2 + 0.5;
    mockEmbedding.push(value);
  }

  return mockEmbedding;
}

/**
 * Store an embedding in the database
 */
export async function storeEmbedding(
  userId: string,
  type: 'journal' | 'tarot' | 'profile' | 'astrology',
  vector: number[],
  metadata: Record<string, any>
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('embeddings')
      .insert([
        {
          user_id: userId,
          type,
          vector,
          metadata,
          created_at: new Date()
        }
      ])
      .select('id')
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error('Error storing embedding:', error);
    return null;
  }
}

/**
 * Analyze a journal entry and extract emotions and tags
 */
export async function analyzeJournalEntry(content: string): Promise<{ emotions: string[]; tags: string[] }> {
  // In a real implementation, this would use NLP or call an AI API
  // For development, we'll use a simple keyword-based approach

  const emotionKeywords: Record<string, string[]> = {
    'joy': ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'pleased'],
    'sadness': ['sad', 'unhappy', 'depressed', 'down', 'blue', 'melancholy'],
    'anger': ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated'],
    'fear': ['afraid', 'scared', 'fearful', 'anxious', 'worried', 'nervous'],
    'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
    'disgust': ['disgusted', 'repulsed', 'revolted', 'nauseated'],
    'trust': ['trust', 'believe', 'faith', 'confident', 'assured'],
    'anticipation': ['anticipate', 'expect', 'looking forward', 'hopeful']
  };

  const spiritualTags: string[] = [
    'meditation', 'mindfulness', 'spiritual', 'energy', 'chakra', 'aura',
    'universe', 'cosmic', 'divine', 'sacred', 'ritual', 'practice',
    'intuition', 'guidance', 'vision', 'dream', 'manifestation', 'intention',
    'gratitude', 'blessing', 'prayer', 'healing', 'transformation', 'journey'
  ];

  const contentLower = content.toLowerCase();
  const emotions: string[] = [];
  const tags: string[] = [];

  // Extract emotions
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (contentLower.includes(keyword)) {
        emotions.push(emotion);
        break;
      }
    }
  }

  // Extract spiritual tags
  for (const tag of spiritualTags) {
    if (contentLower.includes(tag)) {
      tags.push(tag);
    }
  }

  return { emotions, tags };
}

/**
 * Store a journal entry with its embedding
 */
export async function storeJournalEntry(
  userId: string,
  title: string,
  content: string,
  emotions: string[],
  tags: string[]
): Promise<string | null> {
  try {
    // Generate embedding for the journal entry
    const embedding = await generateEmbedding(content);

    // Store the journal entry
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: userId,
          title: title || 'Untitled Entry',
          content,
          emotions,
          tags,
          embedding,
          created_at: new Date()
        }
      ])
      .select('id')
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error('Error storing journal entry:', error);
    return null;
  }
}

/**
 * Find similar journal entries based on content
 */
export async function findSimilarJournalEntries(
  userId: string,
  content: string,
  limit: number = 5
): Promise<JournalEntry[]> {
  try {
    // Generate embedding for the query content
    const queryEmbedding = await generateEmbedding(content);

    // In a real implementation with pgvector, you would use a query like:
    // SELECT * FROM journal_entries
    // WHERE user_id = $1
    // ORDER BY embedding <-> $2
    // LIMIT $3

    // For development, we'll simulate this by fetching all entries and sorting them
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Calculate cosine similarity between query embedding and each entry
    const entriesWithSimilarity = data.map(entry => {
      const similarity = calculateCosineSimilarity(queryEmbedding, entry.embedding);
      return { ...entry, similarity };
    });

    // Sort by similarity (highest first) and take the top 'limit' entries
    const similarEntries = entriesWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        title: entry.title || 'Untitled Entry',
        content: entry.content,
        emotions: entry.emotions,
        tags: entry.tags,
        createdAt: new Date(entry.created_at),
        embedding: entry.embedding,
        similarity: entry.similarity
      }));

    return similarEntries;
  } catch (error) {
    console.error('Error finding similar journal entries:', error);
    return [];
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function calculateCosineSimilarity(a: number[], b: number[]): number {
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

/**
 * Update user profile embedding based on their interactions and preferences
 */
export async function updateUserProfileEmbedding(userId: string): Promise<boolean> {
  try {
    // In a real implementation, this would:
    // 1. Fetch the user's journal entries, tarot readings, and other interactions
    // 2. Generate a combined embedding that represents their spiritual profile
    // 3. Store this embedding for personalization

    // For development, we'll create a simple mock implementation

    // Fetch the user's profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Fetch the user's journal entries
    const { data: journalData, error: journalError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId);

    if (journalError) throw journalError;

    // Create a text representation of the user's profile and journal entries
    let profileText = `User ${userData.username} with interests in spirituality`;

    if (journalData && journalData.length > 0) {
      // Add journal content to the profile text
      profileText += ` has written ${journalData.length} journal entries`;

      // Extract emotions and tags
      const emotions = new Set<string>();
      const tags = new Set<string>();

      journalData.forEach(entry => {
        if (entry.emotions) {
          entry.emotions.forEach((emotion: string) => emotions.add(emotion));
        }
        if (entry.tags) {
          entry.tags.forEach((tag: string) => tags.add(tag));
        }
      });

      if (emotions.size > 0) {
        profileText += ` expressing emotions like ${Array.from(emotions).join(', ')}`;
      }

      if (tags.size > 0) {
        profileText += ` with interests in ${Array.from(tags).join(', ')}`;
      }
    }

    // Generate embedding for the profile text
    const profileEmbedding = await generateEmbedding(profileText);

    // Store the profile embedding
    const { error: embeddingError } = await supabase
      .from('user_profile_embeddings')
      .upsert([
        {
          user_id: userId,
          embedding: profileEmbedding,
          metadata: {
            journal_count: journalData?.length || 0,
            updated_at: new Date()
          },
          updated_at: new Date()
        }
      ]);

    if (embeddingError) throw embeddingError;

    return true;
  } catch (error) {
    console.error('Error updating user profile embedding:', error);
    return false;
  }
}

/**
 * Get personalized content recommendations based on user profile
 */
export async function getPersonalizedRecommendations(
  userId: string,
  contentType: 'tarot' | 'astrology' | 'journal_prompts',
  limit: number = 3
): Promise<any[]> {
  try {
    // In a real implementation, this would:
    // 1. Fetch the user's profile embedding
    // 2. Find content that is similar to their profile
    // 3. Return personalized recommendations

    // For development, we'll return mock recommendations

    const mockRecommendations = {
      tarot: [
        { id: '1', name: 'The Hermit', description: 'A period of introspection and self-discovery awaits you.' },
        { id: '2', name: 'The Star', description: 'Hope and inspiration are guiding your path forward.' },
        { id: '3', name: 'The Moon', description: 'Trust your intuition as you navigate through uncertainty.' }
      ],
      astrology: [
        { id: '1', name: 'Mercury Retrograde', description: 'A time to review and reflect on communication patterns.' },
        { id: '2', name: 'Venus Transit', description: 'Focus on relationships and what you truly value.' },
        { id: '3', name: 'Full Moon in Pisces', description: 'Emotional insights and spiritual awakening are highlighted.' }
      ],
      journal_prompts: [
        { id: '1', prompt: 'Reflect on a moment when you felt deeply connected to your intuition.' },
        { id: '2', prompt: 'What spiritual practices bring you the most peace and clarity?' },
        { id: '3', prompt: 'Describe a recurring symbol or theme in your dreams lately.' }
      ]
    };

    return mockRecommendations[contentType];
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
}
