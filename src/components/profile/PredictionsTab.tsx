
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">View your prediction history and results</p>
            <Link to="/app/predictions/history">
              <Button variant="outline">View All Predictions</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionsTab;
