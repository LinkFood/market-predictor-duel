
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Prediction } from "@/lib/prediction/types";

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
        {predictions.length === 0 ? (
          <div className="glass-card-subtle p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-[hsl(var(--muted-foreground))] mb-2" />
            <p className="body-md mb-1">No predictions yet</p>
            <p className="caption text-[hsl(var(--muted-foreground))]">
              Make your first prediction to see how you match up against AI!
            </p>
            <Link 
              to="/app/predict" 
              className="btn-primary btn-sm mt-4"
            >
              Make a Prediction
            </Link>
          </div>
        ) : (
          predictions.map((prediction) => (
            <Link 
              key={prediction.id}
              to={`/app/predictions/${prediction.id}`}
              className="glass-card-subtle p-4 flex items-center justify-between touch-scale"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  prediction.status === 'complete' && prediction.outcome === 'user_win'
                    ? 'bg-[hsl(var(--success-muted))]' 
                    : prediction.status === 'complete' && prediction.outcome === 'ai_win'
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
                  prediction.status === 'complete' && prediction.outcome === 'user_win'
                    ? 'text-[hsl(var(--success))]' 
                    : prediction.status === 'complete' && prediction.outcome === 'ai_win'
                      ? 'text-[hsl(var(--error))]' 
                      : 'text-[hsl(var(--warning))]'
                }`}>
                  {prediction.status === 'complete' && prediction.outcome === 'user_win' && '+25'}
                  {prediction.status === 'complete' && prediction.outcome === 'ai_win' && '-10'}
                  {prediction.status === 'pending' && 'Pending'}
                </span>
                <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </div>
            </Link>
          ))
        )}
      </div>
    </motion.section>
  );
};

export default RecentPredictionsSection;
