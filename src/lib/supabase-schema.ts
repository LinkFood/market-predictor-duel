/**
 * Supabase Database Schema
 * This file documents the structure of the database tables in Supabase
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string;
          created_at: string;
          last_login?: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string;
        };
        Update: {
          email?: string;
          username?: string;
          avatar_url?: string;
          last_login?: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          ticker: string;
          stock_name: string;
          prediction_type: 'price' | 'trend';
          user_prediction: string;
          ai_prediction: string;
          confidence: number;
          timeframe: string;
          start_price: number;
          end_price?: number;
          status: 'pending' | 'completed';
          outcome?: 'user_win' | 'ai_win' | 'tie';
          points?: number;
          created_at: string;
          resolved_at?: string;
          ai_analysis?: any; // JSON data
        };
        Insert: {
          id?: string; // Generated UUID
          user_id: string;
          ticker: string;
          stock_name: string;
          prediction_type: 'price' | 'trend';
          user_prediction: string;
          ai_prediction: string;
          confidence: number;
          timeframe: string;
          start_price: number;
          end_price?: number;
          status: 'pending' | 'completed';
          outcome?: 'user_win' | 'ai_win' | 'tie';
          points?: number;
          ai_analysis?: any; // JSON data
        };
        Update: {
          end_price?: number;
          status?: 'pending' | 'completed';
          outcome?: 'user_win' | 'ai_win' | 'tie';
          points?: number;
          resolved_at?: string;
        };
      };
      brackets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          timeframe: string;
          size: number;
          status: string;
          ai_personality: string;
          user_entries: any[];
          ai_entries: any[];
          matches: any[];
          winner_id?: string;
          start_date: string;
          end_date: string;
          created_at: string;
          user_points: number;
          ai_points: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          timeframe: string;
          size: number;
          status: string;
          ai_personality: string;
          user_entries: any[];
          ai_entries: any[];
          matches: any[];
          winner_id?: string;
          start_date: string;
          end_date: string;
          created_at?: string;
          user_points?: number;
          ai_points?: number;
        };
        Update: {
          name?: string;
          status?: string;
          user_entries?: any[];
          ai_entries?: any[];
          matches?: any[];
          winner_id?: string;
          end_date?: string;
          user_points?: number;
          ai_points?: number;
        };
      };
      user_stats: {
        Row: {
          user_id: string;
          total_predictions: number;
          completed_predictions: number;
          pending_predictions: number;
          total_points: number;
          win_rate: number;
          win_streak: number;
          best_win_streak: number;
          ai_victories: number;
          user_victories: number;
          ties: number;
          last_updated: string;
        };
        Insert: {
          user_id: string;
          total_predictions?: number;
          completed_predictions?: number;
          pending_predictions?: number;
          total_points?: number;
          win_rate?: number;
          win_streak?: number;
          best_win_streak?: number;
          ai_victories?: number;
          user_victories?: number;
          ties?: number;
        };
        Update: {
          total_predictions?: number;
          completed_predictions?: number;
          pending_predictions?: number;
          total_points?: number;
          win_rate?: number;
          win_streak?: number;
          best_win_streak?: number;
          ai_victories?: number;
          user_victories?: number;
          ties?: number;
          last_updated?: string;
        };
      };
      global_stats: {
        Row: {
          id: number;
          total_predictions: number;
          ai_wins: number;
          human_wins: number;
          ties: number;
          stock_predictions: number;
          sector_predictions: number;
          market_predictions: number;
          last_updated: string;
        };
        Insert: {
          id?: number;
          total_predictions: number;
          ai_wins: number;
          human_wins: number;
          ties: number;
          stock_predictions: number;
          sector_predictions: number;
          market_predictions: number;
        };
        Update: {
          total_predictions?: number;
          ai_wins?: number;
          human_wins?: number;
          ties?: number;
          stock_predictions?: number;
          sector_predictions?: number;
          market_predictions?: number;
          last_updated?: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          started_at: string;
          expires_at?: string;
          payment_provider?: string;
          payment_id?: string;
          metadata?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: string;
          status?: string;
          started_at?: string;
          expires_at?: string;
          payment_provider?: string;
          payment_id?: string;
          metadata?: any;
        };
        Update: {
          plan?: string;
          status?: string;
          expires_at?: string;
          payment_provider?: string;
          payment_id?: string;
          metadata?: any;
        };
      };
      usage_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          resource_id?: string;
          plan: string;
          metadata?: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          resource_id?: string;
          plan: string;
          metadata?: any;
        };
        Update: {
          event_type?: string;
          resource_id?: string;
          plan?: string;
          metadata?: any;
        };
      };
      prediction_patterns: {
        Row: {
          id: string;
          pattern_name: string;
          ticker: string;
          description: string;
          confidence: number;
          factors: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pattern_name: string;
          ticker: string;
          description: string;
          confidence: number;
          factors: any[];
        };
        Update: {
          pattern_name?: string;
          description?: string;
          confidence?: number;
          factors?: any[];
          updated_at?: string;
        };
      };
    };
    Views: {
      leaderboard: {
        Row: {
          user_id: string;
          username: string;
          avatar_url?: string;
          total_points: number;
          win_rate: number;
          total_predictions: number;
          rank: number;
        };
      };
      user_usage_summary: {
        Row: {
          user_id: string;
          month: string;
          predictions_count: number;
          api_calls_count: number;
          ai_views_count: number;
          total_events: number;
        };
      };
    };
    Functions: {
      get_user_api_usage: {
        Args: {
          user_id_param: string;
          days_param?: number;
        };
        Returns: {
          day: string;
          api_calls: number;
          predictions: number;
        }[];
      };
    };
  };
}

// Type for Supabase client
export type SupabaseClient = any; // Replace with proper typing if needed

/**
 * SQL Schema Creation Scripts for Reference
 * 
 * These are the SQL commands that would be executed to create the schema in Supabase
 */

