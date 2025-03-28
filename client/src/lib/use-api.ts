import { supabase } from "./supabaseClient";

export const getDailyTarot = async () => {
  try {
    const response = await fetch('/api/public/tarot-readings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spread: "past-present-future",
        question: ""
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tarot reading');
    }

    const data = await response.json();
    // Return only the "Present" card from the spread
    return {
      card: data.cards[1], // Middle card is Present
      interpretation: data.interpretations[1]
    };
  } catch (error) {
    console.error('Error fetching tarot reading:', error);
    throw error;
  }
};

export const saveEclipseSignup = async (email: string, location: string) => {
  const { data, error } = await supabase
    .from('eclipse_signups')
    .insert([
      { 
        email,
        location,
        signup_date: new Date().toISOString()
      }
    ]);

  if (error) {
    console.error('Error saving signup:', error);
    throw error;
  }

  return data;
};
