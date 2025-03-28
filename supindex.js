import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pqfsbxcbsxuyfgqrxdob.supabase.co"; // Replace with your Supabase project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZnNieGNic3h1eWZncXJ4ZG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzAxNzAsImV4cCI6MjA1NzkwNjE3MH0.1bjMIO2hzyCJS1ExpsB1JsCmkH8D2d2M_-Psz2DDJrQ"; // Replace with your Supabase anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase client initialized:", supabase);
