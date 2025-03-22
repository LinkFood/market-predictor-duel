
-- First, enable the required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Drop existing cron job if it exists to avoid duplicates
SELECT cron.unschedule('resolve-expired-predictions');

-- Schedule the cron job to run every hour
SELECT
  cron.schedule(
    'resolve-expired-predictions',
    '0 * * * *', -- Run at the top of every hour
    $$
    SELECT
      net.http_post(
          url:='https://xvojivdhshgdbxrwcokx.supabase.co/functions/v1/resolve-predictions',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2ppdmRoc2hnZGJ4cndjb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQxNDUsImV4cCI6MjA1NzY4MDE0NX0.G0HNXKFNUqIba27xsKY9t1KYRDL68ZHbsSgLmPQsXc4"}'::jsonb,
          body:=concat('{"time": "', now(), '"}')::jsonb
      ) as request_id;
    $$
  );
