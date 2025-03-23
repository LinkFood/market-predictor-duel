
/**
 * Subscription Tab Component
 * Displays user subscription details and upgrade options
 */
import React from 'react';
import { CreditCard, Sparkles, Zap, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan } from '@/lib/subscription/plan-features';
import { useSubscription } from '@/lib/subscription/subscription-context';
import PlanComparison from './PlanComparison';

interface SubscriptionTabProps {
  isLoading?: boolean;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ isLoading = false }) => {
  const { plan, usage, hasPremium, canMakePrediction, refreshUsage } = useSubscription();
  
  const handleUpgrade = (selectedPlan: SubscriptionPlan) => {
    // In a real app, this would open your payment processing flow
    console.log('User selected plan:', selectedPlan);
    alert(`This would redirect to payment processing for the ${selectedPlan} plan. In the real app, we would integrate with Stripe or another payment provider.`);
  };
  
  return (
    <div className="space-y-6">
      {/* Current subscription */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            {hasPremium ? 'Your premium subscription details' : 'You are currently on the free plan'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center">
                {plan === SubscriptionPlan.FREE ? (
                  <>
                    <Clock className="mr-1.5 h-4 w-4 text-muted-foreground" />
                    Free Plan
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-4 w-4 text-amber-500" />
                    {plan === SubscriptionPlan.BASIC ? 'Basic Plan' : 'Pro Plan'}
                  </>
                )}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {plan === SubscriptionPlan.FREE ? 'Free' : 
                 plan === SubscriptionPlan.BASIC ? '$9.99/month' : '$29.99/month'}
              </p>
            </div>
            {!isLoading && (
              <div>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                  {hasPremium ? 'Active' : 'Free tier'}
                </span>
              </div>
            )}
          </div>
          
          {/* Usage metrics */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Predictions this month</span>
                <span className="font-medium">{usage.predictionsThisMonth} / {usage.predictionsLimit}</span>
              </div>
              <Progress value={(usage.predictionsThisMonth / usage.predictionsLimit) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>API calls today</span>
                <span className="font-medium">{usage.apiCallsToday} / {usage.apiCallsLimit}</span>
              </div>
              <Progress value={(usage.apiCallsToday / usage.apiCallsLimit) * 100} className="bg-muted" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated: {usage.lastUpdated.toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" onClick={() => refreshUsage()}>
            Refresh
          </Button>
        </CardFooter>
      </Card>
      
      {/* Feature list */}
      {plan === SubscriptionPlan.FREE && (
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-amber-900">
              <Zap className="mr-2 h-5 w-5 text-amber-500" />
              Upgrade to Premium
            </CardTitle>
            <CardDescription className="text-amber-700">
              Unlock AI-powered insights and advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
                <span className="text-amber-900">Access AI reasoning and analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
                <span className="text-amber-900">Get personalized market insights</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
                <span className="text-amber-900">Make more predictions each month</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" />
                <span className="text-amber-900">Track historical patterns and trends</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-2">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              Upgrade Now
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Plan comparison */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Subscription Plans</h2>
        <PlanComparison onSelectPlan={handleUpgrade} currentPlan={plan} />
      </div>
    </div>
  );
};

export default SubscriptionTab;
