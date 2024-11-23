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
      links: {
        Row: {
          id: string
          created_at: string
          title: string
          url: string
          description: string | null
          user_id: string
          is_active: boolean
          order_index: number
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          url: string
          description?: string | null
          user_id: string
          is_active?: boolean
          order_index?: number
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          url?: string
          description?: string | null
          user_id?: string
          is_active?: boolean
          order_index?: number
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          background_color: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          background_color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          background_color?: string | null
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
  }
}
