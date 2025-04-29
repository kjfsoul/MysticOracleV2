// client/src/utils/supabase-client.ts
import { createClient } from "@supabase/supabase-js";

// Use environment variables for client-side
const supabase_Url = import.meta.env.VITE_SUPABASE_URL;
const supabase_Anon_Key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabase_Url || !supabase_Anon_Key) {
  console.error("Missing Supabase environment variables");
} else {
  console.log("Supabase URL:", supabase_Url);
  console.log("Supabase Anon Key:", supabase_Anon_Key);
}

export const supabaseClient = createClient(
  supabase_Url as string,
  supabase_Anon_Key as string
);
