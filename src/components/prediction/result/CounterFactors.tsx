
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Prediction } from "@/types";

interface CounterFactorsProps {
  prediction: Prediction;
}

const CounterFactors: React.FC<CounterFactorsProps> = ({ prediction }) => {
  // Ensure counter points exist with fallbacks
  const counterPoints = prediction?.aiAnalysis?.counter || [
    "Market volatility could impact performance",
    "External factors may affect this prediction",
    "Historical resistance levels may prove challenging"
  ];

  return (
    <div className="divide-y">
      {counterPoints.map((point, idx) => (
        <div key={idx} className="p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs ${
            prediction.aiPrediction === "uptrend" 
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          }`}>
            {idx + 1}
          </div>
          <p className="text-sm leading-relaxed">{point}</p>
        </div>
      ))}
    </div>
  );
};

// Export the icon separately for reuse
CounterFactors.Icon = () => <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />;

export default CounterFactors;
