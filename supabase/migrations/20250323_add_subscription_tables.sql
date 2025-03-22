-- Create subscription and usage tracking tables

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_provider TEXT,
  payment_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Usage events table
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_type TEXT NOT NULL,
  resource_id TEXT,
  plan TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add indices for faster queries
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at);

-- Usage summary view
CREATE OR REPLACE VIEW user_usage_summary AS
SELECT
  user_id,
  date_trunc('month', created_at) AS month,
  COUNT(*) FILTER (WHERE event_type = 'prediction_created') AS predictions_count,
  COUNT(*) FILTER (WHERE event_type = 'api_call') AS api_calls_count,
  COUNT(*) FILTER (WHERE event_type = 'ai_analysis_viewed') AS ai_views_count,
  COUNT(*) AS total_events
FROM
  usage_events
GROUP BY
  user_id, date_trunc('month', created_at);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_timestamp
BEFORE UPDATE ON user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_subscription_timestamp();

-- API usage function
CREATE OR REPLACE FUNCTION get_user_api_usage(user_id_param UUID, days_param INT DEFAULT 30)
RETURNS TABLE (
  day DATE,
  api_calls BIGINT,
  predictions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::DATE AS day,
    COUNT(*) FILTER (WHERE event_type = 'api_call') AS api_calls,
    COUNT(*) FILTER (WHERE event_type = 'prediction_created') AS predictions
  FROM
    usage_events
  WHERE
    user_id = user_id_param AND
    created_at >= (CURRENT_DATE - (days_param || ' days')::INTERVAL)
  GROUP BY
    date_trunc('day', created_at)::DATE
  ORDER BY
    day;
END;
$$ LANGUAGE plpgsql;

-- RLS policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Admins can do anything
CREATE POLICY "Admins can do anything" ON user_subscriptions
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  
CREATE POLICY "Admins can do anything" ON usage_events
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Users can read their own subscription
CREATE POLICY "Users can read their own subscription" ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
  
-- Create subscription triggers
CREATE OR REPLACE FUNCTION ensure_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a free subscription for new users
  INSERT INTO user_subscriptions (
    user_id,
    plan,
    status,
    started_at,
    expires_at
  ) VALUES (
    NEW.id,
    'free',
    'active',
    now(),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_subscription_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION ensure_user_subscription();