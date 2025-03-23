
import React from 'react';
import TestSupabaseConnection from '../components/TestSupabaseConnection';
import TestBracketsTable from '../components/TestBracketsTable';
import { AppLayout } from '../components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TestDatabaseConnection = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Database Connection Tests</h1>
        
        <Tabs defaultValue="general" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Connection</TabsTrigger>
            <TabsTrigger value="brackets">Brackets Table</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <TestSupabaseConnection />
          </TabsContent>
          
          <TabsContent value="brackets">
            <TestBracketsTable />
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <div className="p-6 text-center bg-muted rounded-lg">
              <p className="text-muted-foreground">
                Subscription tests will be implemented soon
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TestDatabaseConnection;
