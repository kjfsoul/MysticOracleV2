export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          email: string
          username: string
          password: string
          birth_date: string | null
          subscription_level: string
          profile_image: string | null
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          username: string
          password: string
          birth_date?: string | null
          subscription_level?: string
          profile_image?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          username?: string
          password?: string
          birth_date?: string | null
          subscription_level?: string
          profile_image?: string | null
          created_at?: string
        }
      }
      tarot_readings: {
        Row: {
          id: number
          user_id: number
          spread: string
          question: string | null
          cards: Json
          interpretation: string
          ai_insight: string | null
          created_at: string
          is_saved: boolean
        }
        Insert: {
          id?: number
          user_id: number
          spread: string
          question?: string | null
          cards: Json
          interpretation: string
          ai_insight?: string | null
          created_at?: string
          is_saved?: boolean
        }
        Update: {
          id?: number
          user_id?: number
          spread?: string
          question?: string | null
          cards?: Json
          interpretation?: string
          ai_insight?: string | null
          created_at?: string
          is_saved?: boolean
        }
      }
      astrology_charts: {
        Row: {
          id: number
          user_id: number
          chart_type: string
          chart_data: Json
          interpretation: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: number
          chart_type: string
          chart_data: Json
          interpretation?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          chart_type?: string
          chart_data?: Json
          interpretation?: string | null
          created_at?: string
        }
      }
      daily_horoscopes: {
        Row: {
          id: number
          sign: string
          date: string
          content: string
          premium_content: string | null
          created_at: string
        }
        Insert: {
          id?: number
          sign: string
          date: string
          content: string
          premium_content?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          sign?: string
          date?: string
          content?: string
          premium_content?: string | null
          created_at?: string
        }
      }
      compatibility_readings: {
        Row: {
          id: number
          user_id: number
          sign1: string
          sign2: string
          content: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: number
          sign1: string
          sign2: string
          content: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          sign1?: string
          sign2?: string
          content?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: number
          user_id: number
          stripe_customer_id: string
          stripe_subscription_id: string
          plan_id: string
          status: string
          current_period_end: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: number
          stripe_customer_id: string
          stripe_subscription_id: string
          plan_id: string
          status: string
          current_period_end: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          stripe_customer_id?: string
          stripe_subscription_id?: string
          plan_id?: string
          status?: string
          current_period_end?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}