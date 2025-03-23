
/**
 * Premium Feature Component
 * Wraps premium features and shows a lock/upgrade prompt for free users
 */
import React, { ReactNode } from 'react';
import { useSubscription } from '@/lib/subscription/subscription-context';
import { PlanFeatures } from '@/lib/subscription/plan-features';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureProps {
  feature: keyof PlanFeatures;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradeButton?: boolean;
  title?: string;
  description?: string;
}

const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  feature,
  children,
  fallback,
  showUpgradeButton = true,
  title = 'Premium Feature',
  description = 'Upgrade to access this feature'
}) => {
  const { hasAccess, hasPremium } = useSubscription();
  const navigate = useNavigate();
  
  // Map PlanFeatures key to FeatureAvailability key
  const getFeatureKey = (featureKey: keyof PlanFeatures): string => {
    const featureMapping: Record<string, string> = {
      "maxDailyPredictions": "predictions",
      "predictionTimeframes": "extendedTimeframes",
      "aiAnalysis": "aiAnalysis",
      "historicalData": "historicalData",
      "alerts": "alerts",
      "apiAccess": "api",
      "customDashboards": "customization"
    };
    
    return featureMapping[featureKey] || featureKey;
  };
  
  // If user has access to this feature, show the children
  // Cast the feature key to make TypeScript happy
  if (hasAccess(getFeatureKey(feature) as any)) {
    return <>{children}</>;
  }
  
  // If fallback is provided, show it instead of the upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Otherwise, show a locked feature indicator
  return (
    <div className="relative overflow-hidden rounded-lg border border-dashed p-4 bg-muted/50">
      {/* Optional sparkle effect in the corner */}
      <div className="absolute -top-5 -right-5 h-16 w-16 bg-gradient-to-br from-amber-200 to-amber-500 rounded-full opacity-20 blur-xl"></div>
      
      {/* Lock content */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="mb-3 rounded-full bg-muted p-2.5">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-sm font-medium">{title}</h3>
        <p className="mb-4 text-xs text-muted-foreground max-w-[20rem] mx-auto">
          {description}
        </p>
        
        {showUpgradeButton && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Upgrade</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upgrade to Premium</DialogTitle>
                <DialogDescription>
                  Unlock all premium features to get AI-powered market insights and advanced prediction tools.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="rounded-md bg-amber-50 p-4 text-amber-900">
                  <h3 className="font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Premium Features
                  </h3>
                  <ul className="mt-2 text-sm space-y-1">
                    <li>• Access AI analysis and reasoning</li>
                    <li>• Get historical pattern insights</li>
                    <li>• Real-time market alerts</li>
                    <li>• Advanced timeframes</li>
                    <li>• Unlimited prediction history</li>
                  </ul>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => navigate('/app/profile')}>
                  View Plans
                </Button>
                <Button onClick={() => navigate('/app/profile')}>
                  Upgrade Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default PremiumFeature;
