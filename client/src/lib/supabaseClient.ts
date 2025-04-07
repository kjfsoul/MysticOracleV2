import { createClient } from "@supabase/supabase-js";

// Use hardcoded values directly to avoid any issues with environment variables
const supabaseUrl = 'https://pqfsbxcbsxuyfgqrxdob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZnNieGNic3h1eWZncXJ4ZG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzAxNzAsImV4cCI6MjA1NzkwNjE3MH0.1bjMIO2hzyCJS1ExpsB1JsCmkH8D2d2M_-Psz2DDJrQ';

// Log the values being used
console.log('Using Supabase URL:', supabaseUrl);
console.log('Supabase key exists:', !!supabaseAnonKey);

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log initialization (but not the keys)
console.log(`Supabase client initialized with URL: ${supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined'}`);
