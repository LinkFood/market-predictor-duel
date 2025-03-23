
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bracket } from '@/lib/duel/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TestBracketsTable: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    if (!user) {
      toast.error('You must be logged in to test the connection');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Test query to the brackets table
      const { data, error } = await supabase
        .from('brackets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setBrackets(data || []);
      toast.success('Successfully connected to brackets table!');
    } catch (err: any) {
      console.error('Error testing brackets connection:', err);
      setError(err.message || 'Unknown error occurred');
      toast.error(`Connection test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 max-w-lg mx-auto mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Brackets Table Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testConnection} 
          disabled={loading || !user}
          className="mb-4 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing Connection
            </>
          ) : 'Test Connection to Brackets Table'}
        </Button>
        
        {error && (
          <div className="p-4 mb-4 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
        
        {brackets.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Your Brackets:</h3>
            <ul className="space-y-2">
              {brackets.map(bracket => (
                <li key={bracket.id} className="p-2 border rounded">
                  {bracket.name} - {bracket.status}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            {loading ? 'Loading brackets...' : 'No brackets found'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestBracketsTable;
