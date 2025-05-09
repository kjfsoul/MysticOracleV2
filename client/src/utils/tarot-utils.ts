// Utility functions for Tarot features

import { getActiveDeck } from "@client/config/tarot-deck-config";

/**
 * Gets the path for a tarot card image based on the active deck configuration.
 * This is the main function for getting card image paths throughout the app.
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

  // Special handling for known problematic cards
  if (
    formattedId === "07-chariot" ||
    formattedId === "13-death" ||
    formattedId === "16-tower"
  ) {
    console.warn(
      `Using placeholder for known problematic card: ${formattedId}`
    );
    return "/images/tarot/placeholders/major-placeholder.svg";
  }

  // Use the deck's cardPathTemplate if available
  if (activeDeck.cardPathTemplate) {
    return activeDeck.cardPathTemplate
      .replace("{arcana}", arcana)
      .replace("{suit}", card.suit?.toLowerCase() || "none")
      .replace("{id}", formattedId);
  }

  // Fallback to the standard path structure
  const suitPath =
    arcana === "minor" && card.suit ? `/${card.suit.toLowerCase()}` : "";
  const path = `/images/tarot/decks/${activeDeck.id}/${arcana}${suitPath}/${formattedId}.${imageFormat}`;

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
  console.warn(`Image failed to load: ${failedPath}`);

  let fallbackPath = "/images/tarot/placeholders/card-back.svg"; // Generic fallback

  if (card) {
    if (card.arcana === "major") {
      fallbackPath = "/images/tarot/placeholders/major-placeholder.svg";
    } else if (card.arcana === "minor" && card.suit) {
      fallbackPath = `/images/tarot/placeholders/${card.suit.toLowerCase()}-placeholder.svg`;
    }
  }

  console.log(`Using fallback image: ${fallbackPath}`);
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

/**
 * Simplified version of getTarotCardImagePath specifically for the daily card feature.
 * Uses the same logic but with simpler card ID formatting.
 */
export const getSimpleTarotCardImagePath = (card: TarotCard): string => {
  if (!card) {
    console.warn(
      "getSimpleTarotCardImagePath called with null card, returning placeholder."
    );
    return "/images/tarot/placeholders/card-back.svg";
  }

  // Special handling for known problematic cards
  if (
    card.id === "07-chariot" ||
    card.id === "13-death" ||
    card.id === "16-tower"
  ) {
    console.warn(`Using placeholder for known problematic card: ${card.id}`);
    return "/images/tarot/placeholders/major-placeholder.svg";
  }

  const activeDeck = getActiveDeck();
  const rawId =
    card.card_id || card.id || card.name.toLowerCase().replace(/\s+/g, "-");
  const cardId = rawId.replace(/-of-/g, "-");
  const arcana = card.arcana?.toLowerCase() || "unknown";
  const suit = card.suit ? card.suit.toLowerCase() : null;

  // Use the deck's cardPathTemplate if available
  if (activeDeck.cardPathTemplate) {
    return activeDeck.cardPathTemplate
      .replace("{arcana}", arcana)
      .replace("{suit}", suit || "none")
      .replace("{id}", cardId);
  }

  // Fallback to the standard path structure
  if (arcana === "major") {
    return `/images/tarot/decks/${activeDeck.id}/major/${cardId}.${
      activeDeck.imageFormat || "jpg"
    }`;
  } else if (arcana === "minor" && suit) {
    return `/images/tarot/decks/${activeDeck.id}/minor/${suit}/${cardId}.${
      activeDeck.imageFormat || "jpg"
    }`;
  } else {
    return (
      activeDeck.cardBackImage ||
      `/images/tarot/decks/${activeDeck.id}/card-back.${
        activeDeck.imageFormat || "jpg"
      }`
    );
  }
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
