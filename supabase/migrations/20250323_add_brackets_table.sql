-- Create brackets table
CREATE TABLE IF NOT EXISTS public.brackets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  timeframe TEXT NOT NULL CHECK (timeframe IN ('daily', 'weekly', 'monthly')),
  size INTEGER NOT NULL CHECK (size IN (3, 6, 9)),
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed')),
  ai_personality TEXT NOT NULL,
  user_entries JSONB NOT NULL DEFAULT '[]'::JSONB,
  ai_entries JSONB NOT NULL DEFAULT '[]'::JSONB,
  matches JSONB NOT NULL DEFAULT '[]'::JSONB,
  winner_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_points NUMERIC DEFAULT 0,
  ai_points NUMERIC DEFAULT 0
);

-- Create index on user_id to speed up filtering by user
CREATE INDEX IF NOT EXISTS brackets_user_id_idx ON public.brackets(user_id);

-- Add RLS policies to secure the brackets table
ALTER TABLE public.brackets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own brackets
CREATE POLICY brackets_select_policy ON public.brackets
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert only their own brackets
CREATE POLICY brackets_insert_policy ON public.brackets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own brackets
CREATE POLICY brackets_update_policy ON public.brackets
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own brackets
CREATE POLICY brackets_delete_policy ON public.brackets
  FOR DELETE USING (auth.uid() = user_id);

-- Grant select, insert, update, delete permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brackets TO authenticated;

-- Update the Database type definition to include the brackets table
-- Note: You'll need to update your types.ts file (this SQL comment is for reference only)