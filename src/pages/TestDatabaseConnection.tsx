import React from 'react';
import TestSupabaseConnection from '../components/TestSupabaseConnection';
import { AppLayout } from '../components/AppLayout';

const TestDatabaseConnection = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Database Connection Test</h1>
        <TestSupabaseConnection />
      </div>
    </AppLayout>
  );
};

export default TestDatabaseConnection;