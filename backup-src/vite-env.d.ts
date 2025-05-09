// src/vite-env.d.ts
declare module "*?env" {
  const env: {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    // Add other environment variables here
  };
  export default env;
}
