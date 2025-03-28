import { apiRequest } from "./api";
import { supabase } from "./supabaseClient";

export const getDailyTarot = async () => {
  try {
    const data = await apiRequest("/api/public/tarot-readings", {
      method: "POST",
      body: JSON.stringify({
        spread: "past-present-future",
        question: "",
      }),
    });

    return {
      card: data.cards[1],
      interpretation: data.interpretations[1],
    };
  } catch (error) {
    console.error("Error fetching tarot reading:", error);
    throw error;
  }
};

export const saveEclipseSignup = async (email: string, location: string) => {
  const { data, error } = await supabase.from("eclipse_signups").insert([
    {
      email,
      location,
      signup_date: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error saving signup:", error);
    throw error;
  }

  return data;
};
