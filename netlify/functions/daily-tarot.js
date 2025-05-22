// netlify/functions/daily-tarot.js
import { createClient } from "@supabase/supabase-js";

export const handler = async (event, context) => {
  console.log("--- Function Invocation Start: daily-tarot ---");
  const startTime = Date.now();

  const headers = {
    "Access-Control-Allow-Origin": "*", // TODO: Restrict in production
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

  // --- Environment Variable Check ---
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log(`ENV CHECK: SUPABASE_URL available: ${!!supabaseUrl}`);
  console.log(
    `ENV CHECK: SUPABASE_SERVICE_ROLE_KEY available: ${!!supabaseKey}`
  );

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

  // --- Supabase Client Initialization ---
  let supabase;
  try {
    console.log(
      `INIT: Initializing Supabase client for URL: ${
        supabaseUrl ? supabaseUrl.substring(0, 15) + "..." : "N/A"
      }`
    );
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("INIT: Supabase client initialized successfully.");
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

  // --- Main Logic ---
  try {
    let userId = null;
    if (event.body) {
      try {
        const body = JSON.parse(event.body);
        userId = body.user_id;
        console.log(`PARAM: Parsed user_id from body: ${userId}`);
      } catch (parseError) {
        console.warn(
          "PARAM: Could not parse request body:",
          parseError.message
        );
      }
    }

    // --- Seed Generation ---
    const today = new Date();
    const dateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    let seed = userId ? `${dateString}-${userId}` : dateString;
    console.log(`SEED: Using seed for card selection: ${seed}`);

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    console.log(`SEED: Generated hash: ${hash}`);

    // --- Database Query ---
    // !! CONFIRM THIS TABLE NAME IS CORRECT IN YOUR SUPABASE PROJECT !!
    const targetTable = "tarot_card_interpretations";
    console.log(
      `DB QUERY: Attempting to fetch cards from table: ${targetTable}...`
    );
    const {
      data: cards,
      error: cardsError,
      status: queryStatus,
    } = await supabase.from(targetTable).select("*"); // Select all columns for now

    if (cardsError) {
      console.error(
        `DB QUERY ERROR: Supabase error fetching from ${targetTable}. Status: ${queryStatus}`,
        cardsError
      );
      throw new Error(
        `Database query error: ${cardsError.message} (Hint: Check table name '${targetTable}', RLS policies, and service key permissions)`
      );
    }
    console.log(
      `DB QUERY SUCCESS: Successfully fetched from ${targetTable}. Number of cards: ${
        cards ? cards.length : "null"
      }`
    );

    if (!cards || cards.length === 0) {
      console.error(`DB QUERY RESULT: No cards found in table ${targetTable}.`);
      throw new Error(
        `No cards found in table: ${targetTable}. Ensure the table has data.`
      );
    }

    // --- Card Selection & Reversal ---
    const index = Math.abs(hash) % cards.length;
    const cardData = cards[index];
    console.log(
      `SELECTION: Selected card index: ${index}, Card Name: ${
        cardData ? cardData.name : "N/A"
      }`
    );

    if (!cardData) {
      console.error(
        `SELECTION ERROR: Card data at index ${index} is null or undefined. Hash: ${hash}, Length: ${cards.length}`
      );
      throw new Error(
        `Failed to retrieve valid card data at calculated index ${index}.`
      );
    }

    const reversalValue = Math.abs((hash >> 4) % 100);
    const isReversed = reversalValue < 30;
    console.log(
      `SELECTION: Card reversal status: ${isReversed} (value: ${reversalValue})`
    );

    // --- Data Mapping ---
    // !! CONFIRM ALL cardData.COLUMN_NAME MATCH YOUR TABLE SCHEMA EXACTLY !!
    console.log("MAPPING: Mapping database fields to client format...");
    let card = {};
    try {
      card = {
        id: cardData.id, // Expects 'id' column (PK)
        card_id: cardData.card_id, // Expects 'card_id' (string identifier like '01-magician')
        name: cardData.name, // Expects 'name'
        arcana: cardData.arcana, // Expects 'arcana' ('major' or 'minor')
        suit: cardData.suit, // Expects 'suit' (null for Major)
        number: cardData.number, // Expects 'number' (null for Major courts)
        keywords: cardData.keywords || [], // Expects 'keywords' (text[] or jsonb)
        element: cardData.elemental_association, // Expects 'elemental_association'
        zodiacSign: cardData.astrological_association, // Expects 'astrological_association'
        description: cardData.general_meaning || "", // Expects 'general_meaning'
        meaningUpright: cardData.upright_meaning || "", // Expects 'upright_meaning'
        meaningReversed: cardData.reversed_meaning || "", // Expects 'reversed_meaning'
        symbols: cardData.symbols || [], // Expects 'symbols' (text[] or jsonb)
        colors: cardData.colors || [], // Expects 'colors' (text[] or jsonb)
        deckId: "rider-waite", // Default to Rider-Waite for daily cards
        // imagePath: getTarotCardImagePath(cardData) // Generate path server-side if needed
      };
      console.log("MAPPING: Data mapping complete.");
    } catch (mappingError) {
      console.error("MAPPING ERROR: Error during data mapping:", mappingError);
      console.error(
        "MAPPING ERROR: Failing cardData:",
        JSON.stringify(cardData)
      ); // Log the problematic data
      throw new Error(
        `Data mapping error: ${mappingError.message}. Check column names.`
      );
    }

    // --- Optional: Log Reading ---
    if (userId) {
      try {
        console.log(`LOGGING: Attempting to log reading for user: ${userId}`);
        // !! CONFIRM 'user_readings' table name and schema !!
        const { error: logError } = await supabase
          .from("user_readings")
          .insert({
            user_id: userId,
            card_id: card.id, // Use the primary key from the interpretations table
            is_reversed: isReversed,
            reading_type: "daily",
            created_at: new Date().toISOString(),
          });
        if (logError) throw logError;
        console.log("LOGGING: Reading logged successfully.");
      } catch (logError) {
        console.warn(
          "LOGGING WARNING: Failed to log user reading:",
          logError.message
        );
        // Non-fatal, continue
      }
    }

    // --- Success Response ---
    const duration = Date.now() - startTime;
    console.log(
      `--- Function execution successful. Duration: ${duration}ms. Returning card data. ---`
    );
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
    // --- Catch-All Error Handler ---
    const duration = Date.now() - startTime;
    console.error(
      `--- FATAL ERROR during function execution after ${duration}ms: ---`,
      error
    );
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
