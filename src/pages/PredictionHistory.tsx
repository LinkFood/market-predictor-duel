
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Prediction } from "@/types";
import { mockPredictions } from "@/data/mockData";

const PredictionHistory: React.FC = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch from the API
    // For now, we'll use the mock data
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock data for now
        setPredictions(mockPredictions);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [user?.id]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Prediction History</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : predictions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-medium">No predictions yet</h3>
          <p className="text-gray-600 mt-2">Make your first prediction to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="border rounded-lg shadow-sm p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{prediction.targetName}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  prediction.status === 'complete' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {prediction.status === 'complete' ? 'Completed' : 'Pending'}
                </span>
              </div>
              
              <div className="flex justify-between mb-3 text-sm text-gray-600">
                <span>Your prediction: {prediction.userPrediction}</span>
                <span>AI prediction: {prediction.aiPrediction}</span>
              </div>
              
              {prediction.status === 'complete' && (
                <div className="border-t pt-2 mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Result: </span>
                    <span className={`${
                      prediction.winner === 'user' 
                        ? 'text-green-600' 
                        : prediction.winner === 'ai'
                          ? 'text-red-600'
                          : 'text-blue-600'
                    }`}>
                      {prediction.winner === 'user' 
                        ? 'You won!' 
                        : prediction.winner === 'ai'
                          ? 'AI won'
                          : 'Tie'}
                    </span>
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-3">
                {new Date(prediction.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
