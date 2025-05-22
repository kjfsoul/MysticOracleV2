declare module 'vite' {
  interface ImportMetaEnv {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_KEY: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SUPABASE_SERVICE_ROLE_KEY: string;
  }
}
