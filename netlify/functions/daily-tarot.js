// netlify/functions/daily-tarot.js
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event, context) => {
  console.log("--- Function Invocation Start: daily-tarot ---");

  const headers = {
    "Access-Control-Allow-Origin": "*", // Be more specific in production if possible
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  // Log environment variable presence (mask key)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log(`SUPABASE_URL available: ${!!supabaseUrl}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY available: ${!!supabaseKey}`);

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "FATAL ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Server configuration error.",
        details: "Missing database credentials",
      }),
    };
  }

  // For initial testing, return a hardcoded response to verify the function works
  if (
    event.queryStringParameters &&
    event.queryStringParameters.test === "true"
  ) {
    console.log("Test mode activated - returning hardcoded response");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Test response successful",
        card: {
          id: "test-id",
          card_id: "test-card",
          name: "Test Card",
          arcana: "major",
          suit: null,
          number: 0,
          keywords: ["test", "debug"],
          element: null,
          zodiacSign: null,
          description: "This is a test card",
          meaningUpright: "Test upright meaning",
          meaningReversed: "Test reversed meaning",
        },
        isReversed: false,
        timestamp: new Date().toISOString(),
      }),
    };
  }

  let supabase;
  try {
    console.log(
      `Initializing Supabase client for URL: ${supabaseUrl.substring(0, 15)}...`
    );
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized successfully.");
  } catch (initError) {
    console.error("FATAL ERROR initializing Supabase client:", initError);
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
    let userId = null;
    if (event.body) {
      try {
        const body = JSON.parse(event.body);
        userId = body.user_id;
        console.log(`Parsed user_id from body: ${userId}`);
      } catch (parseError) {
        console.warn(
          "Warning: Could not parse request body:",
          parseError.message
        );
      }
    }

    const today = new Date();
    const dateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    let seed = userId ? `${dateString}-${userId}` : dateString;
    console.log(`Using seed for card selection: ${seed}`);

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    const targetTable = "tarot_card_interpretations"; // CONFIRM THIS IS CORRECT
    console.log(`Attempting to fetch cards from table: ${targetTable}...`);
    const { data: cards, error: cardsError } = await supabase
      .from(targetTable)
      .select("*");

    if (cardsError) {
      console.error(`Supabase error fetching from ${targetTable}:`, cardsError);
      throw new Error(
        `Database query error: ${cardsError.message} (Hint: Check table name and permissions)`
      );
    }
    console.log(
      `Successfully fetched from ${targetTable}. Number of cards: ${
        cards ? cards.length : "null"
      }`
    );

    if (!cards || cards.length === 0) {
      console.error(`No cards found in table ${targetTable}.`);
      throw new Error(`No cards found in table: ${targetTable}`);
    }

    const index = Math.abs(hash) % cards.length;
    const cardData = cards[index];
    console.log(
      `Selected card index: ${index}, Card Name: ${
        cardData ? cardData.name : "N/A"
      }`
    );

    if (!cardData) {
      console.error(`Card data at index ${index} is null or undefined.`);
      throw new Error(`Failed to retrieve card data at index ${index}.`);
    }

    const reversalValue = Math.abs((hash >> 4) % 100);
    const isReversed = reversalValue < 30;
    console.log(
      `Card reversal status: ${isReversed} (value: ${reversalValue})`
    );

    // Map data - **CRITICAL:** Verify these field names match your table schema EXACTLY
    console.log("Mapping database fields to client format...");
    console.log(
      "Available fields in cardData:",
      Object.keys(cardData).join(", ")
    );

    const card = {
      id: cardData.id, // Assumes 'id' column exists
      card_id: cardData.card_id, // Assumes 'card_id' column exists
      name: cardData.name, // Assumes 'name' column exists
      arcana: cardData.arcana, // Assumes 'arcana' column exists
      suit: cardData.suit, // Assumes 'suit' column exists (will be null for Major)
      number: cardData.number, // Assumes 'number' column exists
      keywords: cardData.keywords || [], // Assumes 'keywords' column exists (array)
      element: cardData.elemental_association, // Assumes 'elemental_association' exists
      zodiacSign: cardData.astrological_association, // Assumes 'astrological_association' exists
      description: cardData.general_meaning || "", // Assumes 'general_meaning' exists
      meaningUpright: cardData.upright_meaning || "", // Assumes 'upright_meaning' exists
      meaningReversed: cardData.reversed_meaning || "", // Assumes 'reversed_meaning' exists
      symbols: cardData.symbols || [], // Assumes 'symbols' column exists (array)
      colors: cardData.colors || [], // Assumes 'colors' column exists (array)
    };
    console.log("Data mapping complete.");

    if (userId) {
      try {
        console.log(`Attempting to log reading for user: ${userId}`);
        // TODO: Verify 'user_readings' table name and schema
        await supabase.from("user_readings").insert({
          user_id: userId,
          card_id: card.id, // Use the primary key from the interpretations table
          is_reversed: isReversed,
          reading_type: "daily",
          created_at: new Date().toISOString(),
        });
        console.log("Reading logged successfully.");
      } catch (logError) {
        console.warn("Failed to log user reading:", logError.message);
      }
    }

    console.log("--- Function execution successful. Returning card data. ---");
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
    console.error("--- FATAL ERROR during function execution: ---", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: `Function execution failed: ${error.message}`,
        // Only include stack in dev environments for security
        stack:
          process.env.NODE_ENV === "development"
            ? error.stack
            : "Stack trace hidden in production",
      }),
    };
  }
};