export const SQL_SCHEMA = `
-- Users table
-- Note: This is created automatically by Supabase Auth
-- We just add extra columns to it

-- Predictions table
CREATE TABLE public.predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    ticker TEXT NOT NULL,
    stock_name TEXT NOT NULL,
    prediction_type TEXT NOT NULL CHECK (prediction_type IN ('price', 'trend')),
    user_prediction TEXT NOT NULL,
    ai_prediction TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    timeframe TEXT NOT NULL,
    start_price NUMERIC(10, 2) NOT NULL,
    end_price NUMERIC(10, 2),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    outcome TEXT CHECK (outcome IN ('user_win', 'ai_win', 'tie')),
    points INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    ai_analysis JSONB
);

-- User stats table
CREATE TABLE public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    total_predictions INTEGER DEFAULT 0 NOT NULL,
    completed_predictions INTEGER DEFAULT 0 NOT NULL,
    pending_predictions INTEGER DEFAULT 0 NOT NULL,
    total_points INTEGER DEFAULT 0 NOT NULL,
    win_rate NUMERIC(5, 2) DEFAULT 0 NOT NULL,
    win_streak INTEGER DEFAULT 0 NOT NULL,
    best_win_streak INTEGER DEFAULT 0 NOT NULL,
    ai_victories INTEGER DEFAULT 0 NOT NULL,
    user_victories INTEGER DEFAULT 0 NOT NULL,
    ties INTEGER DEFAULT 0 NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Global stats table
CREATE TABLE public.global_stats (
    id SERIAL PRIMARY KEY,
    total_predictions INTEGER DEFAULT 0 NOT NULL,
    ai_wins INTEGER DEFAULT 0 NOT NULL,
    human_wins INTEGER DEFAULT 0 NOT NULL,
    ties INTEGER DEFAULT 0 NOT NULL,
    stock_predictions INTEGER DEFAULT 0 NOT NULL,
    sector_predictions INTEGER DEFAULT 0 NOT NULL,
    market_predictions INTEGER DEFAULT 0 NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Leaderboard view
CREATE VIEW public.leaderboard AS
SELECT 
    u.id as user_id,
    u.username,
    u.avatar_url,
    s.total_points,
    s.win_rate,
    s.total_predictions,
    RANK() OVER (ORDER BY s.total_points DESC) as rank
FROM 
    auth.users u
JOIN 
    public.user_stats s ON u.id = s.user_id
WHERE 
    s.total_predictions > 0
ORDER BY 
    rank;

-- Indexes
CREATE INDEX idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX idx_predictions_ticker ON public.predictions(ticker);
CREATE INDEX idx_predictions_status ON public.predictions(status);
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at);

-- Triggers for stats update
CREATE OR REPLACE FUNCTION update_stats_on_prediction_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user stats when a new prediction is created
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.user_stats (
            user_id, 
            total_predictions, 
            pending_predictions
        ) 
        VALUES (
            NEW.user_id, 
            1, 
            1
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET
            total_predictions = user_stats.total_predictions + 1,
            pending_predictions = user_stats.pending_predictions + 1,
            last_updated = now();
            
        -- Update global stats
        IF EXISTS (SELECT 1 FROM public.global_stats LIMIT 1) THEN
            UPDATE public.global_stats 
            SET 
                total_predictions = total_predictions + 1,
                last_updated = now(),
                stock_predictions = CASE WHEN NEW.ticker != 'SPY' AND NEW.ticker != 'QQQ' THEN stock_predictions + 1 ELSE stock_predictions END
            WHERE id = 1;
        ELSE
            INSERT INTO public.global_stats (
                total_predictions, 
                stock_predictions
            ) 
            VALUES (
                1, 
                CASE WHEN NEW.ticker != 'SPY' AND NEW.ticker != 'QQQ' THEN 1 ELSE 0 END
            );
        END IF;
    END IF;
    
    -- Update stats when a prediction is resolved
    IF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status = 'completed' THEN
        -- Update user stats
        UPDATE public.user_stats
        SET
            pending_predictions = pending_predictions - 1,
            completed_predictions = completed_predictions + 1,
            total_points = total_points + COALESCE(NEW.points, 0),
            user_victories = CASE WHEN NEW.outcome = 'user_win' THEN user_victories + 1 ELSE user_victories END,
            ai_victories = CASE WHEN NEW.outcome = 'ai_win' THEN ai_victories + 1 ELSE ai_victories END,
            ties = CASE WHEN NEW.outcome = 'tie' THEN ties + 1 ELSE ties END,
            win_rate = CASE 
                WHEN completed_predictions + 1 > 0 
                THEN ((user_victories + CASE WHEN NEW.outcome = 'user_win' THEN 1 ELSE 0 END)::numeric / (completed_predictions + 1)) * 100
                ELSE 0
            END,
            last_updated = now()
        WHERE user_id = NEW.user_id;
        
        -- Update global stats
        UPDATE public.global_stats
        SET
            ai_wins = CASE WHEN NEW.outcome = 'ai_win' THEN ai_wins + 1 ELSE ai_wins END,
            human_wins = CASE WHEN NEW.outcome = 'user_win' THEN human_wins + 1 ELSE human_wins END,
            ties = CASE WHEN NEW.outcome = 'tie' THEN ties + 1 ELSE ties END,
            last_updated = now()
        WHERE id = 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prediction_stats_trigger
AFTER INSERT OR UPDATE ON public.predictions
FOR EACH ROW
EXECUTE FUNCTION update_stats_on_prediction_change();
`;