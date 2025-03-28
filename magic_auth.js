// magic-auth.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pqfsbxcbsxuyfgqrxdob.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZnNieGNic3h1eWZncXJ4ZG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzAxNzAsImV4cCI6MjA1NzkwNjE3MH0.1bjMIO2hzyCJS1ExpsB1JsCmkH8D2d2M_-Psz2DDJrQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sends a magic link to the user's email
export const signInWithMagicLink = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    console.error("Error sending magic link:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Magic link sent! Check your inbox." };
};
