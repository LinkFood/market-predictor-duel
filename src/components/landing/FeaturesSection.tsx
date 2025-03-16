
import React from "react";
import { TrendingUp, BrainCircuit, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How StockDuel Works</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Test your market intuition against our advanced AI models in a fun, competitive environment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Make Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Predict market movements for stocks, indices, and sectors over different timeframes.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-2">
                <BrainCircuit className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Challenge AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                See if your predictions beat our advanced AI models trained on market data.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Climb the Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Earn points for correct predictions and compete with other users for the top spot.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
