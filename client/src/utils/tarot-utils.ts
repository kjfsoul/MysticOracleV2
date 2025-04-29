// Utility functions for Tarot features

import { getActiveDeck } from "@client/config/tarot-deck-config";

/**
 * Generates the correct image path for a given tarot card based on the active deck config.
 */
export function getTarotCardImagePath(card: TarotCard): string {
  if (!card) {
    console.warn(
      "getTarotCardImagePath called with null card, returning placeholder."
    );
    return "/images/tarot/placeholders/card-back.svg";
  }

  // Use pre-defined path if available (e.g., for custom decks)
  if (card.imagePath && card.imagePath.trim() !== "") {
    return card.imagePath;
  }

  const activeDeck = getActiveDeck();
  if (!activeDeck) {
    console.error("No active tarot deck found! Using default placeholder.");
    return "/images/tarot/placeholders/card-back.svg";
  }

  const arcana = card.arcana?.toLowerCase() || "unknown";
  const imageFormat = activeDeck.imageFormat || "jpg";
  let formattedId = card.id || "unknown-id";

  // Specific formatting for Rider-Waite Major Arcana IDs if needed
  if (activeDeck.id === "rider-waite" && arcana === "major") {
    const majorArcanaMap: Record<string, string> = {
      fool: "00-fool",
      magician: "01-magician",
      "high-priestess": "02-high-priestess",
      empress: "03-empress",
      emperor: "04-emperor",
      hierophant: "05-hierophant",
      lovers: "06-lovers",
      chariot: "07-chariot",
      strength: "08-strength",
      hermit: "09-hermit",
      "wheel-of-fortune": "10-wheel-of-fortune",
      justice: "11-justice",
      "hanged-man": "12-hanged-man",
      death: "13-death",
      temperance: "14-temperance",
      devil: "15-devil",
      tower: "16-tower",
      star: "17-star",
      moon: "18-moon",
      sun: "19-sun",
      judgement: "20-judgement",
      world: "21-world",
    };
    formattedId = majorArcanaMap[card.id] || card.id;
  }

  let path = "";
  if (activeDeck.cardPathTemplate) {
    path = activeDeck.cardPathTemplate
      .replace("{arcana}", arcana)
      .replace("{suit}", card.suit?.toLowerCase() || "none")
      .replace("{id}", formattedId);
  } else {
    // Fallback structure if template is missing
    const suitPath =
      arcana === "minor" && card.suit ? `/${card.suit.toLowerCase()}` : "";
    path = `/images/tarot/decks/${activeDeck.id}/${arcana}${suitPath}/${formattedId}.${imageFormat}`;
  }

  // console.log(`Generated path for ${card.name}: ${path}`);
  return path;
}

/**
 * Gets the path for the active deck's card back image.
 */
export function getCardBackPath(): string {
  const activeDeck = getActiveDeck();
  return (
    activeDeck?.cardBackImage || "/images/tarot/placeholders/card-back.svg"
  ); // Default fallback
}

/**
 * Handles image loading errors, setting a fallback placeholder.
 */
export function handleTarotImageError(
  card: TarotCard | null,
  failedPath: string,
  setFallbackImage: (path: string) => void
): void {
  const cardName = card?.name || "Unknown Card";
  console.warn(
    `Error loading image: ${failedPath} for card: ${cardName}. Using placeholder.`
  );

  let fallbackPath = "/images/tarot/placeholders/card-back.svg"; // Generic fallback

  if (card) {
    if (card.arcana === "major") {
      fallbackPath = "/images/tarot/placeholders/major-placeholder.svg";
    } else if (card.arcana === "minor" && card.suit) {
      fallbackPath = `/images/tarot/placeholders/${card.suit.toLowerCase()}-placeholder.svg`;
    }
  }

  setFallbackImage(fallbackPath);
}

// For Supabase client, we'll use a mock for now
// In a real implementation, you would use:
// import { createClient } from "@supabase/supabase-js";
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Mock Supabase client for development
export const supabaseClient = {
  from: (table: string) => ({
    insert: (data: any) => {
      console.log(`Mock insert into ${table}:`, data);
      return Promise.resolve({ error: null });
    },
  }),
};

// client/src/utils/tarot-utils.ts
export interface TarotCard {
  id: string;
  card_id: string;
  name: string;
  arcana: string;
  suit?: string;
  number?: number;
  keywords: string[];
  // Original field names
  element?: string | null;
  zodiacSign?: string | null;
  description?: string;
  meaningUpright?: string;
  meaningReversed?: string;
  // New field names from tarot_card_interpretations table
  elemental_association?: string | null;
  astrological_association?: string | null;
  general_meaning?: string;
  upright_meaning?: string;
  reversed_meaning?: string;
  symbols?: string[] | null;
  colors?: string[] | null;
  // For image handling
  imagePath?: string;
}

export interface DailyCardData {
  card: TarotCard;
  isReversed: boolean;
  timestamp: string;
}

export const fetchDailyCard = async (userId?: string): Promise<DailyCardData> => {
  try {
    // Use the Netlify function
    const response = await fetch("/.netlify/functions/daily-tarot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from daily-tarot function:", errorText);
      throw new Error(
        `Failed to fetch daily card: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily card:", error);
    throw error;
  }
};

// This function is used specifically for the daily card feature
// It's simpler than the more complex one above
export const getSimpleTarotCardImagePath = (card: TarotCard): string => {
  // Use card_id or generate slug for filename, stripping "-of-" for minor arcana filenames
  const rawId = card.card_id || card.name.toLowerCase().replace(/\s+/g, "-");
  const cardId = rawId.replace(/-of-/g, "-");
  // Determine if minor or major arcana based on suit presence
  const suit = card.suit ? card.suit.toLowerCase() : null;
  if (suit) {
    // Path for minor arcana
    return `/images/tarot/decks/rider-waite/minor/${suit}/${cardId}.jpg`;
  }
  // Path for major arcana (note: ensure cardId matches naming like "00-the-fool")
  return `/images/tarot/decks/rider-waite/major/${cardId}.jpg`;
};

export const saveFeedback = async (choice: string, userId?: string): Promise<void> => {
  if (!userId) {
    console.log("No user ID provided for feedback, storing in local storage");
    // Store in localStorage for anonymous users
    localStorage.setItem(
      "tarot_feedback",
      JSON.stringify({
        choice,
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  try {
    const { error } = await supabaseClient.from("user_feedback").insert({
      user_id: userId,
      feedback_type: "daily_card",
      choice,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw error;
  }
};
