
import React from "react";
import { Brain, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisTabs } from "./AnalysisTabs";
import { Prediction } from "@/types";

interface AIAnalysisCardProps {
  prediction: Prediction;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ prediction }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Brain className="h-5 w-5 mr-2 text-indigo-500" />
        AI Analysis
      </h3>
      
      <Card className="mb-6 border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-2 text-sm font-medium">
            <Zap className="h-4 w-4" />
            AI's Reasoning
          </div>
          <p className="italic text-slate-700 dark:text-slate-300">
            "{prediction.aiAnalysis.reasoning}"
          </p>
        </CardContent>
      </Card>

      <AnalysisTabs prediction={prediction} />
    </div>
  );
};
