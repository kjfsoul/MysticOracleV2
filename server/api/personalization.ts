import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generate embeddings for text using OpenAI
 * 
 * @param text Text to generate embeddings for
 * @returns Vector embedding
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Update user spiritual profile
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function updateUserProfile(req: Request, res: Response) {
  try {
    const { userId, journalEntry, drawnCards, zodiacPlacements, emotionTags } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Get existing user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // Update profile data
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    // Process journal entry if provided
    if (journalEntry) {
      // Generate embedding for journal entry
      const embedding = await generateEmbedding(journalEntry);

      // Store journal entry with embedding
      const { error: journalError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          content: journalEntry,
          embedding,
          emotion_tags: emotionTags || [],
          created_at: new Date().toISOString(),
        });

      if (journalError) {
        console.error('Error storing journal entry:', journalError);
        return res.status(500).json({ error: 'Failed to store journal entry' });
      }
    }

    // Process drawn cards if provided
    if (drawnCards && drawnCards.length > 0) {
      // Get existing drawn cards
      const { data: existingCards, error: cardsError } = await supabase
        .from('user_cards')
        .select('card_name, count')
        .eq('user_id', userId);

      if (cardsError) {
        console.error('Error fetching user cards:', cardsError);
        return res.status(500).json({ error: 'Failed to fetch user cards' });
      }

      // Update card counts
      for (const card of drawnCards) {
        const existingCard = existingCards?.find(c => c.card_name === card);

        if (existingCard) {
          // Update existing card count
          const { error: updateError } = await supabase
            .from('user_cards')
            .update({
              count: existingCard.count + 1,
              last_drawn_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('card_name', card);

          if (updateError) {
            console.error(`Error updating card count for ${card}:`, updateError);
          }
        } else {
          // Insert new card
          const { error: insertError } = await supabase
            .from('user_cards')
            .insert({
              user_id: userId,
              card_name: card,
              count: 1,
              first_drawn_at: new Date().toISOString(),
              last_drawn_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error(`Error inserting new card ${card}:`, insertError);
          }
        }
      }

      // Update most drawn cards in profile
      const { data: topCards, error: topCardsError } = await supabase
        .from('user_cards')
        .select('card_name, count')
        .eq('user_id', userId)
        .order('count', { ascending: false })
        .limit(5);

      if (!topCardsError && topCards) {
        updates.most_drawn_cards = topCards.map(card => card.card_name);
      }
    }

    // Process zodiac placements if provided
    if (zodiacPlacements) {
      updates.zodiac_placements = zodiacPlacements;
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return res.status(500).json({ error: 'Failed to update user profile' });
    }

    // Return success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get personalized tarot interpretation
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getPersonalizedInterpretation(req: Request, res: Response) {
  try {
    const { userId, cardName, spread, position } = req.body;

    if (!userId || !cardName) {
      return res.status(400).json({ error: 'Missing required parameters: userId or cardName' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // Get user's recent journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('content, emotion_tags, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (journalError) {
      console.error('Error fetching journal entries:', journalError);
      return res.status(500).json({ error: 'Failed to fetch journal entries' });
    }

    // Get user's most drawn cards
    const { data: userCards, error: cardsError } = await supabase
      .from('user_cards')
      .select('card_name, count')
      .eq('user_id', userId)
      .order('count', { ascending: false })
      .limit(5);

    if (cardsError) {
      console.error('Error fetching user cards:', cardsError);
      return res.status(500).json({ error: 'Failed to fetch user cards' });
    }

    // Build user context for personalization
    const userContext = {
      zodiacPlacements: profile?.zodiac_placements || {},
      mostDrawnCards: userCards?.map(card => card.card_name) || [],
      recentJournalThemes: journalEntries?.flatMap(entry => entry.emotion_tags || []) || [],
      preferredThemes: profile?.preferred_themes || [],
    };

    // Generate personalized interpretation using OpenAI
    const prompt = `
You are a highly skilled tarot reader with deep knowledge of astrology and spiritual practices. 
You're creating a personalized tarot card interpretation for a specific user based on their unique profile.

Card: ${cardName}
${spread ? `Spread: ${spread}` : ''}
${position ? `Position in spread: ${position}` : ''}

User's spiritual profile:
- Zodiac placements: ${JSON.stringify(userContext.zodiacPlacements)}
- Most frequently drawn cards: ${userContext.mostDrawnCards.join(', ')}
- Recent emotional themes from journal: ${userContext.recentJournalThemes.join(', ')}
- Preferred spiritual themes: ${userContext.preferredThemes.join(', ')}

Based on this specific user's profile, provide a deeply personalized interpretation of the ${cardName} card 
${position ? `in the ${position} position of the ${spread} spread` : ''}.

Your interpretation should:
1. Connect to their astrological placements
2. Reference patterns from their most drawn cards
3. Address emotional themes from their journal
4. Align with their preferred spiritual focus
5. Provide specific, actionable guidance tailored to their unique situation

Make the interpretation feel uniquely crafted for this person, not generic. Use a warm, insightful tone.
Limit your response to 3-4 paragraphs.
`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const interpretation = completion.data.choices[0].text?.trim();

    // Return the personalized interpretation
    return res.status(200).json({ interpretation });
  } catch (error) {
    console.error('Error generating personalized interpretation:', error);
    return res.status(500).json({ error: 'Failed to generate personalized interpretation' });
  }
}

/**
 * Find similar journal entries
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function findSimilarEntries(req: Request, res: Response) {
  try {
    const { userId, text, limit = 5 } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ error: 'Missing required parameters: userId or text' });
    }

    // Generate embedding for the query text
    const queryEmbedding = await generateEmbedding(text);

    // Find similar journal entries using vector similarity
    const { data: similarEntries, error } = await supabase
      .rpc('match_journal_entries', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit,
        user_id: userId,
      });

    if (error) {
      console.error('Error finding similar journal entries:', error);
      return res.status(500).json({ error: 'Failed to find similar journal entries' });
    }

    // Return the similar entries
    return res.status(200).json({ entries: similarEntries });
  } catch (error) {
    console.error('Error finding similar journal entries:', error);
    return res.status(500).json({ error: 'Failed to find similar journal entries' });
  }
}

/**
 * Update user feedback
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function updateUserFeedback(req: Request, res: Response) {
  try {
    const { userId, interpretationId, feedback, spentTimeMs, scrollDepth } = req.body;

    if (!userId || !interpretationId) {
      return res.status(400).json({ error: 'Missing required parameters: userId or interpretationId' });
    }

    // Store feedback
    const { error } = await supabase
      .from('user_feedback')
      .insert({
        user_id: userId,
        interpretation_id: interpretationId,
        explicit_feedback: feedback,
        time_spent_ms: spentTimeMs,
        scroll_depth: scrollDepth,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error storing user feedback:', error);
      return res.status(500).json({ error: 'Failed to store user feedback' });
    }

    // Return success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get personalized journal prompts
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getPersonalizedPrompts(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // Get user's recent journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('content, emotion_tags, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (journalError) {
      console.error('Error fetching journal entries:', journalError);
      return res.status(500).json({ error: 'Failed to fetch journal entries' });
    }

    // Build user context for personalization
    const userContext = {
      zodiacPlacements: profile?.zodiac_placements || {},
      mostDrawnCards: profile?.most_drawn_cards || [],
      recentJournalThemes: journalEntries?.flatMap(entry => entry.emotion_tags || []) || [],
      preferredThemes: profile?.preferred_themes || [],
    };

    // Generate personalized prompts using OpenAI
    const prompt = `
You are a spiritual guide creating personalized journal prompts for a user based on their unique profile.

User's spiritual profile:
- Zodiac placements: ${JSON.stringify(userContext.zodiacPlacements)}
- Most frequently drawn cards: ${userContext.mostDrawnCards.join(', ')}
- Recent emotional themes from journal: ${userContext.recentJournalThemes.join(', ')}
- Preferred spiritual themes: ${userContext.preferredThemes.join(', ')}

Based on this specific user's profile, create 3 deeply personalized journal prompts that will help them
in their spiritual journey. Each prompt should be 1-2 sentences and should be specific, thought-provoking,
and tailored to their unique situation.

Format your response as a JSON array of strings, with each string being a prompt.
`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    let prompts = [];
    try {
      prompts = JSON.parse(completion.data.choices[0].text?.trim() || '[]');
    } catch (error) {
      console.error('Error parsing prompts:', error);
      // Fallback to splitting by newlines
      prompts = completion.data.choices[0].text?.trim().split('\n').filter(line => line.trim()) || [];
    }

    // Return the personalized prompts
    return res.status(200).json({ prompts });
  } catch (error) {
    console.error('Error generating personalized prompts:', error);
    return res.status(500).json({ error: 'Failed to generate personalized prompts' });
  }
}

/**
 * Get user spiritual profile
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getUserProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // Get user's most drawn cards
    const { data: userCards, error: cardsError } = await supabase
      .from('user_cards')
      .select('card_name, count')
      .eq('user_id', userId)
      .order('count', { ascending: false })
      .limit(10);

    if (cardsError) {
      console.error('Error fetching user cards:', cardsError);
      return res.status(500).json({ error: 'Failed to fetch user cards' });
    }

    // Get user's recent journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('content, emotion_tags, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (journalError) {
      console.error('Error fetching journal entries:', journalError);
      return res.status(500).json({ error: 'Failed to fetch journal entries' });
    }

    // Get user's feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('user_feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (feedbackError) {
      console.error('Error fetching user feedback:', feedbackError);
      return res.status(500).json({ error: 'Failed to fetch user feedback' });
    }

    // Build user spiritual profile
    const spiritualProfile = {
      zodiacPlacements: profile?.zodiac_placements || {},
      mostDrawnCards: userCards?.map(card => ({ name: card.card_name, count: card.count })) || [],
      recentJournalThemes: journalEntries?.flatMap(entry => entry.emotion_tags || []) || [],
      preferredThemes: profile?.preferred_themes || [],
      feedbackStats: {
        positiveCount: feedback?.filter(f => f.explicit_feedback === 'positive').length || 0,
        negativeCount: feedback?.filter(f => f.explicit_feedback === 'negative').length || 0,
        averageTimeSpent: feedback?.reduce((sum, f) => sum + (f.time_spent_ms || 0), 0) / (feedback?.length || 1),
      },
    };

    // Return the user spiritual profile
    return res.status(200).json(spiritualProfile);
  } catch (error) {
    console.error('Error fetching user spiritual profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
