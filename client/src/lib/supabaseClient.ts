import { createClient } from "@supabase/supabase-js";

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWt0c3Bub3ZqeWJlcmZpbHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg2MDM2NzcsImV4cCI6MjAxNDE3OTY3N30.EXAMPLE_KEY';

// Log a warning instead of throwing an error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase URL and Anon Key not found in environment variables. Using fallback values for development. Authentication features will not work properly."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
