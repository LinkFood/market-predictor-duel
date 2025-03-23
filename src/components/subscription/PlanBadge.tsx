
import React from 'react';
import { BadgeCheck, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubscriptionPlan, useSubscription } from '@/lib/subscription/subscription-context';

interface PlanBadgeProps {
  className?: string;
  showLabel?: boolean;
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ className, showLabel = true }) => {
  const { currentPlan, isLoading } = useSubscription();
  
  // Don't render anything if loading
  if (isLoading) {
    return null;
  }
  
  // Plan-specific styles
  const styles = {
    [SubscriptionPlan.FREE]: {
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
      icon: BadgeCheck,
      label: 'Free Plan'
    },
    [SubscriptionPlan.BASIC]: {
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
      icon: BadgeCheck,
      label: 'Basic Plan'
    },
    [SubscriptionPlan.PRO]: {
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-700 dark:text-amber-300',
      icon: Crown,
      label: 'Pro Plan'
    }
  };
  
  const planStyle = styles[currentPlan];
  const Icon = planStyle.icon;
  
  return (
    <div 
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full',
        planStyle.bgColor,
        planStyle.textColor,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {showLabel && (
        <span className="text-xs font-medium">{planStyle.label}</span>
      )}
    </div>
  );
};

export default PlanBadge;
