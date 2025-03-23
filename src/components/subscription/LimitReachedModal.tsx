
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/lib/subscription/subscription-context';

interface LimitReachedModalProps {
  open: boolean;
  onClose: () => void;
  limitType: 'predictions' | 'api';
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ 
  open, 
  onClose,
  limitType 
}) => {
  const navigate = useNavigate();
  const { usage } = useSubscription();

  const handleUpgrade = () => {
    navigate('/app/profile?tab=subscription');
    onClose();
  };

  // Set default values if usage is null
  const predictionsThisMonth = usage?.predictionsThisMonth || 0;
  const predictionsLimit = usage?.predictionsLimit || 0;
  const apiCallsToday = usage?.apiCallsToday || 0;
  const apiCallsLimit = usage?.apiCallsLimit || 0;
  
  const limitDetails = {
    predictions: {
      title: 'Prediction Limit Reached',
      description: `You've used ${predictionsThisMonth} of your ${predictionsLimit} predictions this month.`,
      message: 'Upgrade to a premium plan to make more predictions and unlock advanced features like AI pattern recognition and detailed market insights.',
    },
    api: {
      title: 'API Call Limit Reached',
      description: `You've used ${apiCallsToday} of your ${apiCallsLimit} API calls today.`,
      message: 'Upgrade to a premium plan to increase your API call limits and access more market data sources.',
    }
  };

  const details = limitDetails[limitType];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-amber-100 p-3 rounded-full mb-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">{details.title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {details.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-center mb-4">
            {details.message}
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
              Premium benefits:
            </h4>
            <ul className="text-sm space-y-1.5">
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-primary rounded-full mr-2"></span>
                Higher prediction limits (up to unlimited)
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-primary rounded-full mr-2"></span>
                AI-powered market pattern recognition
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-primary rounded-full mr-2"></span>
                Detailed performance analytics
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-primary rounded-full mr-2"></span>
                Priority access to new features
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:w-1/2" onClick={onClose}>
            Maybe Later
          </Button>
          <Button 
            variant="default" 
            className="sm:w-1/2"
            onClick={handleUpgrade}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LimitReachedModal;
