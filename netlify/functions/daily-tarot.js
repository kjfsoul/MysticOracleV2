// netlify/functions/daily-tarot.js
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event, context) => {
  console.log("Function invoked: daily-tarot");

  // CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  // Standardize environment variable access
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Critical check: Ensure variables are loaded
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
    );
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Server configuration error. Cannot connect to database.",
        details: "Missing environment variables",
      }),
    };
  }

  let supabase;
  try {
    console.log(
      "Initializing Supabase client with URL:",
      supabaseUrl.substring(0, 15) + "..."
    );
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (initError) {
    console.error("ERROR initializing Supabase client:", initError);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to initialize database connection.",
        details: initError.message,
      }),
    };
  }

  try {
    // Parse request body for user_id
    let userId = null;
    if (event.body) {
      try {
        const body = JSON.parse(event.body);
        userId = body.user_id;
      } catch (parseError) {
        console.warn(
          "Warning: Could not parse request body:",
          parseError.message
        );
        // Continue without user_id
      }
    }

    // Create deterministic seed based on date and optional user_id
    const today = new Date();
    const dateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    let seed = userId ? `${dateString}-${userId}` : dateString;
    console.log("Using seed for card selection:", seed);

    // Simple deterministic hashing function
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    // Fetch all cards
    console.log("Fetching cards from tarot_cards table...");
    const { data: cards, error: cardsError } = await supabase
      .from("tarot_cards")
      .select("*");

    if (cardsError) {
      console.error("Supabase error fetching cards:", cardsError);
      throw new Error(`Database error fetching cards: ${cardsError.message}`);
    }

    if (!cards || cards.length === 0) {
      console.error("No tarot cards found in database");
      throw new Error("No tarot cards found in database");
    }

    console.log(`Successfully fetched ${cards.length} cards`);

    // Deterministic card selection
    const index = Math.abs(hash) % cards.length;
    const card = cards[index];
    console.log(`Selected card: ${card.name} (index ${index})`);

    // Deterministic reversal (30% chance)
    const reversalValue = Math.abs((hash >> 4) % 100);
    const isReversed = reversalValue < 30;
    console.log(
      `Card is ${isReversed ? "reversed" : "upright"} (value: ${reversalValue})`
    );

    // Optional: Log reading history
    if (userId) {
      try {
        await supabase.from("user_readings").insert({
          user_id: userId,
          card_id: card.id,
          is_reversed: isReversed,
          reading_type: "daily",
          created_at: new Date().toISOString(),
        });
        console.log("Reading logged to user_readings table");
      } catch (logError) {
        console.warn("Failed to log user reading:", logError.message);
        // Non-fatal, continue returning the card
      }
    }

    // Return the card data as JSON
    console.log("Function completed successfully, returning card data");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        card,
        isReversed,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("ERROR in daily-tarot function execution:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: `Failed to get daily tarot card: ${error.message}`,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
    };
  }
};
