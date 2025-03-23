
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, TrendingUp, Trophy, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { mockGlobalStats } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo Bracket Card
const DemoBracketCard = () => {
  return (
    <Card className="shadow-xl overflow-hidden border-0 bg-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold">Weekly Stock Duel</h3>
            <p className="text-sm text-white/80">You vs. ValueHunter AI</p>
          </div>
          <Badge className="bg-green-600">Live Now</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Your Picks</span>
              <span className="font-bold text-green-300">+5.2%</span>
            </div>
            <div className="space-y-2">
              {["AAPL", "NVDA", "MSFT"].map((stock, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{stock}</span>
                  <Badge variant={i !== 2 ? "outline" : "destructive"} className="text-xs">
                    {i === 0 ? "+3.2%" : i === 1 ? "+8.1%" : "-4.6%"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">AI Picks</span>
              <span className="font-bold text-red-300">+2.9%</span>
            </div>
            <div className="space-y-2">
              {["AMZN", "GOOGL", "TSLA"].map((stock, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{stock}</span>
                  <Badge variant="outline" className="text-xs">
                    {i === 0 ? "+1.8%" : i === 1 ? "+4.3%" : "+2.5%"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-white/70">
            <span>2 days remaining</span>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-blue-500/20 border-blue-500/40">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>YOU'RE WINNING</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Live Stats Component
const LiveStats = () => {
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      <div className="bg-white/10 rounded-lg p-3 text-center">
        <div className="text-3xl font-bold">{mockGlobalStats.totalDuels.toLocaleString()}</div>
        <div className="text-xs text-white/70">Total Duels</div>
      </div>
      <div className="bg-white/10 rounded-lg p-3 text-center">
        <div className="text-3xl font-bold text-green-300">{mockGlobalStats.humanWinRate}%</div>
        <div className="text-xs text-white/70">Human Win Rate</div>
      </div>
      <div className="bg-white/10 rounded-lg p-3 text-center">
        <div className="text-3xl font-bold text-yellow-300">{mockGlobalStats.topHumanScore}</div>
        <div className="text-xs text-white/70">Top Human Score</div>
      </div>
    </div>
  );
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("demo");

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-indigo-700 hover:bg-indigo-800 mb-4 px-3 py-1">
              <Zap className="mr-1 h-3.5 w-3.5" />
              <span>New Stock Duel Tournament</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Beat AI in Stock Market Duels
            </h1>
            <p className="text-xl mt-6 text-indigo-100 max-w-2xl mx-auto">
              Challenge our advanced AI models in head-to-head stock picking competitions.
              Create brackets, track performance, and prove humans still beat machines.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Tabs defaultValue="demo" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="demo">See it in Action</TabsTrigger>
                <TabsTrigger value="stats">Live Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demo" className="mt-0">
                <DemoBracketCard />
                <div className="mt-4 text-center">
                  <Button variant="link" className="text-white/80 hover:text-white gap-1 text-sm">
                    How duels work <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="mt-0">
                <Card className="shadow-xl overflow-hidden border-0 bg-white/10 backdrop-blur-sm p-4">
                  <h3 className="text-xl font-bold mb-2">Human vs AI Battle Stats</h3>
                  <div className="mb-4">
                    <div className="h-8 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end pr-2"
                        style={{ width: `${mockGlobalStats.humanWinRate}%` }}
                      >
                        <span className="text-xs font-bold">Humans</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Humans: {mockGlobalStats.humansWon} wins</span>
                      <span>AI: {mockGlobalStats.aiWon} wins</span>
                    </div>
                  </div>
                  <LiveStats />
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-500/20 rounded-full blur-xl"></div>
          </motion.div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-300" />
                  <h3 className="font-bold">Pick Stocks</h3>
                  <p className="text-sm text-white/70">Choose your best stock picks</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                  <h3 className="font-bold">AI Competes</h3>
                  <p className="text-sm text-white/70">Our AI makes its own picks</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <h3 className="font-bold">Win Duels</h3>
                  <p className="text-sm text-white/70">Earn points and climb ranks</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/register")}
                  className="bg-white text-indigo-700 hover:bg-indigo-50 text-lg"
                >
                  Start Your First Duel
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="border-indigo-200 text-white hover:bg-indigo-700 text-lg"
                >
                  Sign In
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 pt-6 text-indigo-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-indigo-600 flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm">
                  Join <span className="font-bold">2,500+</span> users already dueling AI
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
