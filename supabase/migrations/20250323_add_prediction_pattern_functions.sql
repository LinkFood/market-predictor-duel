
-- Add RPC function for upserting prediction patterns
CREATE OR REPLACE FUNCTION public.upsert_prediction_pattern(
  group_key TEXT,
  timeframe TEXT,
  target_type TEXT,
  prediction_type TEXT,
  ai_accuracy NUMERIC,
  user_accuracy NUMERIC,
  confidence_adjustment NUMERIC,
  sample_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.prediction_patterns(
    group_key,
    timeframe,
    target_type,
    prediction_type,
    ai_accuracy,
    user_accuracy,
    confidence_adjustment,
    sample_size,
    created_at,
    updated_at
  )
  VALUES (
    group_key,
    timeframe,
    target_type,
    prediction_type,
    ai_accuracy,
    user_accuracy,
    confidence_adjustment,
    sample_size,
    created_at,
    now()
  )
  ON CONFLICT (group_key) 
  DO UPDATE SET
    ai_accuracy = (
      (prediction_patterns.ai_accuracy * prediction_patterns.sample_size) + 
      (ai_accuracy * sample_size)
    ) / (prediction_patterns.sample_size + sample_size),
    
    user_accuracy = (
      (prediction_patterns.user_accuracy * prediction_patterns.sample_size) + 
      (user_accuracy * sample_size)
    ) / (prediction_patterns.sample_size + sample_size),
    
    sample_size = prediction_patterns.sample_size + sample_size,
    
    confidence_adjustment = (confidence_adjustment + prediction_patterns.confidence_adjustment) / 2,
    
    updated_at = now();
END;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.upsert_prediction_pattern TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_prediction_pattern TO anon;
