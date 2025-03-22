
import React from "react";
import { Lightbulb } from "lucide-react";
import { Prediction } from "@/types";

interface SupportingFactorsProps {
  prediction: Prediction;
}

// Define the component with proper typing for static Icon property
const SupportingFactors: React.FC<SupportingFactorsProps> & {
  Icon: () => JSX.Element;
} = ({ prediction }) => {
  // Ensure supporting points exist with fallbacks
  const supportingPoints = prediction?.aiAnalysis?.supporting || [
    "Technical indicators suggest positive movement",
    "Recent market trends favor this direction",
    "Price action shows strength in this timeframe"
  ];

  return (
    <div className="divide-y">
      {supportingPoints.map((point, idx) => (
        <div key={idx} className="p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs ${
            prediction.aiPrediction === "uptrend" 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {idx + 1}
          </div>
          <p className="text-sm leading-relaxed">{point}</p>
        </div>
      ))}
    </div>
  );
};

// Define the Icon property separately
SupportingFactors.Icon = () => <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />;

export default SupportingFactors;
