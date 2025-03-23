import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Swords, BarChart, Sparkles } from 'lucide-react';

const BracketLoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="w-full lg:w-3/5">
            <Skeleton className="h-10 w-3/4 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-36" />
            </div>
          </div>
          <div className="flex gap-2 mt-2 lg:mt-0">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Progress Bar Skeleton */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <Skeleton className="h-2.5 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        
        {/* Scores Summary Skeleton */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="rounded-lg p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div className="w-full">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div className="w-full">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Skeleton */}
      <Tabs defaultValue="head-to-head" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px] mb-2">
          <TabsTrigger value="head-to-head">
            <Swords className="h-4 w-4 mr-2" />
            Head-to-Head
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="ai-profile">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Profile
          </TabsTrigger>
        </TabsList>
        
        {/* Head-to-Head Tab Skeleton */}
        <TabsContent value="head-to-head" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-64" />
              </CardTitle>
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Entries Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32 mb-4" />
                  
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border p-4">
                      <div className="flex justify-between items-start">
                        <div className="w-1/2">
                          <Skeleton className="h-6 w-24 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div>
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* AI Entries Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32 mb-4" />
                  
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border p-4">
                      <div className="flex justify-between items-start">
                        <div className="w-1/2">
                          <Skeleton className="h-6 w-24 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div>
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs would have similar skeleton structures */}
      </Tabs>
    </div>
  );
};

export default BracketLoadingSkeleton;