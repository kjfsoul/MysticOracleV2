import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase credentials
// Client-side should always use VITE_ prefixed variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the values being used (without exposing full keys)
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase anon key available:', !!supabaseAnonKey);

// Validate credentials exist
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log initialization success
console.log('Supabase client initialized successfully');
