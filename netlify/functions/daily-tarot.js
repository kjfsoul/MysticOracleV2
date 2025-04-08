// Example Netlify Function for Daily Tarot Card
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event, context) => {
  try {
    // Parse request body if it exists
    const body = event.body ? JSON.parse(event.body) : {};
    const { user_id } = body;

    // Get random tarot card from database
    const { data: card, error } = await supabase
      .from('tarot_cards')
      .select('*')
      .order('RANDOM()')
      .limit(1)
      .single();

    if (error) throw error;

    // If user_id is provided, save this reading to user history
    if (user_id) {
      await supabase.from('user_readings').insert({
        user_id,
        card_id: card.id,
        reading_type: 'daily',
        created_at: new Date().toISOString(),
      });
    }

    // Return the card data
    return {
      statusCode: 200,
      body: JSON.stringify({
        card,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error in daily-tarot function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get daily tarot card' }),
    };
  }
};
