
import React, { useState } from 'react';
import { useSubscription } from '@/lib/subscription/subscription-context';
import SubscriptionDebugTools from './SubscriptionDebugTools';
import { Button } from '@/components/ui/button';

const DebugBanner: React.FC = () => {
  const { plan, hasPremium, usage } = useSubscription();
  const [showTools, setShowTools] = useState(false);
  
  return (
    <>
      <div 
        style={{
          position: 'fixed',
          bottom: '70px',
          left: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'lime',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 9999,
          fontSize: '12px',
          fontFamily: 'monospace'
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <div><strong>DEBUG:</strong> UI Update v1.1</div>
            <div><strong>Plan:</strong> {plan || 'Not loaded'}</div>
            <div><strong>Premium:</strong> {hasPremium ? 'Yes' : 'No'}</div>
            <div><strong>Predictions:</strong> {usage?.predictionsThisMonth || 0}/{usage?.predictionsLimit || 0}</div>
            <div><strong>API Calls:</strong> {usage?.apiCallsToday || 0}/{usage?.apiCallsLimit || 0}</div>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-black text-lime-500 border border-lime-700 hover:bg-black/80 hover:text-lime-400 text-xs"
            onClick={() => setShowTools(!showTools)}
          >
            {showTools ? 'Hide Tools' : 'Show Tools'}
          </Button>
        </div>
      </div>
      
      <SubscriptionDebugTools 
        isVisible={showTools} 
        onClose={() => setShowTools(false)} 
      />
    </>
  );
};

export default DebugBanner;
