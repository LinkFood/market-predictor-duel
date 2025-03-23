
import React, { useEffect, useState } from 'react';
import { useSubscription } from '@/lib/subscription/subscription-context';
import { SubscriptionPlan } from '@/lib/subscription/subscription-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BugIcon, Settings2, LayoutDashboard, XCircle } from 'lucide-react';

interface SubscriptionDebugToolsProps {
  isVisible: boolean;
  onClose: () => void;
}

const SubscriptionDebugTools: React.FC<SubscriptionDebugToolsProps> = ({ 
  isVisible, 
  onClose 
}) => {
  const { plan, usage, refreshUsage, setDebugPlan } = useSubscription();
  const [debugMode, setDebugMode] = useState(() => {
    return localStorage.getItem('subscriptionDebugMode') === 'true';
  });
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    const newMode = !debugMode;
    setDebugMode(newMode);
    localStorage.setItem('subscriptionDebugMode', newMode.toString());
    
    // If turning off debug mode, reset to actual plan
    if (!newMode) {
      setDebugPlan(null);
      localStorage.removeItem('debugPlan');
    }
  };
  
  // Set debug plan
  const handleSetPlan = (selectedPlan: SubscriptionPlan) => {
    setDebugPlan(selectedPlan);
    localStorage.setItem('debugPlan', selectedPlan);
  };
  
  // Used to update UI when plan changes
  useEffect(() => {
    // Update active plan indicator
  }, [plan]);
  
  // Increment usage counters for testing
  const incrementPredictions = () => {
    if (usage) {
      refreshUsage();
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 bg-black/90 border border-gray-700 text-white shadow-xl">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm flex items-center">
            <BugIcon className="h-4 w-4 mr-2 text-amber-500" />
            Subscription Debug Tools
          </CardTitle>
          <CardDescription className="text-gray-400">
            Development testing tools
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={onClose}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="debug-mode">Debug Mode</Label>
            <div className="text-xs text-muted-foreground">
              Override subscription plan
            </div>
          </div>
          <Switch
            id="debug-mode"
            checked={debugMode}
            onCheckedChange={toggleDebugMode}
          />
        </div>
        
        {debugMode && (
          <Tabs defaultValue="plan">
            <TabsList className="grid w-full grid-cols-2 bg-black/60">
              <TabsTrigger value="plan">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Plan
              </TabsTrigger>
              <TabsTrigger value="usage">
                <Settings2 className="h-4 w-4 mr-2" />
                Usage
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="plan" className="space-y-4 pt-4">
              <div className="text-sm mb-2">Select a plan to test:</div>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  size="sm" 
                  variant={plan === SubscriptionPlan.FREE ? "default" : "outline"} 
                  onClick={() => handleSetPlan(SubscriptionPlan.FREE)}
                  className={plan === SubscriptionPlan.FREE ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  Free
                </Button>
                <Button 
                  size="sm" 
                  variant={plan === SubscriptionPlan.BASIC ? "default" : "outline"} 
                  onClick={() => handleSetPlan(SubscriptionPlan.BASIC)}
                  className={plan === SubscriptionPlan.BASIC ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  Basic
                </Button>
                <Button 
                  size="sm" 
                  variant={plan === SubscriptionPlan.PRO ? "default" : "outline"} 
                  onClick={() => handleSetPlan(SubscriptionPlan.PRO)}
                  className={plan === SubscriptionPlan.PRO ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  Pro
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="usage" className="space-y-4 pt-4">
              <div className="text-sm mb-2">Current Usage:</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Predictions:</span>
                  <span className="font-mono">{usage?.predictionsThisMonth || 0}/{usage?.predictionsLimit || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Calls:</span>
                  <span className="font-mono">{usage?.apiCallsToday || 0}/{usage?.apiCallsLimit || 0}</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={incrementPredictions}
                className="w-full"
              >
                Increment Prediction Usage
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            Current Plan: 
            <span className="ml-1 px-1.5 py-0.5 bg-green-900/50 rounded text-green-400 font-medium">
              {plan}
            </span>
          </div>
          <div>DEV ONLY</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionDebugTools;
