
/**
 * Plan Badge Component
 * Shows the user's current subscription plan as a badge
 */
import React from 'react';
import { useSubscription } from '@/lib/subscription/subscription-context';
import { SubscriptionPlan } from '@/lib/subscription/plan-features';
import { cn } from '@/lib/utils';
import { MoreVertical, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';

interface PlanBadgeProps {
  className?: string;
  showMenu?: boolean;
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ className, showMenu = true }) => {
  const { plan, hasPremium, usage } = useSubscription();
  const navigate = useNavigate();
  
  // Define badge styles based on plan
  const getBadgeClasses = () => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case SubscriptionPlan.BASIC:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case SubscriptionPlan.PRO:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  // Get icon for plan
  const getPlanIcon = () => {
    if (hasPremium) {
      return <Sparkles className="h-3.5 w-3.5 mr-1" />;
    }
    return <Clock className="h-3.5 w-3.5 mr-1" />;
  };
  
  // Get plan name
  const getPlanName = () => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return 'Free Plan';
      case SubscriptionPlan.BASIC:
        return 'Basic Plan';
      case SubscriptionPlan.PRO:
        return 'Pro Plan';
      default:
        return 'Free Plan';
    }
  };
  
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div 
        className={cn(
          'flex items-center rounded-md border px-2 py-1 text-xs font-medium',
          getBadgeClasses()
        )}
      >
        {getPlanIcon()}
        <span>{getPlanName()}</span>
      </div>
      
      {showMenu && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 ml-2 rounded-full">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-56 p-2">
            <div className="grid gap-1">
              <div className="text-xs p-2 font-medium">
                {hasPremium ? "Premium Subscription" : "Free Plan"}
              </div>
              
              <div className="p-2 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Predictions:</span>
                  <span className="font-medium">{usage.predictionsThisMonth}/{usage.predictionsLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Calls:</span>
                  <span className="font-medium">{usage.apiCallsToday}/{usage.apiCallsLimit}</span>
                </div>
              </div>
              
              <div className="border-t my-1"></div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start"
                onClick={() => navigate('/app/profile')}
              >
                Profile Settings
              </Button>
              
              {!hasPremium && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => navigate('/app/profile?tab=subscription')}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default PlanBadge;
