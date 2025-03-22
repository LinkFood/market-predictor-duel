
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Prediction } from "@/lib/prediction/types";
import { getUserPredictions } from "@/lib/prediction/user-predictions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PredictionCard from "@/components/PredictionCard";
import { supabase } from "@/integrations/supabase/client";

interface PredictionsTabProps {
  isLoading: boolean;
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({ isLoading: initialLoading }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("PredictionsTab: Checking user authentication status");
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData || !userData.user) {
          console.log("PredictionsTab: No authenticated user found");
          setLoading(false);
          return;
        }
        
        console.log("PredictionsTab: Fetching user predictions");
        const userPredictions = await getUserPredictions();
        console.log("PredictionsTab: Received predictions:", userPredictions);
        
        setPredictions(userPredictions.slice(0, 5)); // Display the 5 most recent predictions
      } catch (error) {
        console.error("Error fetching user predictions:", error);
        setError("Failed to load predictions");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
        <CardDescription>Your recent market predictions and their outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <Button variant="outline" onClick={() => location.reload()}>Retry</Button>
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">You haven't made any predictions yet</p>
            <Link to="/app/predict">
              <Button variant="outline">Make Your First Prediction</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} compact />
            ))}
            <div className="pt-2 text-center">
              <Link to="/app/predictions/history">
                <Button variant="outline">View All Predictions</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionsTab;
