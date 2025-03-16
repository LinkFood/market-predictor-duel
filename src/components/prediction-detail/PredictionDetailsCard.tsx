
import React from "react";
import { Target, BarChart, Clock, Calendar, Award, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prediction } from "@/types";
import { useNavigate } from "react-router-dom";

interface PredictionDetailsCardProps {
  prediction: Prediction;
  formatDate: (dateString: string) => string;
  getTimeframeText: (timeframe: string) => string;
}

export const PredictionDetailsCard: React.FC<PredictionDetailsCardProps> = ({
  prediction, 
  formatDate,
  getTimeframeText
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <CardTitle className="text-base font-semibold">Prediction Details</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        <div className="py-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Target</div>
                <div className="font-medium">{prediction.targetName}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BarChart className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Category</div>
                <div className="font-medium capitalize">{prediction.targetType}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Timeframe</div>
                <div className="font-medium">{getTimeframeText(prediction.timeframe)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Created</div>
                <div className="font-medium">{formatDate(prediction.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-indigo-500 mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Resolves</div>
                <div className="font-medium">{formatDate(prediction.resolvesAt)}</div>
              </div>
            </div>
            {prediction.resolved && prediction.resolvedAt && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-indigo-500 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                  <div className="font-medium">{formatDate(prediction.resolvedAt)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        {prediction.resolved && prediction.winner === "user" && (
          <div className="py-3">
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Points Earned</div>
                <div className="font-medium text-indigo-600 dark:text-indigo-400">+50 points</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
