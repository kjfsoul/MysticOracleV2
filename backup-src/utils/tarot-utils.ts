// client/src/utils/tarot-utils.ts
import { supabaseClient } from "./supabase-client";

export interface TarotCard {
  id: number;
  name: string;
  arcana: string;
  suit?: string;
  number?: number;
  meaningUpright: string;
  meaningReversed: string;
  description: string;
  element?: string;
  zodiacSign?: string;
  keywords: string[];
  // Add any other fields from your database
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

export const getTarotCardImagePath = (
  card: TarotCard,
  isReversed: boolean = false
): string => {
  // Format: /assets/cards/rider-waite/the-fool.jpg
  const cardName = card.name.toLowerCase().replace(/\s+/g, "-");
  return `/assets/cards/rider-waite/${cardName}.jpg`;
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
