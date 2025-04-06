const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    // Parse the request body
    const { embedding, userId, limit = 5 } = JSON.parse(event.body);
    
    // Validate required parameters
    if (!embedding || !userId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Embedding and userId are required" }) 
      };
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.id !== userId) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ error: "Unauthorized" }) 
      };
    }

    // Find similar entries using vector similarity search
    const { data, error } = await supabase.rpc('match_journal_entries', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
      p_user_id: userId
    });
    
    if (error) {
      throw error;
    }
    
    // Return the similar entries
    return {
      statusCode: 200,
      body: JSON.stringify({
        entries: data || []
      })
    };
  } catch (error) {
    console.error('Error finding similar entries:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to find similar entries",
        details: error.message 
      })
    };
  }
};
