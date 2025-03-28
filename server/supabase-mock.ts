import { log } from './vite';

// A mock implementation for Supabase that won't require actual credentials
export class MockSupabase {
  from(table: string) {
    log(`[MOCK] Accessing table: ${table}`, 'supabase');
    return {
      select: () => this.chainableQuery(),
      insert: () => this.chainableQuery(),
      update: () => this.chainableQuery(),
      delete: () => this.chainableQuery(),
      eq: () => this.chainableQuery(),
      neq: () => this.chainableQuery(),
      gt: () => this.chainableQuery(),
      lt: () => this.chainableQuery(),
      gte: () => this.chainableQuery(),
      lte: () => this.chainableQuery(),
      order: () => this.chainableQuery(),
      limit: () => this.chainableQuery(),
      single: () => this.chainableQuery(),
      is: () => this.chainableQuery(),
    };
  }

  private chainableQuery() {
    return {
      select: () => this.chainableQuery(),
      insert: () => this.chainableQuery(),
      update: () => this.chainableQuery(),
      delete: () => this.chainableQuery(),
      eq: () => this.chainableQuery(),
      neq: () => this.chainableQuery(),
      gt: () => this.chainableQuery(),
      lt: () => this.chainableQuery(),
      gte: () => this.chainableQuery(),
      lte: () => this.chainableQuery(),
      order: () => this.chainableQuery(),
      limit: () => this.chainableQuery(),
      single: () => this.chainableQuery(),
      is: () => this.chainableQuery(),
      then: (callback: Function) => {
        return Promise.resolve(callback({ data: null, error: null }));
      }
    };
  }
}

export const supabaseClient = new MockSupabase();

// User operations
export const userDB = {
  async createUser(userData: any) {
    log(`[MOCK] Creating user: ${userData.username}`, 'supabase');
    return { id: 1, ...userData };
  },

  async getUserById(userId: number) {
    log(`[MOCK] Getting user with ID: ${userId}`, 'supabase');
    return null;
  },

  async getUserByEmail(email: string) {
    log(`[MOCK] Getting user with email: ${email}`, 'supabase');
    return null;
  },

  async getUserByUsername(username: string) {
    log(`[MOCK] Getting user with username: ${username}`, 'supabase');
    return null;
  },

  async updateSubscription(userId: number, level: string) {
    log(`[MOCK] Updating user ${userId} subscription to ${level}`, 'supabase');
    return { id: userId, subscription_level: level };
  }
};

// Tarot reading operations
export const tarotDB = {
  async createReading(readingData: any) {
    log(`[MOCK] Creating tarot reading`, 'supabase');
    return { id: 1, created_at: new Date().toISOString(), ...readingData };
  },

  async getUserReadings(userId: number) {
    log(`[MOCK] Getting tarot readings for user: ${userId}`, 'supabase');
    return [];
  },

  async getReadingById(readingId: number) {
    log(`[MOCK] Getting tarot reading with ID: ${readingId}`, 'supabase');
    return null;
  },

  async updateSavedStatus(readingId: number, isSaved: boolean) {
    log(`[MOCK] Updating saved status for reading ${readingId} to ${isSaved}`, 'supabase');
    return { id: readingId, is_saved: isSaved };
  }
};

// Astrology chart operations
export const astrologyDB = {
  async createChart(chartData: any) {
    log(`[MOCK] Creating astrology chart`, 'supabase');
    return { id: 1, created_at: new Date().toISOString(), ...chartData };
  },

  async getUserCharts(userId: number) {
    log(`[MOCK] Getting astrology charts for user: ${userId}`, 'supabase');
    return [];
  },

  async getChartById(chartId: number) {
    log(`[MOCK] Getting astrology chart with ID: ${chartId}`, 'supabase');
    return null;
  }
};

// Horoscope operations
export const horoscopeDB = {
  async storeDailyHoroscope(horoscopeData: any) {
    log(`[MOCK] Storing horoscope for ${horoscopeData.sign}`, 'supabase');
    return { id: 1, created_at: new Date().toISOString(), ...horoscopeData };
  },

  async getTodayHoroscope(sign: string) {
    log(`[MOCK] Getting today's horoscope for ${sign}`, 'supabase');
    return null;
  }
};