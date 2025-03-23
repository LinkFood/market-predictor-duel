
import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';

const TestSupabaseConnection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{status: 'success' | 'error', message: string} | null>(null);
  const [tables, setTables] = useState<string[]>([]);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Simple query to test connection
      const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
      
      if (error) throw error;
      
      setResult({
        status: 'success',
        message: 'Successfully connected to Supabase!'
      });

      // Get list of tables
      const { data: tablesData } = await supabase.rpc('get_tables');
      
      if (tablesData) {
        setTables(tablesData);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
      
      <Button 
        onClick={testConnection} 
        disabled={loading}
        className="mb-4 w-full"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </Button>
      
      {result && (
        <div className={`p-4 rounded mb-4 ${
          result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result.message}
        </div>
      )}
      
      {tables.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Available Tables:</h3>
          <ul className="list-disc pl-5">
            {tables.map((table, index) => (
              <li key={index}>{table}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default TestSupabaseConnection;
