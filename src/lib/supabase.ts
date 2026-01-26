import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          website: string | null
          phone: string | null
          is_verified: boolean
          is_private: boolean
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          phone?: string | null
          is_verified?: boolean
          is_private?: boolean
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          phone?: string | null
          is_verified?: boolean
          is_private?: boolean
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          caption: string | null
          image_url: string
          likes_count: number
          comments_count: number
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          caption?: string | null
          image_url: string
          likes_count?: number
          comments_count?: number
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          caption?: string | null
          image_url?: string
          likes_count?: number
          comments_count?: number
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_username_availability: {
        Args: {
          check_username: string
        }
        Returns: boolean
      }
      get_username_suggestions: {
        Args: {
          base_username: string
        }
        Returns: {
          suggested_username: string
        }[]
      }
    }
  }
}