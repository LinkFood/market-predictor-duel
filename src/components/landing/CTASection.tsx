
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Join the Stock Duel Tournament</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Compete in our weekly and monthly stock picking tournaments against our advanced AI models. 
              Show the world that human intuition still beats machine learning.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Global Leaderboard</h3>
                  <p className="text-indigo-100">Climb the ranks and earn badges as you defeat AI opponents</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-2 mt-1">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Bracket Tournaments</h3>
                  <p className="text-indigo-100">Create brackets with different timeframes and compete against various AI personalities</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
                className="bg-white text-indigo-700 hover:bg-indigo-50"
              >
                Start Dueling Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/login")}
                className="border-indigo-200 text-white hover:bg-indigo-700"
              >
                Sign In
              </Button>
            </div>
          </div>
          
          <Card className="bg-white/10 border-0 shadow-xl p-6 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Weekly Tournament</h3>
            <p className="mb-6">Enter this week's bracket tournament for a chance to earn top rankings!</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between pb-2 border-b border-white/20">
                <span>Tournament Size:</span>
                <span className="font-bold">3-stock bracket</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/20">
                <span>Duration:</span>
                <span className="font-bold">7 days</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/20">
                <span>Current Leader:</span>
                <span className="font-bold">TradeMaster</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/20">
                <span>Prize:</span>
                <span className="font-bold">500 points + Badge</span>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate("/register")}
              className="w-full bg-white text-indigo-700 hover:bg-indigo-50"
            >
              Join Tournament
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
