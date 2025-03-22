-- Create prediction_patterns table to store learning system data
CREATE TABLE IF NOT EXISTS public.prediction_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_key TEXT NOT NULL UNIQUE,
  timeframe TEXT NOT NULL,
  target_type TEXT NOT NULL,
  prediction_type TEXT NOT NULL,
  ai_accuracy NUMERIC(5, 4) NOT NULL,
  user_accuracy NUMERIC(5, 4) NOT NULL,
  confidence_adjustment NUMERIC(5, 2) NOT NULL,
  sample_size INTEGER NOT NULL,
  market_condition TEXT,
  sector TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add indices for faster querying
CREATE INDEX IF NOT EXISTS idx_prediction_patterns_group_key ON public.prediction_patterns(group_key);
CREATE INDEX IF NOT EXISTS idx_prediction_patterns_timeframe ON public.prediction_patterns(timeframe);
CREATE INDEX IF NOT EXISTS idx_prediction_patterns_target_type ON public.prediction_patterns(target_type);
CREATE INDEX IF NOT EXISTS idx_prediction_patterns_prediction_type ON public.prediction_patterns(prediction_type);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_prediction_patterns_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prediction_patterns_timestamp
BEFORE UPDATE ON public.prediction_patterns
FOR EACH ROW
EXECUTE FUNCTION update_prediction_patterns_timestamp();

-- Add permissions for authenticated users
ALTER TABLE public.prediction_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do anything" ON public.prediction_patterns
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Everyone can read prediction patterns" ON public.prediction_patterns
  FOR SELECT USING (true);

-- Add a function to run the analysis periodically
-- This could be called by a cron job or scheduled function
CREATE OR REPLACE FUNCTION analyze_recent_predictions() 
RETURNS VOID AS $$
DECLARE
  prediction RECORD;
  group_patterns JSONB := '{}'::JSONB;
  pattern_key TEXT;
BEGIN
  -- Process all completed predictions from the last day
  FOR prediction IN (
    SELECT * FROM public.predictions 
    WHERE status = 'completed' 
    AND resolved_at > now() - INTERVAL '1 day'
  )
  LOOP
    -- Create a key for grouping
    pattern_key := prediction.timeframe || '_' || prediction.target_type || '_' || prediction.prediction_type;
    
    -- Initialize group if it doesn't exist
    IF NOT group_patterns ? pattern_key THEN
      group_patterns := jsonb_set(
        group_patterns, 
        ARRAY[pattern_key], 
        '{"ai_correct": 0, "user_correct": 0, "total": 0}'::JSONB
      );
    END IF;
    
    -- Update counts
    group_patterns := jsonb_set(
      group_patterns,
      ARRAY[pattern_key, 'total'],
      to_jsonb(COALESCE((group_patterns -> pattern_key ->> 'total')::INT, 0) + 1)
    );
    
    IF prediction.outcome = 'ai_win' OR prediction.outcome = 'tie' THEN
      group_patterns := jsonb_set(
        group_patterns,
        ARRAY[pattern_key, 'ai_correct'],
        to_jsonb(COALESCE((group_patterns -> pattern_key ->> 'ai_correct')::INT, 0) + 1)
      );
    END IF;
    
    IF prediction.outcome = 'user_win' OR prediction.outcome = 'tie' THEN
      group_patterns := jsonb_set(
        group_patterns,
        ARRAY[pattern_key, 'user_correct'],
        to_jsonb(COALESCE((group_patterns -> pattern_key ->> 'user_correct')::INT, 0) + 1)
      );
    END IF;
  END LOOP;
  
  -- Update or insert patterns
  FOR pattern_key IN SELECT jsonb_object_keys(group_patterns)
  LOOP
    INSERT INTO public.prediction_patterns (
      group_key,
      timeframe,
      target_type,
      prediction_type,
      ai_accuracy,
      user_accuracy,
      confidence_adjustment,
      sample_size
    )
    VALUES (
      pattern_key,
      split_part(pattern_key, '_', 1),
      split_part(pattern_key, '_', 2),
      split_part(pattern_key, '_', 3),
      (group_patterns -> pattern_key ->> 'ai_correct')::NUMERIC / NULLIF((group_patterns -> pattern_key ->> 'total')::NUMERIC, 0),
      (group_patterns -> pattern_key ->> 'user_correct')::NUMERIC / NULLIF((group_patterns -> pattern_key ->> 'total')::NUMERIC, 0),
      -- Calculate adjustment: negative if users outperform AI
      ((group_patterns -> pattern_key ->> 'user_correct')::NUMERIC / NULLIF((group_patterns -> pattern_key ->> 'total')::NUMERIC, 0) -
       (group_patterns -> pattern_key ->> 'ai_correct')::NUMERIC / NULLIF((group_patterns -> pattern_key ->> 'total')::NUMERIC, 0)) * -2,
      (group_patterns -> pattern_key ->> 'total')::INTEGER
    )
    ON CONFLICT (group_key) DO UPDATE
    SET
      ai_accuracy = (
        (prediction_patterns.ai_accuracy * prediction_patterns.sample_size) + 
        ((group_patterns -> pattern_key ->> 'ai_correct')::NUMERIC)
      ) / (prediction_patterns.sample_size + (group_patterns -> pattern_key ->> 'total')::NUMERIC),
      
      user_accuracy = (
        (prediction_patterns.user_accuracy * prediction_patterns.sample_size) + 
        ((group_patterns -> pattern_key ->> 'user_correct')::NUMERIC)
      ) / (prediction_patterns.sample_size + (group_patterns -> pattern_key ->> 'total')::NUMERIC),
      
      sample_size = prediction_patterns.sample_size + (group_patterns -> pattern_key ->> 'total')::INTEGER,
      
      confidence_adjustment = (
        ((group_patterns -> pattern_key ->> 'user_correct')::NUMERIC / NULLIF((group_patterns -> pattern_key ->> 'total')::NUMERIC, 0) -
         (group_patterns -> pattern_key ->> 'ai_correct')::NUMERIC / NULLIF((group_patterns -> pattern_key ->> 'total')::NUMERIC, 0)) * -2
      ),
      
      updated_at = now();
  END LOOP;
END;
$$ LANGUAGE plpgsql;