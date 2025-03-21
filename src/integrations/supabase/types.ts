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
      predictions: {
        Row: {
          actual_result: string | null
          ai_analysis: Json | null
          ai_confidence: number | null
          ai_prediction: string
          created_at: string | null
          final_value: number | null
          id: string
          outcome: string | null
          percent_change: number | null
          points: number | null
          prediction_type: string
          resolved_at: string | null
          resolves_at: string
          starting_value: number
          status: string
          target_name: string
          target_type: string
          ticker: string
          timeframe: string
          user_id: string
          user_prediction: string
        }
        Insert: {
          actual_result?: string | null
          ai_analysis?: Json | null
          ai_confidence?: number | null
          ai_prediction: string
          created_at?: string | null
          final_value?: number | null
          id?: string
          outcome?: string | null
          percent_change?: number | null
          points?: number | null
          prediction_type: string
          resolved_at?: string | null
          resolves_at: string
          starting_value: number
          status: string
          target_name: string
          target_type: string
          ticker: string
          timeframe: string
          user_id: string
          user_prediction: string
        }
        Update: {
          actual_result?: string | null
          ai_analysis?: Json | null
          ai_confidence?: number | null
          ai_prediction?: string
          created_at?: string | null
          final_value?: number | null
          id?: string
          outcome?: string | null
          percent_change?: number | null
          points?: number | null
          prediction_type?: string
          resolved_at?: string | null
          resolves_at?: string
          starting_value?: number
          status?: string
          target_name?: string
          target_type?: string
          ticker?: string
          timeframe?: string
          user_id?: string
          user_prediction?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          best_streak: number | null
          correct_predictions: number | null
          current_streak: number | null
          losses_against_ai: number | null
          ties: number | null
          total_points: number | null
          total_predictions: number | null
          updated_at: string | null
          user_id: string
          wins_against_ai: number | null
        }
        Insert: {
          best_streak?: number | null
          correct_predictions?: number | null
          current_streak?: number | null
          losses_against_ai?: number | null
          ties?: number | null
          total_points?: number | null
          total_predictions?: number | null
          updated_at?: string | null
          user_id: string
          wins_against_ai?: number | null
        }
        Update: {
          best_streak?: number | null
          correct_predictions?: number | null
          current_streak?: number | null
          losses_against_ai?: number | null
          ties?: number | null
          total_points?: number | null
          total_predictions?: number | null
          updated_at?: string | null
          user_id?: string
          wins_against_ai?: number | null
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
      [_ in never]: never
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
