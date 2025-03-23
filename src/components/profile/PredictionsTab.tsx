
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, TrendingDown, AlertCircle, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Prediction {
  id: string;
  ticker: string;
  target_name: string;
  user_prediction: string;
  ai_prediction: string;
  status: string;
  outcome: string | null;
  timeframe: string;
  created_at: string;
  resolves_at: string;
  points: number | null;
}

interface PredictionsTabProps {
  isLoading: boolean;
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({ isLoading }) => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    const fetchPredictions = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching predictions:", error);
          return;
        }
        
        setPredictions(data || []);
      } catch (error) {
        console.error("Unexpected error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!isLoading) {
      fetchPredictions();
    }
  }, [user, isLoading]);
  
  const filterPredictions = (status: string) => {
    if (status === 'all') return predictions;
    if (status === 'win') return predictions.filter(p => p.outcome === 'user_win');
    if (status === 'loss') return predictions.filter(p => p.outcome === 'ai_win');
    return predictions.filter(p => p.status === status);
  };
  
  const getOutcomeIcon = (prediction: Prediction) => {
    if (prediction.status === 'pending') {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    
    if (prediction.outcome === 'user_win') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    
    if (prediction.outcome === 'ai_win') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    
    return <AlertCircle className="h-4 w-4 text-gray-500" />;
  };
  
  const getOutcomeText = (prediction: Prediction) => {
    if (prediction.status === 'pending') {
      return 'Pending';
    }
    
    if (prediction.outcome === 'user_win') {
      return `Won +${prediction.points || 0}`;
    }
    
    if (prediction.outcome === 'ai_win') {
      return 'Lost';
    }
    
    return 'Tie';
  };
  
  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case 'daily':
        return '1D';
      case 'weekly':
        return '1W';
      case 'monthly':
        return '1M';
      default:
        return timeframe;
    }
  };
  
  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  const filteredPredictions = filterPredictions(activeTab);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Your Predictions</h3>
          <p className="text-sm text-muted-foreground">
            Track your prediction history and performance
          </p>
        </div>
        <Link to="/app/predict">
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            New Prediction
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="win">Wins</TabsTrigger>
          <TabsTrigger value="loss">Losses</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredPredictions.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No predictions found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'all' 
                  ? "You haven't made any predictions yet." 
                  : `You don't have any ${activeTab} predictions.`}
              </p>
              {activeTab === 'all' && (
                <Link to="/app/predict">
                  <Button>Make Your First Prediction</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredPredictions.map((prediction) => (
                <Link
                  key={prediction.id}
                  to={`/app/predictions/${prediction.id}`}
                  className="flex justify-between items-center py-4 hover:bg-accent/50 px-2 rounded-md transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      prediction.status === 'complete' && prediction.outcome === 'user_win'
                        ? 'bg-green-100 text-green-800' 
                        : prediction.status === 'complete' && prediction.outcome === 'ai_win'
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {prediction.ticker.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{prediction.target_name || prediction.ticker}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{prediction.user_prediction}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {getTimeframeLabel(prediction.timeframe)}
                        </Badge>
                        <span>•</span>
                        <span>{new Date(prediction.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {getOutcomeIcon(prediction)}
                      <span className={`ml-1 text-sm ${
                        prediction.status === 'complete' && prediction.outcome === 'user_win'
                          ? 'text-green-600' 
                          : prediction.status === 'complete' && prediction.outcome === 'ai_win'
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}>
                        {getOutcomeText(prediction)}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictionsTab;
