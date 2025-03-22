/**
 * Plan Comparison Component
 * Displays a comparison table of available subscription plans
 */
import React from 'react';
import { Check, X } from 'lucide-react';
import { SubscriptionPlan, formatPlanPrice, PLAN_FEATURES } from '@/lib/subscription/plan-features';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/lib/subscription/subscription-context';

interface PlanComparisonProps {
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({ onSelectPlan }) => {
  const { plan: currentPlan } = useSubscription();
  
  // Features to display in the comparison
  const features = [
    { name: 'AI Competition', key: 'aiCompetition' },
    { name: 'Leaderboard Access', key: 'leaderboardAccess' },
    { name: 'Basic Stats', key: 'basicStats' },
    { name: 'AI Analysis Access', key: 'aiAnalysisAccess', isPremium: true },
    { name: 'AI Reasoning Access', key: 'aiReasoningAccess', isPremium: true },
    { name: 'Market Insights', key: 'marketInsights', isPremium: true },
    { name: 'Historical Patterns', key: 'historicalPatterns', isPremium: true },
    { name: 'Real-time Alerts', key: 'realTimeAlerts', isPremium: true },
    { name: 'Advanced Timeframes', key: 'advancedTimeframes', isPremium: true },
    { name: 'Unlimited History', key: 'unlimitedHistory', isPremium: true },
  ];
  
  // Plans to display
  const plans = [
    { id: SubscriptionPlan.FREE, name: 'Free', description: 'Challenge Mode' },
    { id: SubscriptionPlan.BASIC, name: 'Basic', description: 'Insight Mode' },
    { id: SubscriptionPlan.PRO, name: 'Pro', description: 'Advanced Insights' },
  ];
  
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-4 divide-x">
        {/* Feature column */}
        <div className="bg-muted/50 p-4">
          <div className="h-16 flex items-end">
            <h3 className="text-sm font-medium">Features</h3>
          </div>
          
          {/* Feature list */}
          <ul className="space-y-4 pt-4">
            {features.map((feature) => (
              <li 
                key={feature.key} 
                className={`text-sm py-2 ${feature.isPremium ? 'font-medium' : ''}`}
              >
                {feature.name}
              </li>
            ))}
            
            {/* Usage limits */}
            <li className="text-sm py-2 font-medium">Monthly Predictions</li>
            <li className="text-sm py-2">API Calls Per Day</li>
          </ul>
        </div>
        
        {/* Plan columns */}
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`p-4 text-center ${currentPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="h-16 flex flex-col items-center justify-end">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </div>
            
            {/* Feature availability for this plan */}
            <ul className="space-y-4 pt-4">
              {features.map((feature) => (
                <li key={feature.key} className="py-2">
                  {PLAN_FEATURES[plan.id][feature.key as keyof typeof PLAN_FEATURES[typeof plan.id]] ? (
                    <Check className="mx-auto h-4 w-4 text-primary" />
                  ) : (
                    <X className="mx-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </li>
              ))}
              
              {/* Usage limits */}
              <li className="py-2 font-medium">
                {PLAN_FEATURES[plan.id].maxPredictionsPerMonth}
              </li>
              <li className="py-2">
                {PLAN_FEATURES[plan.id].apiCallsPerDay}
              </li>
            </ul>
            
            {/* Price and action */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <div className="text-xl font-bold">{formatPlanPrice(plan.id)}</div>
                {plan.id !== SubscriptionPlan.FREE && (
                  <div className="text-xs text-muted-foreground">Billed monthly</div>
                )}
              </div>
              
              <Button 
                variant={currentPlan === plan.id ? "outline" : "default"} 
                className="w-full"
                onClick={() => onSelectPlan?.(plan.id)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanComparison;