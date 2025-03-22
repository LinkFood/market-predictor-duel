
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  getPlanComparisonData, 
  SubscriptionPlan,
  isFeatureBoolean
} from '@/lib/subscription/plan-features';

interface PlanComparisonProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currentPlan?: SubscriptionPlan;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({ 
  onSelectPlan,
  currentPlan = SubscriptionPlan.FREE
}) => {
  const comparisonData = getPlanComparisonData();
  
  // Format feature value for display
  const formatFeatureValue = (value: string | number | boolean): React.ReactNode => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
      );
    }
    
    if (typeof value === 'number') {
      if (value >= 1000) {
        return <span className="font-medium">{value.toLocaleString()}</span>;
      }
      return <span className="font-medium">{value}</span>;
    }
    
    return value;
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 text-center border-b">
        <div className="p-4 font-medium">Features</div>
        <div className="p-4 font-medium bg-muted/30">Free</div>
        <div className="p-4 font-medium bg-muted/50">Basic</div>
        <div className="p-4 font-medium bg-muted/70">Pro</div>
      </div>
      
      <div className="grid grid-cols-4 text-center border-b">
        <div className="p-4 text-sm">Price</div>
        <div className="p-4 font-medium">Free</div>
        <div className="p-4 font-medium">$9.99/mo</div>
        <div className="p-4 font-medium">$29.99/mo</div>
      </div>
      
      {comparisonData.map((row, index) => (
        <div 
          key={index} 
          className="grid grid-cols-4 text-center border-b last:border-b-0"
        >
          <div className="p-4 text-sm">{row.feature}</div>
          <div className="p-4">{formatFeatureValue(row.free)}</div>
          <div className="p-4">{formatFeatureValue(row.basic)}</div>
          <div className="p-4">{formatFeatureValue(row.pro)}</div>
        </div>
      ))}
      
      <div className="grid grid-cols-4 text-center p-4 bg-muted/10">
        <div className="p-2"></div>
        <div className="p-2">
          <Button 
            variant={currentPlan === SubscriptionPlan.FREE ? "outline" : "default"}
            className="w-full"
            disabled={currentPlan === SubscriptionPlan.FREE}
            onClick={() => onSelectPlan(SubscriptionPlan.FREE)}
          >
            {currentPlan === SubscriptionPlan.FREE ? 'Current' : 'Select'}
          </Button>
        </div>
        <div className="p-2">
          <Button 
            variant={currentPlan === SubscriptionPlan.BASIC ? "outline" : "default"}
            className="w-full"
            disabled={currentPlan === SubscriptionPlan.BASIC}
            onClick={() => onSelectPlan(SubscriptionPlan.BASIC)}
          >
            {currentPlan === SubscriptionPlan.BASIC ? 'Current' : 'Select'}
          </Button>
        </div>
        <div className="p-2">
          <Button 
            variant={currentPlan === SubscriptionPlan.PRO ? "outline" : "default"}
            className="w-full"
            disabled={currentPlan === SubscriptionPlan.PRO}
            onClick={() => onSelectPlan(SubscriptionPlan.PRO)}
          >
            {currentPlan === SubscriptionPlan.PRO ? 'Current' : 'Select'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanComparison;
