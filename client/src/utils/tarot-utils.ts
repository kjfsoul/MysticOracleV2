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

  // Normalize card data to handle various formats
  const arcana = card.arcana?.toLowerCase() || "major"; // Default to major if missing
  const imageFormat = activeDeck.imageFormat || "jpg";

  // Format the card ID properly
  let formattedId = "";

  // Handle major arcana cards
  if (arcana === "major") {
    // Map card names to standard IDs if needed
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

    // Try to get the formatted ID from various sources
    if (card.id && card.id.includes("-")) {
      // If ID is already formatted (e.g., "00-fool")
      formattedId = card.id;
    } else if (card.number !== undefined && card.name) {
      // If we have a number and name, format it
      const num = card.number.toString().padStart(2, "0");
      const name = card.name.toLowerCase().replace(/\s+/g, "-");
      formattedId = `${num}-${name}`;
    } else if (card.name) {
      // Try to map from name
      const simpleName = card.name.toLowerCase().replace(/\s+/g, "-");
      formattedId = majorArcanaMap[simpleName] || `00-${simpleName}`;
    } else {
      // Last resort
      formattedId = card.id || "unknown-card";
    }
  }
  // Handle minor arcana cards
  else if (arcana === "minor" && card.suit) {
    const suit = card.suit.toLowerCase();
    const value = card.name.split(" ")[0].toLowerCase();

    // Format minor arcana IDs (e.g., "ace-cups", "two-wands")
    if (card.id && card.id.includes("-")) {
      formattedId = card.id;
    } else {
      formattedId = `${value}-${suit}`;
    }
  }
  // Handle unknown cards
  else {
    formattedId = card.id || "unknown-card";
  }

  // Special handling for known problematic cards
  if (
    formattedId === "07-chariot" ||
    formattedId === "13-death" ||
    formattedId === "16-tower" ||
    formattedId === "chariot" ||
    formattedId === "death" ||
    formattedId === "tower"
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
  let path = "";
  if (arcana === "major") {
    path = `/images/tarot/decks/${activeDeck.id}/major/${formattedId}.${imageFormat}`;
  } else if (arcana === "minor" && card.suit) {
    const suit = card.suit.toLowerCase();
    path = `/images/tarot/decks/${activeDeck.id}/minor/${suit}/${formattedId}.${imageFormat}`;
  } else {
    // Fallback to card back
    console.warn(
      `Cannot determine proper path for card: ${JSON.stringify(card)}`
    );
    path =
      activeDeck.cardBackImage || `/images/tarot/placeholders/card-back.svg`;
  }

  console.log(
    `Generated image path for ${card.name || "unknown card"}: ${path}`
  );
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

export const fetchDailyCard = async (
  userId?: string
): Promise<DailyCardData> => {
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
  const cardId = rawId.replace(/-of-/g, "-"); // Remove "of" from IDs like "ace-of-cups" -> "ace-cups"
  const arcana = card.arcana?.toLowerCase() || "unknown";
  const suit = card.suit ? card.suit.toLowerCase() : null;
  const imageFormat = activeDeck.imageFormat || "jpg"; // Ensure imageFormat is defined

  // Rider-Waite specific logic
  if (activeDeck.id === "rider-waite") {
    if (arcana === "minor" && suit) {
      // Path: /images/tarot/decks/rider-waite/minor/suit/name-suit.jpg
      // cardId should be like "queen-wands"
      return `/images/tarot/decks/rider-waite/minor/${suit}/${cardId}.${imageFormat}`;
    }
    // For Major Arcana, the cardPathTemplate should work if cardId is correct (e.g. 00-fool)
    // The existing cardPathTemplate for rider-waite is /images/tarot/decks/rider-waite/{arcana}/{id}.jpg
    // which becomes /images/tarot/decks/rider-waite/major/{id}.jpg
    // This seems to align with the requirement: /images/tarot/decks/rider-waite/major/XXX-name.jpg
    // No specific change needed here for major arcana if cardId format is okay.
  }

  // Use the deck's cardPathTemplate if available (applies to non-Rider-Waite or Rider-Waite Major)
  if (activeDeck.cardPathTemplate) {
    return activeDeck.cardPathTemplate
      .replace("{arcana}", arcana)
      .replace("{suit}", suit || "none")
      .replace("{id}", cardId);
  }

  // Fallback to the standard path structure (for decks without cardPathTemplate)
  if (arcana === "major") {
    return `/images/tarot/decks/${activeDeck.id}/major/${cardId}.${imageFormat}`;
  } else if (arcana === "minor" && suit) {
    return `/images/tarot/decks/${activeDeck.id}/minor/${suit}/${cardId}.${imageFormat}`;
  } else {
    return (
      activeDeck.cardBackImage ||
      `/images/tarot/decks/${activeDeck.id}/card-back.${imageFormat}`
    );
  }
};

export const saveFeedback = async (
  choice: string,
  userId?: string
): Promise<void> => {
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

/**
 * Debug utility to check if a card image exists at the specified path
 */
export function checkCardImageExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
}

/**
 * Debug utility to log all possible paths for a card
 */
export async function debugCardImagePaths(card: TarotCard): Promise<void> {
  console.group(`Debug paths for card: ${card.name || card.id || "unknown"}`);

  const activeDeck = getActiveDeck();
  const arcana = card.arcana?.toLowerCase() || "major";
  const imageFormat = activeDeck.imageFormat || "jpg";

  // Try different ID formats
  const possibleIds = [
    card.id,
    card.name?.toLowerCase().replace(/\s+/g, "-"),
    card.number !== undefined
      ? `${card.number.toString().padStart(2, "0")}-${card.name
          ?.toLowerCase()
          .replace(/\s+/g, "-")}`
      : null,
  ].filter(Boolean);

  for (const id of possibleIds) {
    if (!id) continue;

    // For major arcana
    if (arcana === "major") {
      const majorPath = `/images/tarot/decks/${activeDeck.id}/major/${id}.${imageFormat}`;
      const exists = await checkCardImageExists(majorPath);
      console.log(`${majorPath}: ${exists ? "✅ EXISTS" : "❌ NOT FOUND"}`);

      // Try without the number prefix
      if (id.includes("-")) {
        const nameOnly = id.split("-").slice(1).join("-");
        const nameOnlyPath = `/images/tarot/decks/${activeDeck.id}/major/${nameOnly}.${imageFormat}`;
        const nameOnlyExists = await checkCardImageExists(nameOnlyPath);
        console.log(
          `${nameOnlyPath}: ${nameOnlyExists ? "✅ EXISTS" : "❌ NOT FOUND"}`
        );
      }

      // Try at root level (no major directory)
      const rootPath = `/images/tarot/decks/${activeDeck.id}/${id}.${imageFormat}`;
      const rootExists = await checkCardImageExists(rootPath);
      console.log(`${rootPath}: ${rootExists ? "✅ EXISTS" : "❌ NOT FOUND"}`);
    }
    // For minor arcana
    else if (arcana === "minor" && card.suit) {
      const suit = card.suit.toLowerCase();
      const minorPath = `/images/tarot/decks/${activeDeck.id}/minor/${suit}/${id}.${imageFormat}`;
      const exists = await checkCardImageExists(minorPath);
      console.log(`${minorPath}: ${exists ? "✅ EXISTS" : "❌ NOT FOUND"}`);
    }
  }

  // Try template path if available
  if (activeDeck.cardPathTemplate) {
    const templatePath = activeDeck.cardPathTemplate
      .replace("{arcana}", arcana)
      .replace("{suit}", card.suit?.toLowerCase() || "none")
      .replace("{id}", card.id || "unknown");
    const templateExists = await checkCardImageExists(templatePath);
    console.log(
      `Template path ${templatePath}: ${
        templateExists ? "✅ EXISTS" : "❌ NOT FOUND"
      }`
    );
  }

  console.groupEnd();
}

/**
 * Utility to verify the actual file structure of the Rider-Waite deck
 * This should be called once during development to determine the correct paths
 */
export async function verifyRiderWaiteDeckStructure(): Promise<void> {
  console.group("Verifying Rider-Waite deck structure");

  // Check major arcana structure
  const majorFormats = ["jpg", "png", "svg", "webp"];
  const majorPaths = [
    "/images/tarot/decks/rider-waite/major/00-fool.{format}",
    "/images/tarot/decks/rider-waite/major/fool.{format}",
    "/images/tarot/decks/rider-waite/fool.{format}",
  ];

  for (const path of majorPaths) {
    for (const format of majorFormats) {
      const fullPath = path.replace("{format}", format);
      const exists = await checkCardImageExists(fullPath);
      console.log(`${fullPath}: ${exists ? "✅ EXISTS" : "❌ NOT FOUND"}`);

      if (exists) {
        console.log("✅ FOUND CORRECT PATH STRUCTURE FOR MAJOR ARCANA!");
        console.log(
          `Pattern: ${path
            .replace("{format}", format)
            .replace("fool", "{name}")}`
        );
      }
    }
  }

  // Check minor arcana structure
  const minorFormats = ["jpg", "png", "svg", "webp"];
  const minorPaths = [
    "/images/tarot/decks/rider-waite/minor/cups/ace-cups.{format}",
    "/images/tarot/decks/rider-waite/minor/cups/ace-of-cups.{format}",
    "/images/tarot/decks/rider-waite/cups/ace-cups.{format}",
    "/images/tarot/decks/rider-waite/cups/ace-of-cups.{format}",
  ];

  for (const path of minorPaths) {
    for (const format of minorFormats) {
      const fullPath = path.replace("{format}", format);
      const exists = await checkCardImageExists(fullPath);
      console.log(`${fullPath}: ${exists ? "✅ EXISTS" : "❌ NOT FOUND"}`);

      if (exists) {
        console.log("✅ FOUND CORRECT PATH STRUCTURE FOR MINOR ARCANA!");
        console.log(
          `Pattern: ${path
            .replace("{format}", format)
            .replace("ace", "{value}")
            .replace("cups", "{suit}")}`
        );
      }
    }
  }

  console.groupEnd();
}
