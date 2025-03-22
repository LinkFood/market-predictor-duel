
import React from "react";
import { Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prediction } from "@/types";
import SupportingFactors from "./SupportingFactors";
import CounterFactors from "./CounterFactors";

interface AIAnalysisSectionProps {
  prediction: Prediction;
}

const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ prediction }) => {
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
