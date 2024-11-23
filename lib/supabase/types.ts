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
          twitter_username: string | null
          instagram_username: string | null
          tiktok_username: string | null
          youtube_username: string | null
          snapchat_username: string | null
          whatsapp_number: string | null
          facebook_username: string | null
          linkedin_username: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          background_color?: string | null
          twitter_username?: string | null
          instagram_username?: string | null
          tiktok_username?: string | null
          youtube_username?: string | null
          snapchat_username?: string | null
          whatsapp_number?: string | null
          facebook_username?: string | null
          linkedin_username?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          background_color?: string | null
          twitter_username?: string | null
          instagram_username?: string | null
          tiktok_username?: string | null
          youtube_username?: string | null
          snapchat_username?: string | null
          whatsapp_number?: string | null
          facebook_username?: string | null
          linkedin_username?: string | null
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
