// This file is used to test if environment variables are being loaded correctly
console.log('Environment variables test:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Export a dummy function to make TypeScript happy
export function testEnv() {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKeyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY
  };
}
