
import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PredictionCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-indigo-400/20">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-xl">S&P 500 Prediction</h3>
          <p className="text-indigo-200 text-sm">24 hour forecast</p>
        </div>
        <Badge className="bg-emerald-500 hover:bg-emerald-600">Bullish</Badge>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-700/50 rounded-lg p-3">
            <p className="text-indigo-200 text-xs">Your Prediction</p>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-5 w-5 text-emerald-400 mr-1" />
              <span className="font-bold">Bullish (+1.2%)</span>
            </div>
          </div>
          <div className="bg-indigo-700/50 rounded-lg p-3">
            <p className="text-indigo-200 text-xs">AI Prediction</p>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-5 w-5 text-emerald-400 mr-1" />
              <span className="font-bold">Bullish (+0.8%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-700/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Confidence Level</p>
            <span className="text-sm font-bold">8/10</span>
          </div>
          <div className="w-full bg-indigo-800 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "80%" }}></div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            className="w-full bg-indigo-500 hover:bg-indigo-600"
            onClick={() => navigate("/register")}
          >
            Make Your Own Prediction
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
