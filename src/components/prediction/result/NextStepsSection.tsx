
import React from "react";
import { Clock, Timer, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prediction } from "@/lib/prediction/types"; // Updated import path

interface NextStepsSectionProps {
  prediction: Prediction;
}

const NextStepsSection: React.FC<NextStepsSectionProps> = ({ prediction }) => {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
      <h3 className="font-semibold mb-3 flex items-center">
        <Clock className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        What Happens Next
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
        Your prediction will be automatically evaluated when it reaches its end date. 
        We'll notify you of the results and award points if you beat the AI!
      </p>
      <div className="flex items-center">
        <Badge variant="outline" className="bg-white dark:bg-slate-800">
          <Timer className="mr-1 h-3.5 w-3.5" />
          Resolves: {new Date(prediction?.resolvesAt || "").toLocaleDateString()} 
        </Badge>
        <Button variant="ghost" size="sm" className="ml-auto gap-1 h-8">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default NextStepsSection;
