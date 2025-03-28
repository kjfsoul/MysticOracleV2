import { users, tarotReadings, astrologyCharts, type User, type InsertUser, type TarotReading, type InsertTarotReading, type AstrologyChart, type InsertAstrologyChart } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User-related operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tarot reading operations
  createTarotReading(reading: InsertTarotReading): Promise<TarotReading>;
  getTarotReadings(userId: number): Promise<TarotReading[]>;
  getTarotReading(id: number): Promise<TarotReading | undefined>;
  saveTarotReading(id: number, isSaved: boolean): Promise<TarotReading | undefined>;

  // Astrology chart operations (for future implementation)
  createAstrologyChart(chart: InsertAstrologyChart): Promise<AstrologyChart>;
  getAstrologyCharts(userId: number): Promise<AstrologyChart[]>;
  getAstrologyChart(id: number): Promise<AstrologyChart | undefined>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tarotReadings: Map<number, TarotReading>;
  private astrologyCharts: Map<number, AstrologyChart>;
  sessionStore: session.Store;
  userIdCounter: number;
  readingIdCounter: number;
  chartIdCounter: number;

  constructor() {
    this.users = new Map();
    this.tarotReadings = new Map();
    this.astrologyCharts = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
    this.userIdCounter = 1;
    this.readingIdCounter = 1;
    this.chartIdCounter = 1;
  }

  // User-related methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      subscriptionLevel: "free", 
      createdAt: now, 
      profileImage: undefined 
    };
    this.users.set(id, user);
    return user;
  }

  // Tarot reading methods
  async createTarotReading(insertReading: InsertTarotReading): Promise<TarotReading> {
    const id = this.readingIdCounter++;
    const now = new Date();
    const reading: TarotReading = {
      ...insertReading,
      id,
      createdAt: now
    };
    this.tarotReadings.set(id, reading);
    return reading;
  }

  async getTarotReadings(userId: number): Promise<TarotReading[]> {
    return Array.from(this.tarotReadings.values())
      .filter(reading => reading.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getTarotReading(id: number): Promise<TarotReading | undefined> {
    return this.tarotReadings.get(id);
  }

  async saveTarotReading(id: number, isSaved: boolean): Promise<TarotReading | undefined> {
    const reading = this.tarotReadings.get(id);
    if (!reading) return undefined;
    
    const updatedReading = { ...reading, isSaved };
    this.tarotReadings.set(id, updatedReading);
    return updatedReading;
  }

  // Astrology chart methods
  async createAstrologyChart(insertChart: InsertAstrologyChart): Promise<AstrologyChart> {
    const id = this.chartIdCounter++;
    const now = new Date();
    const chart: AstrologyChart = {
      ...insertChart,
      id,
      createdAt: now
    };
    this.astrologyCharts.set(id, chart);
    return chart;
  }

  async getAstrologyCharts(userId: number): Promise<AstrologyChart[]> {
    return Array.from(this.astrologyCharts.values())
      .filter(chart => chart.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getAstrologyChart(id: number): Promise<AstrologyChart | undefined> {
    return this.astrologyCharts.get(id);
  }
}

export const storage = new MemStorage();
