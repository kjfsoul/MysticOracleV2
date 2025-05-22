// client/src/utils/supabase-client.ts
import { createClient } from "@supabase/supabase-js";

// Use environment variables for client-side
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
} else {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Anon Key:", supabaseAnonKey);
}

export const supabaseClient = createClient(
  supabaseUrl as string,
  supabaseAnonKey as string
);
