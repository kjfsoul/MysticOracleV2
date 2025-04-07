// Debug environment variables
console.log('Debug environment variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
// Don't log the full key for security reasons
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('All env variables:', import.meta.env);
