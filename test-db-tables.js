const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://xvojivdhshgdbxrwcokx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2ppdmRoc2hnZGJ4cndjb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQxNDUsImV4cCI6MjA1NzY4MDE0NX0.G0HNXKFNUqIba27xsKY9t1KYRDL68ZHbsSgLmPQsXc4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testTablesExist() {
  console.log('Checking for specific tables...');
  
  // We'll try to select from each table - this will fail if they don't exist
  try {
    // Check brackets
    const { data: brackets, error: bracketsError } = await supabase
      .from('brackets')
      .select('count(*)', { count: 'exact', head: true });
    
    if (bracketsError) {
      console.log('Brackets table does not exist or error:', bracketsError.message);
    } else {
      console.log('Brackets table exists');
    }
    
    // Check subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('user_subscriptions')
      .select('count(*)', { count: 'exact', head: true });
    
    if (subsError) {
      console.log('user_subscriptions table does not exist or error:', subsError.message);
    } else {
      console.log('user_subscriptions table exists');
    }
    
  } catch (error) {
    console.error('Error testing tables:', error);
  }
}

testTablesExist();