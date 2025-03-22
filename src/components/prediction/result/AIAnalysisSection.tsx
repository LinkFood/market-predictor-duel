
import React from "react";
import { Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prediction } from "@/lib/prediction/types"; // Updated import path
import SupportingFactors from "./SupportingFactors";
import CounterFactors from "./CounterFactors";

interface AIAnalysisSectionProps {
  prediction: Prediction;
}

const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ prediction }) => {
  console.log("Rendering AI Analysis section with:", prediction?.aiAnalysis);
  
  // Add extra validation for the aiAnalysis object and its properties
  if (!prediction.aiAnalysis || 
      !prediction.aiAnalysis.supporting || 
      !prediction.aiAnalysis.counter ||
      !Array.isArray(prediction.aiAnalysis.supporting) ||
      !Array.isArray(prediction.aiAnalysis.counter)) {
    console.warn("Missing or invalid aiAnalysis in prediction object", prediction);
    
    // Create a default aiAnalysis object to prevent UI errors
    prediction.aiAnalysis = {
      reasoning: prediction.aiAnalysis?.reasoning || "Analysis based on current market conditions.",
      supporting: Array.isArray(prediction.aiAnalysis?.supporting) ? prediction.aiAnalysis.supporting : ["Technical indicators are favorable", "Market sentiment aligns with this direction", "Recent price action supports this view"],
      counter: Array.isArray(prediction.aiAnalysis?.counter) ? prediction.aiAnalysis.counter : ["Market volatility is a risk factor", "External events could change the outcome", "Profit-taking could limit gains"]
    };
  }
  
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Brain className="mr-2 h-5 w-5 text-indigo-500" />
        AI Analysis
      </h3>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg mb-6">
        <p className="italic text-slate-700 dark:text-slate-300">
          "{prediction.aiAnalysis.reasoning}"
        </p>
      </div>

      <Tabs defaultValue="supporting" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="supporting" className="flex-1">
            <SupportingFactors.Icon />
            Supporting Factors
          </TabsTrigger>
          <TabsTrigger value="counter" className="flex-1">
            <CounterFactors.Icon />
            Counter Factors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="supporting" className="mt-4 border rounded-lg p-0 bg-white dark:bg-slate-950 overflow-hidden">
          <SupportingFactors prediction={prediction} />
        </TabsContent>
        <TabsContent value="counter" className="mt-4 border rounded-lg p-0 bg-white dark:bg-slate-950 overflow-hidden">
          <CounterFactors prediction={prediction} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalysisSection;
