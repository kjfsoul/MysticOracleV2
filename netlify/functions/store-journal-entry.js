import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the request body
    const { title, content, emotions, tags, embedding, userId } = JSON.parse(
      event.body
    );

    // Validate required parameters
    if (!content || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Content and userId are required" }),
      };
    }

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    // Store the journal entry in Supabase
    const { data, error } = await supabase
      .from("journal_entries")
      .insert([
        {
          user_id: userId,
          title: title || "Untitled Entry",
          content,
          emotions: emotions || [],
          tags: tags || [],
          embedding,
          created_at: new Date(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    // Return the entry ID
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: data.id,
        message: "Journal entry stored successfully",
      }),
    };
  } catch (error) {
    console.error("Error storing journal entry:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to store journal entry",
        details: error.message,
      }),
    };
  }
};
