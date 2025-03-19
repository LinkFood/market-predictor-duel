
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PredictionsTabProps {
  isLoading: boolean;
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({ isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
        <CardDescription>Your recent market predictions and their outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-indigo-600"></div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Recent predictions will be displayed here.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionsTab;
