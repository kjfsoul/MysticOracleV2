import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate a mock embedding vector
 * In production, this would call OpenAI's API
 */
function generateMockEmbedding(text) {
  // Simple hash function to generate a deterministic but seemingly random value
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  // Generate a mock embedding vector of 1536 dimensions (same as OpenAI's ada-002)
  const mockEmbedding = [];
  const seed = hashString(text);

  for (let i = 0; i < 1536; i++) {
    // Generate a deterministic but seemingly random value between -1 and 1
    const value = Math.sin(seed * i) / 2 + 0.5;
    mockEmbedding.push(value);
  }

  return mockEmbedding;
}

/**
 * Analyze text to extract emotions and tags
 */
function analyzeText(text) {
  const emotionKeywords = {
    joy: ["happy", "joy", "excited", "thrilled", "delighted", "pleased"],
    sadness: ["sad", "unhappy", "depressed", "down", "blue", "melancholy"],
    anger: ["angry", "mad", "furious", "irritated", "annoyed", "frustrated"],
    fear: ["afraid", "scared", "fearful", "anxious", "worried", "nervous"],
    surprise: ["surprised", "shocked", "amazed", "astonished", "stunned"],
    disgust: ["disgusted", "repulsed", "revolted", "nauseated"],
    trust: ["trust", "believe", "faith", "confident", "assured"],
    anticipation: ["anticipate", "expect", "looking forward", "hopeful"],
  };

  const spiritualTags = [
    "meditation",
    "mindfulness",
    "spiritual",
    "energy",
    "chakra",
    "aura",
    "universe",
    "cosmic",
    "divine",
    "sacred",
    "ritual",
    "practice",
    "intuition",
    "guidance",
    "vision",
    "dream",
    "manifestation",
    "intention",
    "gratitude",
    "blessing",
    "prayer",
    "healing",
    "transformation",
    "journey",
  ];

  const contentLower = text.toLowerCase();
  const emotions = [];
  const tags = [];

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
    const { text, userId, type } = JSON.parse(event.body);

    // Validate required parameters
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Text is required" }),
      };
    }

    // Generate embedding
    // In production, this would call OpenAI's API
    const embedding = generateMockEmbedding(text);

    // If this is a journal entry, analyze the text
    let analysis = null;
    if (type === "journal") {
      analysis = analyzeText(text);
    }

    // Return the embedding and analysis
    return {
      statusCode: 200,
      body: JSON.stringify({
        embedding,
        ...(analysis
          ? { emotions: analysis.emotions, tags: analysis.tags }
          : {}),
      }),
    };
  } catch (error) {
    console.error("Error generating embedding:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to generate embedding",
        details: error.message,
      }),
    };
  }
};
