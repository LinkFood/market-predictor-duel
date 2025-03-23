import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TestSupabaseConnection from '@/components/TestSupabaseConnection';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TestDatabaseConnection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold">Database Connection Test</h1>
        <p className="text-slate-500 mt-2">
          This page tests the connection to Supabase and verifies required tables exist.
        </p>
      </div>
      
      <div className="mb-8">
        <TestSupabaseConnection />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Migration Status</CardTitle>
          <CardDescription>
            Required migrations for the UI upgrade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Migration Files</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="font-mono">20250322_add_prediction_patterns.sql</span>
                  <span className="text-blue-600">Need to execute</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono">20250323_add_brackets_table.sql</span>
                  <span className="text-blue-600">Need to execute</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono">20250323_add_prediction_pattern_functions.sql</span>
                  <span className="text-blue-600">Need to execute</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-mono">20250323_add_subscription_tables.sql</span>
                  <span className="text-blue-600">Need to execute</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Manual Setup Required</h3>
              <p className="text-sm text-yellow-700">
                Please execute the migration SQL files in the Supabase SQL Editor. The SQL files
                are located in the <code className="bg-yellow-100 px-1 rounded">supabase/migrations</code> directory.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t">
          <p className="text-xs text-slate-500">
            Note: After executing migrations, refresh this page to verify the tables exist.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestDatabaseConnection;