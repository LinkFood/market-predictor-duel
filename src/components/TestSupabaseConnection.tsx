import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Database, RefreshCw } from 'lucide-react';

interface TableStatus {
  name: string;
  exists: boolean;
  rowCount?: number;
  error?: string;
}

const TestSupabaseConnection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const requiredTables = [
    'predictions',
    'brackets',
    'user_stats',
    'global_stats',
    'user_subscriptions',
    'usage_events',
    'prediction_patterns'
  ];

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionError(null);
    setTableStatuses([]);

    try {
      // Test basic connection
      const { data, error } = await supabase.from('_test_connection_').select('*').limit(1);
      
      if (error && error.message !== 'relation "_test_connection_" does not exist') {
        throw new Error(`Connection error: ${error.message}`);
      }

      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.warn("Authentication error:", userError.message);
      } else {
        setCurrentUser(userData.user);
      }

      // Check each required table
      const tableResults: TableStatus[] = [];
      
      for (const tableName of requiredTables) {
        try {
          // Check if table exists by attempting to get count
          const { count, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (countError && countError.message.includes('does not exist')) {
            tableResults.push({
              name: tableName,
              exists: false,
              error: countError.message
            });
          } else {
            tableResults.push({
              name: tableName,
              exists: true,
              rowCount: count || 0
            });
          }
        } catch (e: any) {
          tableResults.push({
            name: tableName,
            exists: false,
            error: e.message
          });
        }
      }

      setTableStatuses(tableResults);
    } catch (error: any) {
      setConnectionError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Test
        </CardTitle>
        <CardDescription>
          Verifies connection to Supabase and checks required tables
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {connectionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}

        {!connectionError && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Connected to Supabase</AlertTitle>
            <AlertDescription>
              URL: {process.env.VITE_SUPABASE_URL?.slice(0, 30)}...
              {currentUser && <div className="mt-1">User: {currentUser.email}</div>}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-slate-50 rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Required Tables Status:</h3>
          <div className="space-y-2">
            {tableStatuses.map((table) => (
              <div key={table.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{table.name}</span>
                  <Badge variant={table.exists ? "success" : "destructive"} size="sm">
                    {table.exists ? "Exists" : "Missing"}
                  </Badge>
                </div>
                {table.exists && (
                  <span className="text-xs text-slate-500">
                    {table.rowCount} rows
                  </span>
                )}
              </div>
            ))}
            
            {tableStatuses.length === 0 && isLoading && (
              <div className="text-center py-4">
                <RefreshCw className="animate-spin h-5 w-5 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-500">Checking tables...</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={testConnection}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Refresh Connection Test"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestSupabaseConnection;