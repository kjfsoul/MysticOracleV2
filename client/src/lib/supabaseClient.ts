import { createClient } from "@supabase/supabase-js";

// Get environment variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Falling back to hardcoded values.');

  // Fallback to hardcoded values
  supabaseUrl = 'https://pqfsbxcbsxuyfgqrxdob.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZnNieGNic3h1eWZncXJ4ZG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzAxNzAsImV4cCI6MjA1NzkwNjE3MH0.1bjMIO2hzyCJS1ExpsB1JsCmkH8D2d2M_-Psz2DDJrQ';
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log initialization (but not the keys)
console.log(`Supabase client initialized with URL: ${supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined'}`);
