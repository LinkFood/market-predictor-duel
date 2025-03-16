import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, ChevronRight, CheckCircle, User, Users, 
  BarChart3, BrainCircuit, ArrowRight, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockMarketData, mockStockData } from "@/data/mockData";
import MarketDataTable from "@/components/MarketDataTable";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-indigo-700 hover:bg-indigo-800 mb-4 px-3 py-1">
                  <Zap className="mr-1 h-3.5 w-3.5" />
                  <span>Now in Public Beta</span>
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Challenge AI in Stock Market Predictions
                </h1>
                <p className="text-xl mt-6 text-indigo-100 max-w-lg">
                  Test your market intuition against advanced AI models. Make predictions, track performance, and climb the leaderboard.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate("/register")}
                  className="bg-white text-indigo-700 hover:bg-indigo-50 text-lg"
                >
                  Get Started
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
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 pt-4 text-indigo-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-indigo-600 flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm">
                  Join <span className="font-bold">2,500+</span> users already making predictions
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
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
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-500/20 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
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
      
      {/* Market Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Current Market Overview</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Stay updated with the latest market movements
            </p>
          </div>
          
          <Tabs defaultValue="indices" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="indices" className="flex-1">Major Indices</TabsTrigger>
              <TabsTrigger value="stocks" className="flex-1">Popular Stocks</TabsTrigger>
            </TabsList>
            <TabsContent value="indices">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <MarketDataTable data={mockMarketData} title="" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stocks">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <MarketDataTable data={mockStockData.slice(0, 5)} title="" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate("/register")}>
              Sign Up to Make Predictions
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join thousands of users already improving their market prediction skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Thompson",
                role: "Retail Investor",
                quote: "StockDuel has completely changed how I think about market movements. Competing against the AI has sharpened my analysis skills.",
                avatar: "AT"
              },
              {
                name: "Sarah Chen",
                role: "Finance Student",
                quote: "I use StockDuel to test theories I learn in class. It's like having a trading simulator with AI feedback built in!",
                avatar: "SC"
              },
              {
                name: "Michael Rodriguez",
                role: "Day Trader",
                quote: "The immediate feedback on my predictions helps me identify my biases. I've become much more disciplined in my approach.",
                avatar: "MR"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Challenge the AI?</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of users testing their market prediction skills against our advanced AI models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-700 hover:bg-indigo-50"
            >
              Create Free Account
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
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <TrendingUp className="h-6 w-6 text-indigo-500 mr-2" />
              <span className="text-white font-bold text-xl">StockDuel</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <Separator className="bg-slate-800 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">© 2023 StockDuel. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
