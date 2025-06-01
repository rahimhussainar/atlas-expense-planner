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
      activity_votes: {
        Row: {
          activity_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
          vote: boolean | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          vote?: boolean | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          vote?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_votes_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "trip_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_debtors: {
        Row: {
          amount: number
          created_at: string | null
          expense_id: string
          id: string
          participant_id: string
          participant_name: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          expense_id: string
          id?: string
          participant_id: string
          participant_name: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          expense_id?: string
          id?: string
          participant_id?: string
          participant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_debtors_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "trip_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_payers: {
        Row: {
          amount: number
          created_at: string | null
          expense_id: string
          id: string
          participant_id: string
          participant_name: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          expense_id: string
          id?: string
          participant_id: string
          participant_name: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          expense_id?: string
          id?: string
          participant_id?: string
          participant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_payers_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "trip_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_activities: {
        Row: {
          business_address: string | null
          business_name: string | null
          business_rating: number | null
          business_total_ratings: number | null
          business_website: string | null
          category: string | null
          created_at: string | null
          created_by: string | null
          created_by_name: string | null
          description: string | null
          id: string
          image: string | null
          location: string | null
          price: number | null
          price_type: string | null
          status: string | null
          title: string
          total_price: number | null
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          business_rating?: number | null
          business_total_ratings?: number | null
          business_website?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location?: string | null
          price?: number | null
          price_type?: string | null
          status?: string | null
          title: string
          total_price?: number | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          business_rating?: number | null
          business_total_ratings?: number | null
          business_website?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_name?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location?: string | null
          price?: number | null
          price_type?: string | null
          status?: string | null
          title?: string
          total_price?: number | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_activities_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_expenses: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          created_by_name: string | null
          currency: string | null
          description: string | null
          expense_date: string
          id: string
          receipt_url: string | null
          title: string
          total_amount: number
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          created_by_name?: string | null
          currency?: string | null
          description?: string | null
          expense_date: string
          id?: string
          receipt_url?: string | null
          title: string
          total_amount: number
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          created_by_name?: string | null
          currency?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          receipt_url?: string | null
          title?: string
          total_amount?: number
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_participants: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          rsvp_status: string | null
          trip_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          rsvp_status?: string | null
          trip_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          rsvp_status?: string | null
          trip_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_participants_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          cover_image: string | null
          created_at: string | null
          created_by: string
          description: string | null
          destination: string | null
          end_date: string | null
          id: string
          start_date: string | null
          trip_title: string
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          destination?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          trip_title: string
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          destination?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          trip_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_expense_details: {
        Args: { expense_uuid: string }
        Returns: Json
      }
      is_trip_creator: {
        Args: { trip_id: string }
        Returns: boolean
      }
      is_trip_participant: {
        Args: { p_trip_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
