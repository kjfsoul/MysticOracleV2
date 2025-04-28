import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize Supabase client - use proper server-side environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log environment variables (without exposing full keys)
console.log("SUPABASE_URL available:", !!supabaseUrl);
console.log("SUPABASE_SERVICE_ROLE_KEY available:", !!supabaseKey);
console.log("OPENAI_API_KEY available:", !!process.env.OPENAI_API_KEY);

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing required Supabase credentials in personalization.js");
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Get the path parameter
  const path = event.path.replace(/\/netlify\/functions\/personalization/g, '').replace(/^\//g, '');

  try {
    // Handle different API endpoints
    switch (path) {
      case 'update-profile':
        return await updateUserProfile(event, headers);
      case 'personalized-interpretation':
        return await getPersonalizedInterpretation(event, headers);
      case 'user-profile':
        return await getUserProfile(event, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Not found' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * Update user spiritual profile
 */
async function updateUserProfile(event, headers) {
  try {
    const { userId, journalEntry, drawnCards, zodiacPlacements } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing user ID' }),
      };
    }

    // Update profile data
    const updates = {
      updated_at: new Date().toISOString(),
    };

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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update user profile' }),
      };
    }

    // Return success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}

/**
 * Get personalized tarot interpretation
 */
async function getPersonalizedInterpretation(event, headers) {
  try {
    const { userId, cardName, spread, position } = JSON.parse(event.body);

    if (!userId || !cardName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters: userId or cardName' }),
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch user profile' }),
      };
    }

    // Generate personalized interpretation using OpenAI
    const prompt = `
You are a highly skilled tarot reader with deep knowledge of astrology and spiritual practices.
You're creating a personalized tarot card interpretation for a specific user.

Card: ${cardName}
${spread ? `Spread: ${spread}` : ""}
${position ? `Position in spread: ${position}` : ""}

Based on this specific user's profile, provide a deeply personalized interpretation of the ${cardName} card
${position ? `in the ${position} position of the ${spread} spread` : ""}.

Your interpretation should:
1. Provide specific, actionable guidance
2. Use a warm, insightful tone
3. Be uniquely crafted, not generic

Limit your response to 3-4 paragraphs.
`;

    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const interpretation = completion.choices[0].text?.trim();

    // Return the personalized interpretation
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ interpretation }),
    };
  } catch (error) {
    console.error('Error generating personalized interpretation:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate personalized interpretation' }),
    };
  }
}

/**
 * Get user spiritual profile
 */
async function getUserProfile(event, headers) {
  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing user ID' }),
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch user profile' }),
      };
    }

    // Build user spiritual profile
    const spiritualProfile = {
      zodiacPlacements: profile?.zodiac_placements || {},
      preferredThemes: profile?.preferred_themes || [],
    };

    // Return the user spiritual profile
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(spiritualProfile),
    };
  } catch (error) {
    console.error('Error fetching user spiritual profile:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
