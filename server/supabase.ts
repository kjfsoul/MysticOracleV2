import { createClient } from '@supabase/supabase-js';
import { log } from './vite';

// Since we don't have actual Supabase credentials in this environment,
// we'll create a mock implementation for demonstration purposes

// Check if we have Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

// Our Supabase client (will be assigned below)

// Create a mock implementation for demonstration
class MockSupabase {
  async from(table: string) {
    return {
      select: () => this,
      insert: () => this,
      update: () => this,
      delete: () => this,
      eq: () => this,
      order: () => this,
      limit: () => this,
      single: () => this,
      then: () => Promise.resolve({ data: null, error: null })
    };
  }
}

// Only initialize Supabase if we have actual credentials
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    log('Supabase client initialized successfully', 'supabase');
  } catch (error) {
    log(`Error initializing Supabase client: ${error}`, 'supabase');
    supabase = new MockSupabase();
  }
} else {
  log('Supabase credentials not available, using mock implementation', 'supabase');
  supabase = new MockSupabase();
}

/**
 * Database helpers for user operations
 */
export const userDB = {
  // Create a new user
  async createUser(userData: {
    email: string;
    username: string;
    birth_date?: string;
    subscription_level?: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user by ID
  async getUserById(userId: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get user by email
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data || null;
  },

  // Get user by username
  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  // Update user subscription
  async updateSubscription(userId: number, level: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_level: level })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Database helpers for tarot readings
 */
export const tarotDB = {
  // Create a new tarot reading
  async createReading(readingData: {
    user_id: number;
    spread: string;
    question?: string;
    cards: any;
    interpretation: string;
    ai_insight?: string;
    is_saved?: boolean;
  }) {
    const { data, error } = await supabase
      .from('tarot_readings')
      .insert([readingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get readings for a user
  async getUserReadings(userId: number) {
    const { data, error } = await supabase
      .from('tarot_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a specific reading
  async getReadingById(readingId: number) {
    const { data, error } = await supabase
      .from('tarot_readings')
      .select('*')
      .eq('id', readingId)
      .single();

    if (error) throw error;
    return data;
  },

  // Save or unsave a reading
  async updateSavedStatus(readingId: number, isSaved: boolean) {
    const { data, error } = await supabase
      .from('tarot_readings')
      .update({ is_saved: isSaved })
      .eq('id', readingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Database helpers for astrology charts
 */
export const astrologyDB = {
  // Create a new astrology chart
  async createChart(chartData: {
    user_id: number;
    chart_type: string;
    chart_data: any;
    interpretation?: string;
  }) {
    const { data, error } = await supabase
      .from('astrology_charts')
      .insert([chartData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get charts for a user
  async getUserCharts(userId: number) {
    const { data, error } = await supabase
      .from('astrology_charts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a specific chart
  async getChartById(chartId: number) {
    const { data, error } = await supabase
      .from('astrology_charts')
      .select('*')
      .eq('id', chartId)
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Database helpers for horoscopes
 */
export const horoscopeDB = {
  // Store a daily horoscope
  async storeDailyHoroscope(horoscopeData: {
    sign: string;
    date: string;
    content: string;
    premium_content?: string;
  }) {
    const { data, error } = await supabase
      .from('daily_horoscopes')
      .insert([horoscopeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get today's horoscope for a sign
  async getTodayHoroscope(sign: string) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_horoscopes')
      .select('*')
      .eq('sign', sign)
      .eq('date', today)
      .single();

    // If no error, return data; if "no rows" error, return null; otherwise throw
    if (!error) return data;
    if (error.code === 'PGRST116') return null;
    throw error;
  }
};