
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Prediction } from "@/types";

interface RecentPredictionsSectionProps {
  predictions: Prediction[];
}

const RecentPredictionsSection: React.FC<RecentPredictionsSectionProps> = ({ predictions }) => {
  return (
    <motion.section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="title-sm">Your Recent Predictions</h3>
        <Link to="/app/predictions/history" className="btn-ghost caption text-[hsl(var(--primary))]">
          View All <ChevronRight className="h-3 w-3 inline-block" />
        </Link>
      </div>
      
      <div className="space-y-2">
        {predictions.map((prediction, index) => (
          <Link 
            key={index}
            to={`/app/predictions/${prediction.id}`}
            className="glass-card-subtle p-4 flex items-center justify-between touch-scale"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                prediction.status === 'correct' 
                  ? 'bg-[hsl(var(--success-muted))]' 
                  : prediction.status === 'incorrect' 
                    ? 'bg-[hsl(var(--error-muted))]' 
                    : 'bg-[hsl(var(--warning-muted))]'
              }`}>
                <span className="body-sm font-medium">{prediction.targetName.slice(0, 4)}</span>
              </div>
              
              <div>
                <p className="body-md">{prediction.targetName}</p>
                <p className="caption text-[hsl(var(--muted-foreground))]">
                  {prediction.userPrediction} • {prediction.timeframe}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <span className={`body-md font-medium ${
                prediction.status === 'correct' 
                  ? 'text-[hsl(var(--success))]' 
                  : prediction.status === 'incorrect' 
                    ? 'text-[hsl(var(--error))]' 
                    : 'text-[hsl(var(--warning))]'
              }`}>
                {prediction.status === 'correct' && '+25'}
                {prediction.status === 'incorrect' && '-10'}
                {prediction.status === 'pending' && 'Pending'}
              </span>
              <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
};

export default RecentPredictionsSection;
