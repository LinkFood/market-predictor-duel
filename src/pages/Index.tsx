import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, TrendingUp, BrainCircuit, Trophy, 
  ChevronRight, Check, BarChart2, ArrowRight, 
  Users, Sparkles, ChevronDown, Smartphone
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <Badge 
            className="mb-5 mx-auto bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-200"
            variant="outline"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            BEAT THE MARKET AI
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mx-auto max-w-4xl mb-6">
            Predict Market Moves. <span className="text-indigo-600 dark:text-indigo-400">Compete</span> with AI.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mx-auto max-w-2xl mb-8">
            Make stock market predictions and challenge our AI to see who's better at forecasting the market. Learn, improve, and climb the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto mb-14">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 h-12 px-8"
              size="lg"
            >
              Start Predicting Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="h-12 border-2"
              size="lg"
            >
              Learn How It Works
            </Button>
          </div>
          
          {/* Ticker Search */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    className="pl-10 h-12 text-base shadow-md rounded-full" 
                    placeholder="Search for a stock ticker (e.g., AAPL, MSFT, TSLA)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="rounded-full h-12 px-6 bg-indigo-600 hover:bg-indigo-700"
                >
                  Predict
                </Button>
              </form>
            </div>
            
            {/* Search results dropdown */}
            {(isSearching || searchResults.length > 0) && (
              <Card className="absolute mt-2 w-full z-50 shadow-lg border-0 overflow-hidden">
                <CardContent className="p-0">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="h-6 w-6 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y">
                      {searchResults.map((stock, index) => (
                        <div 
                          key={index} 
                          className="p-3 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                          onClick={() => navigate("/app/predict")}
                        >
                          <div>
                            <div className="font-medium">{stock.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {stock.value.toFixed(2)} USD
                            </div>
                          </div>
                          <Button size="sm" onClick={() => navigate("/app/predict")}>
                            Predict
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-3 bg-slate-50 dark:bg-slate-800 text-center text-xs text-muted-foreground">
                  Try searching for stocks, indices, or sectors
                </CardFooter>
              </Card>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center max-w-3xl mx-auto mb-12">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">27,419</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Predictions Made</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">52%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Human Win Rate</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">1,247</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">12,485</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Points Awarded</div>
            </div>
          </div>
          
          {/* Mobile app teaser */}
          <div className="flex justify-center">
            <Badge 
              className="mb-5 mx-auto"
              variant="outline"
            >
              <Smartphone className="h-3.5 w-3.5 mr-1" />
              AVAILABLE ON MOBILE
            </Badge>
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
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
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
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="italic mb-6 text-slate-600 dark:text-slate-400">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        {testimonial.author.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="w-full py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Challenge the AI?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Join StockDuel today and start improving your market prediction skills while having fun competing against our AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-600 hover:bg-indigo-50 h-12"
              size="lg"
            >
              Sign Up Free
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-white text-white hover:bg-white/10 h-12"
              size="lg"
            >
              Log In
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-10 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">StockDuel</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Market Data</a></li>
                <li><a href="#" className="hover:text-white">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Email</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <span className="font-bold text-white">StockDuel</span>
            </div>
            <p>© {new Date().getFullYear()} StockDuel. All rights reserved.</p>
            <p className="mt-2">Financial disclaimer: StockDuel is for educational and entertainment purposes only. Not financial advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
