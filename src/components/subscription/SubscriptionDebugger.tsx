import React, { useEffect, useState } from 'react';
import { useSubscription } from '@/lib/subscription/subscription-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SubscriptionDebugger: React.FC = () => {
  const { plan, hasPremium, usage, updateUsage } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    console.log("Subscription context loaded:", { plan, hasPremium, usage });
  }, [plan, hasPremium, usage]);
  
  const incrementPredictions = () => {
    updateUsage({
      ...usage,
      predictionsThisMonth: usage.predictionsThisMonth + 1
    });
  };
  
  const incrementApiCalls = () => {
    updateUsage({
      ...usage,
      apiCallsToday: usage.apiCallsToday + 1
    });
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={() => setIsVisible(!isVisible)} 
        variant="outline" 
        size="sm"
        className="bg-black text-white border-gray-600"
      >
        {isVisible ? 'Hide' : 'Debug'}
      </Button>
      
      {isVisible && (
        <Card className="absolute bottom-10 right-0 w-80 bg-black border border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Subscription Debugger</CardTitle>
            <CardDescription className="text-gray-400">Test subscription features</CardDescription>
          </CardHeader>
          <CardContent className="text-xs space-y-3">
            <div className="flex justify-between">
              <span>Current Plan:</span>
              <span className="font-mono">{plan || 'Not loaded'}</span>
            </div>
            <div className="flex justify-between">
              <span>Has Premium:</span>
              <span className="font-mono">{hasPremium ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Predictions:</span>
              <span className="font-mono">{usage?.predictionsThisMonth || 0}/{usage?.predictionsLimit || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>API Calls:</span>
              <span className="font-mono">{usage?.apiCallsToday || 0}/{usage?.apiCallsLimit || 0}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex gap-2">
            <Button size="sm" variant="outline" onClick={incrementPredictions}>+1 Prediction</Button>
            <Button size="sm" variant="outline" onClick={incrementApiCalls}>+1 API Call</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionDebugger;