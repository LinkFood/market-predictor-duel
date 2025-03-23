const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Create Supabase client with service role key (requires admin privileges)
// NOTE: In real production setup, you would use proper service account credentials
const SUPABASE_URL = "https://xvojivdhshgdbxrwcokx.supabase.co";
const SUPABASE_SERVICE_KEY = "REPLACE_WITH_SERVICE_ROLE_KEY"; // This requires the actual service role key

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Migration files to apply
const MIGRATIONS = [
  {
    file: '20250322_add_prediction_patterns.sql',
    description: 'Creates prediction patterns table'
  },
  {
    file: '20250323_add_brackets_table.sql',
    description: 'Creates brackets table for duels'
  },
  {
    file: '20250323_add_subscription_tables.sql',
    description: 'Creates subscription and usage tracking tables'
  },
  {
    file: '20250323_add_prediction_pattern_functions.sql',
    description: 'Adds functions for prediction pattern analysis'
  }
];

/**
 * Apply a single migration file
 */
async function applyMigration(migrationFile) {
  console.log(`\nApplying migration: ${migrationFile.file}`);
  console.log(`Description: ${migrationFile.description}`);
  
  try {
    // Read migration SQL file
    const filePath = path.join(__dirname, 'supabase', 'migrations', migrationFile.file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split into statements (this is a simple approach, could be improved)
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`Found ${statements.length} SQL statements`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      
      console.log(`Executing statement ${i+1}/${statements.length}`);
      
      // Use Supabase's RPC to execute raw SQL
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      
      if (error) {
        console.error(`Error executing statement: ${error.message}`);
        return false;
      }
    }
    
    console.log(`✅ Migration ${migrationFile.file} completed successfully`);
    return true;
  } catch (error) {
    console.error(`Error applying migration ${migrationFile.file}:`, error);
    return false;
  }
}

/**
 * Apply all migrations
 */
async function applyAllMigrations() {
  console.log('🔄 Starting database migrations...');
  
  // Check if we can connect with the service role key
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('❌ Cannot authenticate with Supabase:', error.message);
      console.error('Please update the SUPABASE_SERVICE_KEY with a valid service role key');
      return;
    }
    
    console.log('✅ Successfully authenticated with Supabase');
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return;
  }
  
  // Apply each migration
  for (const migration of MIGRATIONS) {
    const success = await applyMigration(migration);
    if (!success) {
      console.error(`❌ Migration ${migration.file} failed. Stopping...`);
      return;
    }
  }
  
  console.log('\n✅ All migrations completed successfully');
}

// Execute migrations
applyAllMigrations();