
import React, { useEffect } from "react";
import { Brain, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisTabs } from "./AnalysisTabs";
import { Prediction } from "@/types";
import PremiumFeature from "@/components/subscription/PremiumFeature";
import { trackEvent } from "@/lib/analytics";
import { useAuth } from "@/lib/auth-context";

interface AIAnalysisCardProps {
  prediction: Prediction;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ prediction }) => {
  const { user } = useAuth();
  
  // Track AI analysis view for premium features
  useEffect(() => {
    if (user) {
      trackEvent('ai_analysis_viewed', { predictionId: prediction.id });
    }
  }, [prediction.id, user]);
  
  // Regular analysis card content
  const analysisContent = (
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
  
  // Free user fallback content (just shows basic comparison)
  const freeFallback = (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Brain className="h-5 w-5 mr-2 text-indigo-500" />
        Prediction Comparison
      </h3>
      
      <Card className="mb-6 border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">Your Prediction</div>
              <div className="text-xl font-bold">{prediction.userPrediction}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">AI Prediction</div>
              <div className="text-xl font-bold">{prediction.aiPrediction}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Wrap in premium feature component
  return (
    <PremiumFeature
      feature="aiAnalysisAccess"
      title="AI Analysis Insights"
      description="Upgrade to see the AI's detailed reasoning and analysis"
      fallback={freeFallback}
    >
      {analysisContent}
    </PremiumFeature>
  );
};
