const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://xvojivdhshgdbxrwcokx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2ppdmRoc2hnZGJ4cndjb2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQxNDUsImV4cCI6MjA1NzY4MDE0NX0.G0HNXKFNUqIba27xsKY9t1KYRDL68ZHbsSgLmPQsXc4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error getting tables:', tablesError);
      return;
    }
    
    console.log('Connection successful!');
    console.log('Available tables:');
    tablesData.forEach(t => console.log(`- ${t.tablename}`));
    
    // Check for brackets table specifically
    const hasBracketsTable = tablesData.some(t => t.tablename === 'brackets');
    console.log('\nBrackets table exists:', hasBracketsTable);
    
    // Check for subscription tables
    const hasSubscriptionsTable = tablesData.some(t => t.tablename === 'user_subscriptions');
    console.log('Subscriptions table exists:', hasSubscriptionsTable);
    
  } catch (error) {
    console.error('Error testing connection:', error);
  }
}

testConnection();