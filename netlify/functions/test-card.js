// netlify/functions/test-card.js
export const handler = async (event, context) => {
  console.log("Test card function invoked");

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

  try {
    // Return a hardcoded response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        card: {
          id: "test-id",
          card_id: "ace-of-cups",
          name: "Ace of Cups",
          arcana: "minor",
          suit: "cups",
          number: 1,
          keywords: ["new beginnings", "emotional awakening", "love"],
          element: "water",
          zodiacSign: null,
          description:
            "The Ace of Cups represents the beginning of emotional experiences.",
          meaningUpright: "New emotional beginnings, intuition, love",
          meaningReversed: "Emotional blockages, repressed feelings",
        },
        isReversed: false,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("Error in test-card function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
