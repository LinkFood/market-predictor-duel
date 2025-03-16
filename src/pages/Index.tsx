import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, TrendingUp, BrainCircuit, Trophy, 
  ChevronRight, Check, BarChart2, ArrowRight, 
  Users, Sparkles, ChevronDown, Smartphone,
  Sword, Brain, Zap, Award, Target, Lightning, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mockStockData } from "@/data/mockData";

// Mock testimonials
const testimonials = [
  {
    quote: "StockDuel finally made investing fun! Competing against AI keeps me engaged and I've learned so much.",
    author: "Jessica K.",
    title: "Retail Investor",
    avatar: ""
  },
  {
    quote: "The AI analysis helps me spot market trends I would have missed. My prediction accuracy has improved by 20%.",
    author: "Michael T.",
    title: "Day Trader",
    avatar: ""
  },
  {
    quote: "I use StockDuel with my finance students - it's an incredible tool for teaching market analysis.",
    author: "Prof. Sarah L.",
    title: "Finance Educator",
    avatar: ""
  }
];

// Mock features
const features = [
  {
    title: "Challenge AI",
    description: "Pit your market intuition against our sophisticated AI and see who predicts better",
    icon: <BrainCircuit className="h-5 w-5 text-indigo-500" />
  },
  {
    title: "Deep Analysis",
    description: "Get AI-powered insights about market trends, technical indicators, and news impact",
    icon: <BarChart2 className="h-5 w-5 text-indigo-500" />
  },
  {
    title: "Track Performance",
    description: "Monitor your prediction accuracy and compete on the global leaderboard",
    icon: <Trophy className="h-5 w-5 text-indigo-500" />
  },
  {
    title: "Learn & Improve",
    description: "Analyze why predictions succeeded or failed to sharpen your market understanding",
    icon: <Sparkles className="h-5 w-5 text-indigo-500" />
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Mock search function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = mockStockData
        .filter(stock => 
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      setSearchResults(results);
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav Bar */}
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-indigo-600">StockDuel</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hidden sm:block">Features</button>
            <button className="text-sm font-medium hidden sm:block">How it Works</button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex"
            >
              Log in
            </Button>
            <Button 
              onClick={() => navigate("/register")}
              className="sm:hidden"
              size="sm"
            >
              Sign Up
            </Button>
            <Button 
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hidden sm:inline-flex"
              size="sm"
            >
              Sign Up Free
            </Button>
            
            {/* Mobile menu button */}
            <div className="sm:hidden ml-2">
              <Button 
                variant="ghost" 
                className="p-1"
                onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden sm:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <button className="block w-full text-left py-2 text-sm font-medium">Features</button>
            <button className="block w-full text-left py-2 text-sm font-medium">How it Works</button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden py-16 md:py-24 lg:py-28 bg-gradient-to-br from-blue-900 via-indigo-800 to-violet-900 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-400 rounded-full filter blur-3xl animate-float-slow"></div>
        </div>
        
        {/* Animated stock chart lines in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 L10,45 L20,60 L30,35 L40,50 L50,25 L60,40 L70,30 L80,60 L90,40 L100,50" 
              fill="none" stroke="white" strokeWidth="0.5" 
              className="animate-draw-line"
            />
            <path d="M0,60 L10,50 L20,70 L30,55 L40,65 L50,45 L60,55 L70,40 L80,50 L90,30 L100,40" 
              fill="none" stroke="white" strokeWidth="0.5" 
              className="animate-draw-line-delayed"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-6 gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <Sword className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white uppercase">Human vs AI Battle</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mx-auto max-w-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200">
            Are You Smarter Than<br />
            <span className="relative inline-block">
              <span className="relative z-10">The Market AI?</span>
              <span className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-75 rounded-lg filter blur-sm"></span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mx-auto max-w-3xl mb-10 leading-relaxed">
            Make market predictions, challenge our AI, and prove your financial instincts 
            are better than algorithms. Earn points, climb the leaderboard, and claim bragging rights.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto mb-14">
            <Button 
              onClick={() => navigate("/register")}
              className="group relative overflow-hidden bg-white text-indigo-900 hover:text-indigo-800 hover:shadow-lg transition-all duration-300 h-14 px-8 font-bold text-lg"
              size="lg"
            >
              <span className="relative z-10 flex items-center">
                Start The Duel
                <Zap className="ml-2 h-5 w-5 text-amber-500 group-hover:animate-bounce" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="relative overflow-hidden h-14 border-2 border-white/50 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 font-bold text-lg"
              size="lg"
            >
              <span className="flex items-center">
                Watch Demo
                <ChevronRight className="ml-1 h-5 w-5 animate-pulse-slow" />
              </span>
            </Button>
          </div>
          
          {/* Ticker Search */}
          <div className="max-w-3xl mx-auto relative mb-10">
            <div className="absolute -top-20 right-8 transform rotate-12 opacity-50">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float-slow">
                <path d="M20 4L3 11L10 14L13 21L20 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute -bottom-16 left-10 transform -rotate-6 opacity-50">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
                <path d="M18 2L6 22M18 2L22 6M18 2L10 4.8M6 22L2 18M6 22L13.2 19.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <div className="relative z-20 bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-2xl border border-white/20 shadow-xl">
              <div className="text-center mb-3">
                <span className="text-xs md:text-sm font-medium text-white/80">READY TO CHALLENGE THE AI? START BY PICKING A STOCK</span>
              </div>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-300" />
                  <Input 
                    className="pl-12 h-14 text-base md:text-lg font-medium bg-white/20 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300" 
                    placeholder="Type any ticker (e.g., AAPL, TSLA, NVDA)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-indigo-600/20 rounded-r-xl pointer-events-none"></div>
                </div>
                <Button 
                  type="submit" 
                  className="h-14 mt-2 sm:mt-0 px-6 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <Target className="mr-2 h-5 w-5" />
                  <span className="whitespace-nowrap">Predict Now</span>
                </Button>
              </form>
              
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="text-xs text-white/60">Popular:</span>
                {["AAPL", "TSLA", "NVDA", "S&P 500", "AMZN", "BTC-USD"].map((ticker) => (
                  <Badge key={ticker} className="bg-white/10 hover:bg-white/20 text-white border-0 cursor-pointer transition-all" onClick={() => setSearchQuery(ticker)}>
                    {ticker}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Search results dropdown */}
            {(isSearching || searchResults.length > 0) && (
              <Card className="absolute mt-2 w-full z-50 shadow-xl border-0 overflow-hidden bg-gradient-to-b from-indigo-900 to-indigo-950 text-white">
                <CardContent className="p-0">
                  {isSearching ? (
                    <div className="p-6 text-center">
                      <div className="inline-flex items-center gap-3">
                        <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-cyan-200 animate-pulse">Scanning markets...</span>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-white/10">
                      {searchResults.map((stock, index) => (
                        <div 
                          key={index} 
                          className="p-4 flex justify-between items-center hover:bg-indigo-800/50 cursor-pointer transition-all"
                          onClick={() => navigate("/app/predict")}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              stock.changePercent >= 0 
                                ? "bg-emerald-500/20 text-emerald-300" 
                                : "bg-red-500/20 text-red-300"
                            }`}>
                              {stock.changePercent >= 0 ? (
                                <TrendingUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-lg">{stock.name}</div>
                              <div className="text-sm text-cyan-200">
                                ${stock.value.toFixed(2)} <span className={
                                  stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                                }>
                                  {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            className="bg-cyan-500 hover:bg-cyan-400 text-white border-0"
                            onClick={() => navigate("/app/predict")}
                          >
                            Challenge AI
                            <Sword className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-indigo-200">No results found</p>
                      <p className="text-xs text-indigo-300 mt-1">Try another ticker or select from the popular options</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-3 bg-indigo-950/80 text-center text-xs text-indigo-300 border-t border-white/10">
                  <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />
                  <span>Make a prediction and challenge the AI to prove your market instincts</span>
                </CardFooter>
              </Card>
            )}
          </div>
          
          {/* Battle Stats */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl blur-3xl"></div>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">27,419</div>
                <div className="text-xs text-cyan-200 uppercase tracking-wide mt-1 text-center">Predictions</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">52<span className="text-amber-400">%</span></div>
                <div className="text-xs text-cyan-200 uppercase tracking-wide mt-1 text-center">Human Win Rate</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">1,247</div>
                <div className="text-xs text-cyan-200 uppercase tracking-wide mt-1 text-center">Active Duelers</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">12,485</div>
                <div className="text-xs text-cyan-200 uppercase tracking-wide mt-1 text-center">Points</div>
              </div>
            </div>
          </div>
          
          {/* Live battle banner */}
          <div className="relative overflow-hidden max-w-lg mx-auto mb-12 bg-gradient-to-r from-blue-700/40 to-indigo-700/40 rounded-xl p-1">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative flex items-center justify-between bg-blue-950/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5 animate-ping"></div>
                  <div className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5"></div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Sword className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-cyan-200 uppercase tracking-wide">Live Battle</div>
                  <div className="text-sm text-white font-medium">163 humans challenging AI right now</div>
                </div>
              </div>
              <Button
                className="bg-blue-600/80 hover:bg-blue-500/80 backdrop-blur-sm text-white border border-blue-400/30"
                size="sm"
                onClick={() => navigate("/app/leaderboard")}
              >
                Join Battle
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="w-full py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge 
              className="mb-4"
              variant="outline"
            >
              HOW IT WORKS
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Predict, Challenge AI, and Win</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              StockDuel makes market prediction engaging and educational with a simple three-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Make a Prediction</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Choose a stock, index, or sector and predict if it will rise or fall within your selected timeframe.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Challenge the AI</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI makes its own prediction with detailed analysis. See if you can outsmart the algorithm.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Earn Points & Learn</h3>
              <p className="text-slate-600 dark:text-slate-400">
                When your prediction resolves, earn points for accuracy and beating the AI. Track your performance over time.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate("/app/predict")}
              className="bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              Start Making Predictions
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="w-full py-16 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge 
              className="mb-4"
              variant="outline"
            >
              FEATURES
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Improve Your Market Instincts</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              StockDuel combines game mechanics with sophisticated market analysis to enhance your investment skills
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="w-full py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge 
              className="mb-4"
              variant="outline"
            >
              TESTIMONIALS
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join thousands of users who are improving their market predictions with StockDuel
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-6 md:px-4">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="italic mb-4 sm:mb-6 text-sm sm:text-base text-slate-600 dark:text-slate-400">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                        {testimonial.author.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">{testimonial.author}</div>
                      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="w-full py-12 sm:py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Challenge the AI?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            Join StockDuel today and start improving your market prediction skills while having fun competing against our AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-md mx-auto">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-600 hover:bg-indigo-50 h-12 w-full"
              size="lg"
            >
              Sign Up Free
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-white text-white hover:bg-white/10 h-12 w-full"
              size="lg"
            >
              Log In
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 sm:py-10 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">StockDuel</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Market Data</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
                <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Email</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-slate-800 text-center text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
              <span className="font-bold text-white">StockDuel</span>
            </div>
            <p>© {new Date().getFullYear()} StockDuel. All rights reserved.</p>
            <p className="mt-2 text-xs">Financial disclaimer: StockDuel is for educational and entertainment purposes only. Not financial advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
