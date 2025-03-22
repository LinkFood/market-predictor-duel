
import React, { useEffect, useState } from "react";
import { Brain, LineChart, BookMarked, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalyzingProgressProps {
  onComplete: () => void;
}

const AnalyzingProgress: React.FC<AnalyzingProgressProps> = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate AI analysis loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return newProgress;
      });
    }, 600);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>AI Analyzing Your Prediction</CardTitle>
        <CardDescription>
          Our AI is crunching the numbers and analyzing market trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center py-6">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analyzing market data...</span>
            <span>{Math.round(loadingProgress)}%</span>
          </div>
          <Progress value={loadingProgress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span className="text-sm">Reviewing technical indicators</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <LineChart className="h-4 w-4" />
            <span className="text-sm">Checking price patterns</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookMarked className="h-4 w-4" />
            <span className="text-sm">Reading market news</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart className="h-4 w-4" />
            <span className="text-sm">Processing historical data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyzingProgress;
