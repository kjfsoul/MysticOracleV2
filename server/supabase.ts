import { createClient } from "@supabase/supabase-js";
import { log } from "./vite";

// Unified environment handling
const supabaseUrl =
  process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;

// Fallback mock implementation
class MockSupabase {
  from(table: string) {
    return {
      select: () => this,
      insert: () => this,
      update: () => this,
      delete: () => this,
      eq: () => this,
      order: () => this,
      limit: () => this,
      single: () => this,
      then: (resolve: any) =>
        Promise.resolve({ data: null, error: null }).then(resolve),
    };
  }
}

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    log("✅ Supabase client initialized successfully", "supabase");
  } catch (error) {
    log(`❌ Error initializing Supabase client: ${error}`, "supabase");
    supabase = new MockSupabase();
  }
} else {
  log(
    "⚠️ Supabase credentials not available, using mock implementation",
    "supabase"
  );
  supabase = new MockSupabase();
}

// Database helpers
export const userDB = {
  async createUser(userData: {
    email: string;
    username: string;
    birth_date?: string;
    subscription_level?: string;
  }) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async getUserById(userId: number) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  },
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },
  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },
  async updateSubscription(userId: number, level: string) {
    const { data, error } = await supabase
      .from("users")
      .update({ subscription_level: level })
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const tarotDB = {
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
      .from("tarot_readings")
      .insert([readingData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async getUserReadings(userId: number) {
    const { data, error } = await supabase
      .from("tarot_readings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getReadingById(readingId: number) {
    const { data, error } = await supabase
      .from("tarot_readings")
      .select("*")
      .eq("id", readingId)
      .single();
    if (error) throw error;
    return data;
  },
  async updateSavedStatus(readingId: number, isSaved: boolean) {
    const { data, error } = await supabase
      .from("tarot_readings")
      .update({ is_saved: isSaved })
      .eq("id", readingId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const astrologyDB = {
  async createChart(chartData: {
    user_id: number;
    chart_type: string;
    chart_data: any;
    interpretation?: string;
  }) {
    const { data, error } = await supabase
      .from("astrology_charts")
      .insert([chartData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async getUserCharts(userId: number) {
    const { data, error } = await supabase
      .from("astrology_charts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getChartById(chartId: number) {
    const { data, error } = await supabase
      .from("astrology_charts")
      .select("*")
      .eq("id", chartId)
      .single();
    if (error) throw error;
    return data;
  },
};

export const horoscopeDB = {
  async storeDailyHoroscope(horoscopeData: {
    sign: string;
    date: string;
    content: string;
    premium_content?: string;
  }) {
    const { data, error } = await supabase
      .from("daily_horoscopes")
      .insert([horoscopeData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async getTodayHoroscope(sign: string) {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("daily_horoscopes")
      .select("*")
      .eq("sign", sign)
      .eq("date", today)
      .single();
    if (!error) return data;
    if (error.code === "PGRST116") return null;
    throw error;
  },
};

export { supabase };
