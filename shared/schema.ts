import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  birthDate: timestamp("birth_date"),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location"),
  subscriptionLevel: text("subscription_level").default("free"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow()
});

// Tarot Readings table
export const tarotReadings = pgTable("tarot_readings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  spread: text("spread").notNull(),
  question: text("question"),
  cards: json("cards").notNull(),
  interpretation: text("interpretation").notNull(),
  aiInsight: text("ai_insight"),
  createdAt: timestamp("created_at").defaultNow(),
  isSaved: boolean("is_saved").default(false)
});

// Astrology Charts table (for future implementation)
export const astrologyCharts = pgTable("astrology_charts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  chartType: text("chart_type").notNull(),
  chartData: json("chart_data").notNull(),
  interpretation: text("interpretation"),
  createdAt: timestamp("created_at").defaultNow()
});

// Schema validation for user insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  birthDate: true,
  birthTime: true,
  birthLocation: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters long")
});

// Schema validation for tarot reading insertion
export const insertTarotReadingSchema = createInsertSchema(tarotReadings).pick({
  userId: true,
  spread: true, 
  question: true,
  cards: true,
  interpretation: true,
  aiInsight: true,
  isSaved: true
});

// Schema validation for astrology chart insertion
export const insertAstrologyChartSchema = createInsertSchema(astrologyCharts).pick({
  userId: true,
  chartType: true,
  chartData: true,
  interpretation: true
});

// Types for use across the application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TarotReading = typeof tarotReadings.$inferSelect;
export type InsertTarotReading = z.infer<typeof insertTarotReadingSchema>;

export type AstrologyChart = typeof astrologyCharts.$inferSelect;
export type InsertAstrologyChart = z.infer<typeof insertAstrologyChartSchema>;
