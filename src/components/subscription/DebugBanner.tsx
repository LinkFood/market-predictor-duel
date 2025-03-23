import React from 'react';
import { useSubscription } from '@/lib/subscription/subscription-context';

const DebugBanner: React.FC = () => {
  const { plan, hasPremium, usage } = useSubscription();
  
  return (
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
      <div><strong>DEBUG:</strong> UI Update v1.0</div>
      <div><strong>Plan:</strong> {plan || 'Not loaded'}</div>
      <div><strong>Premium:</strong> {hasPremium ? 'Yes' : 'No'}</div>
      <div><strong>Predictions:</strong> {usage?.predictionsThisMonth || 0}/{usage?.predictionsLimit || 0}</div>
      <div><strong>API Calls:</strong> {usage?.apiCallsToday || 0}/{usage?.apiCallsLimit || 0}</div>
    </div>
  );
};

export default DebugBanner;