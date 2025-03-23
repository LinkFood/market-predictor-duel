/**
 * AIOpponentProfile Component
 * Displays information about an AI opponent
 */
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Zap, TrendingUp, Clock, Target, BarChart4 } from "lucide-react";
import { AIPersonality } from "@/lib/duel/types";
import { getAIPersonality } from "@/lib/duel/ai-personalities";
import { motion } from "framer-motion";

interface AIOpponentProfileProps {
  personalityId: AIPersonality;
  wins?: number;
  losses?: number;
  totalCompetitions?: number;
}

const AIOpponentProfile: React.FC<AIOpponentProfileProps> = ({ 
  personalityId,
  wins = 0,
  losses = 0,
  totalCompetitions = 0
}) => {
  // Get AI personality profile
  const personality = getAIPersonality(personalityId);
  
  // Calculate win rate
  const winRate = totalCompetitions > 0 
    ? ((wins / totalCompetitions) * 100).toFixed(1) 
    : "0.0";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {personality.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-2xl">{personality.name}</CardTitle>
              <CardDescription className="text-white/80">
                {personality.id}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex justify-center mt-2">
            <Badge variant="outline" className="bg-white/10 text-white border-white/30">
              {personality.riskTolerance === 'low' ? 'Conservative' :
               personality.riskTolerance === 'medium' ? 'Moderate' : 'Aggressive'} Investor
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 mb-6">
            {personality.description}
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2 text-indigo-600" />
              Trading Style
            </h3>
            <p className="text-gray-600">{personality.tradingStyle}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-green-600" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {personality.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <X className="w-5 h-5 mr-2 text-red-600" />
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {personality.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <X className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <BarChart4 className="w-5 h-5 mr-2 text-indigo-600" />
              Preferred Sectors
            </h3>
            <div className="flex flex-wrap gap-2">
              {personality.favoredSectors.map((sector, index) => (
                <Badge key={index} variant="secondary">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{totalCompetitions}</p>
              <p className="text-sm text-gray-500">Total Competitions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{wins}</p>
              <p className="text-sm text-gray-500">AI Victories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{winRate}%</p>
              <p className="text-sm text-gray-500">Win Rate</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="italic text-gray-600 text-center">
              "{personality.catchphrase}"
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIOpponentProfile;