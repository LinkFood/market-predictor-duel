
import React from "react";
import { ArrowUp, ArrowDown, Newspaper } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prediction } from "@/types";

interface AnalysisTabsProps {
  prediction: Prediction;
}

interface MarketNews {
  title: string;
  source: string;
  date: string;
  relevant: boolean;
}

export const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ prediction }) => {
  const marketNews: MarketNews[] = [
    {
      title: "Fed signals potential rate cut in upcoming meeting",
      source: "Market Watch",
      date: "2 days ago",
      relevant: true
    },
    {
      title: `${prediction.targetName} reports stronger than expected earnings`,
      source: "Financial Times",
      date: "1 day ago",
      relevant: true
    },
    {
      title: "Inflation data shows cooling consumer prices",
      source: "Bloomberg",
      date: "3 days ago",
      relevant: false
    }
  ];

  return (
    <Tabs defaultValue="supporting" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="supporting" className="flex-1">
          <ArrowUp className={`h-4 w-4 mr-2 ${
            prediction.aiPrediction === "bullish" 
              ? "text-emerald-500" 
              : "text-red-500"
          }`} />
          Supporting Factors
        </TabsTrigger>
        <TabsTrigger value="counter" className="flex-1">
          <ArrowDown className={`h-4 w-4 mr-2 ${
            prediction.aiPrediction === "bullish" 
              ? "text-red-500" 
              : "text-emerald-500"
          }`} />
          Counter Factors
        </TabsTrigger>
        {prediction.resolved && <TabsTrigger value="news" className="flex-1">
          <Newspaper className="h-4 w-4 mr-2 text-indigo-500" />
          Market Context
        </TabsTrigger>}
      </TabsList>
      
      <TabsContent value="supporting" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
        <div className="space-y-3">
          {prediction.aiAnalysis.supporting.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`h-6 w-6 rounded-full ${
                prediction.aiPrediction === "bullish" 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              } flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs`}>
                {idx + 1}
              </div>
              <p className="text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="counter" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
        <div className="space-y-3">
          {prediction.aiAnalysis.counter.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`h-6 w-6 rounded-full ${
                prediction.aiPrediction === "bullish" 
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              } flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs`}>
                {idx + 1}
              </div>
              <p className="text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </TabsContent>
      
      {prediction.resolved && (
        <TabsContent value="news" className="mt-4 border rounded-lg p-4 bg-white dark:bg-slate-950">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              News and events that influenced this price movement:
            </p>
            {marketNews.map((news, idx) => (
              <div key={idx} className="border rounded p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{news.title}</h4>
                  {news.relevant && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-xs">
                      Key Factor
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.date}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};
