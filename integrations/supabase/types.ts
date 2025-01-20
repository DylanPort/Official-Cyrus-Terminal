export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          edited_at: string | null
          gif_url: string | null
          id: string
          image_url: string | null
          is_edited: boolean | null
          is_pinned: boolean | null
          mentions: Json | null
          parent_id: string | null
          profile_id: string | null
          reactions: Json | null
          room_id: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          edited_at?: string | null
          gif_url?: string | null
          id?: string
          image_url?: string | null
          is_edited?: boolean | null
          is_pinned?: boolean | null
          mentions?: Json | null
          parent_id?: string | null
          profile_id?: string | null
          reactions?: Json | null
          room_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          edited_at?: string | null
          gif_url?: string | null
          id?: string
          image_url?: string | null
          is_edited?: boolean | null
          is_pinned?: boolean | null
          mentions?: Json | null
          parent_id?: string | null
          profile_id?: string | null
          reactions?: Json | null
          room_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_members: {
        Row: {
          created_at: string
          id: string
          profile_id: string | null
          role: Database["public"]["Enums"]["chat_role"]
          room_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id?: string | null
          role?: Database["public"]["Enums"]["chat_role"]
          room_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string | null
          role?: Database["public"]["Enums"]["chat_role"]
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          id: string
          listing_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "pre_bond_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      deposits: {
        Row: {
          amount: number
          created_at: string
          id: string
          listing_id: string
          profile_id: string
          status: string
          token_amount: number | null
          tokens_claimed: boolean | null
          transaction_signature: string | null
          transaction_status: string | null
          transaction_timestamp: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          listing_id: string
          profile_id: string
          status?: string
          token_amount?: number | null
          tokens_claimed?: boolean | null
          transaction_signature?: string | null
          transaction_status?: string | null
          transaction_timestamp?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          listing_id?: string
          profile_id?: string
          status?: string
          token_amount?: number | null
          tokens_claimed?: boolean | null
          transaction_signature?: string | null
          transaction_status?: string | null
          transaction_timestamp?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposits_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "pre_bond_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_votes: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          profile_id: string
          vote_type: Database["public"]["Enums"]["vote_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          profile_id: string
          vote_type?: Database["public"]["Enums"]["vote_type"]
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          profile_id?: string
          vote_type?: Database["public"]["Enums"]["vote_type"]
        }
        Relationships: [
          {
            foreignKeyName: "listing_votes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "pre_bond_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_bond_listings: {
        Row: {
          category: Database["public"]["Enums"]["project_category"]
          created_at: string
          description: string
          discord: string | null
          funding_amount: number | null
          funding_wallet_address: string | null
          id: string
          image_url: string | null
          instagram: string | null
          linkedin: string | null
          name: string
          other_links: string | null
          profile_id: string
          telegram: string | null
          ticker: string
          token_address: string | null
          token_launch_timestamp: string | null
          token_total_supply: number | null
          total_vault_amount: number | null
          twitch: string | null
          twitter: string | null
          updated_at: string
          vault_status: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["project_category"]
          created_at?: string
          description: string
          discord?: string | null
          funding_amount?: number | null
          funding_wallet_address?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          linkedin?: string | null
          name: string
          other_links?: string | null
          profile_id: string
          telegram?: string | null
          ticker: string
          token_address?: string | null
          token_launch_timestamp?: string | null
          token_total_supply?: number | null
          total_vault_amount?: number | null
          twitch?: string | null
          twitter?: string | null
          updated_at?: string
          vault_status?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["project_category"]
          created_at?: string
          description?: string
          discord?: string | null
          funding_amount?: number | null
          funding_wallet_address?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          linkedin?: string | null
          name?: string
          other_links?: string | null
          profile_id?: string
          telegram?: string | null
          ticker?: string
          token_address?: string | null
          token_launch_timestamp?: string | null
          token_total_supply?: number | null
          total_vault_amount?: number | null
          twitch?: string | null
          twitter?: string | null
          updated_at?: string
          vault_status?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pre_bond_listings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_bond_listings_profile_id_fkey1"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          updated_at: string
          username: string
          wallet_address: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          username: string
          wallet_address: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          username?: string
          wallet_address?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          platform: Database["public"]["Enums"]["social_media_type"]
          profile_id: string | null
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: Database["public"]["Enums"]["social_media_type"]
          profile_id?: string | null
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: Database["public"]["Enums"]["social_media_type"]
          profile_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_indicators: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string | null
          room_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          room_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_indicators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "typing_indicators_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_rankings: {
        Row: {
          created_at: string
          id: number
          rank: number
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: number
          rank: number
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: number
          rank?: number
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      chat_role: "creator" | "moderator" | "member"
      project_category:
        | "smart_contracts"
        | "web_apps"
        | "scripts"
        | "apis"
        | "memes"
      social_media_type: "x" | "telegram" | "github"
      vote_type: "up" | "down"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
