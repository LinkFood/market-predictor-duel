
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanFeature {
  name: string;
  free: boolean | number;
  premium: boolean | number;
}

interface PlanComparisonProps {
  currentPlan: 'free' | 'premium';
  onUpgrade: () => void;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({ currentPlan, onUpgrade }) => {
  const features: PlanFeature[] = [
    { name: 'Unlimited predictions', free: false, premium: true },
    { name: 'AI-powered insights', free: true, premium: true },
    { name: 'Market data access', free: true, premium: true },
    { name: 'Daily predictions', free: 3, premium: 'Unlimited' as any },
    { name: 'Prediction history', free: '7 days' as any, premium: 'Unlimited' as any },
    { name: 'Performance tracking', free: true, premium: true },
    { name: 'Advanced AI analysis', free: false, premium: true },
    { name: 'Priority support', free: false, premium: true },
    { name: 'Sector-specific insights', free: false, premium: true },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1"></div>
        <div className="col-span-1 text-center">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Free Plan</h3>
            <p className="text-sm text-muted-foreground mt-1">Basic access</p>
            <div className="mt-4 text-2xl font-bold">$0</div>
            <div className="text-xs text-muted-foreground">forever</div>
          </div>
        </div>
        <div className="col-span-1 text-center">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Premium Plan</h3>
            <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-1">Full access</p>
            <div className="mt-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400">$9.99</div>
            <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70">per month</div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-3 gap-4 py-3 ${index !== features.length - 1 ? 'border-b' : ''}`}
          >
            <div className="col-span-1 flex items-center">
              <span className="text-sm font-medium">{feature.name}</span>
            </div>
            <div className="col-span-1 flex justify-center items-center">
              {typeof feature.free === 'boolean' ? (
                feature.free ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                )
              ) : (
                <span className="text-sm">{feature.free}</span>
              )}
            </div>
            <div className="col-span-1 flex justify-center items-center">
              {typeof feature.premium === 'boolean' ? (
                feature.premium ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                )
              ) : (
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{feature.premium}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {currentPlan === 'free' ? (
          <Button 
            onClick={onUpgrade}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            Upgrade to Premium
          </Button>
        ) : (
          <Button variant="outline">
            You're on Premium
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlanComparison;
