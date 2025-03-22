
import React from "react";
import { AlertCircle, X } from "lucide-react";
import { motion } from "framer-motion";

interface AlertBannerProps {
  onDismiss: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ onDismiss }) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mb-5 overflow-hidden"
    >
      <div className="rounded-[var(--radius-md)] border border-[hsl(var(--warning-muted))] bg-[hsl(var(--warning-muted))]/20 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))]" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="body-md text-[hsl(var(--warning))]">Market volatility is high today. Create predictions carefully.</p>
            <button 
              onClick={onDismiss}
              className="ml-3 flex-shrink-0"
            >
              <X className="h-5 w-5 text-[hsl(var(--warning))]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertBanner;
