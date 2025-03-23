/**
 * BracketForm Component
 * Allows users to create a new bracket competition
 */
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Calendar, 
  Swords, 
  Trophy, 
  BarChart, 
  Zap,
  Sparkles
} from "lucide-react";
import { searchStocks } from "@/lib/market";
import { AIPersonality, BracketSize, BracketTimeframe, Direction } from "@/lib/duel/types";
import { getAllAIPersonalities } from "@/lib/duel/ai-personalities";
import { motion, AnimatePresence } from "framer-motion";
import { StockData } from "@/lib/market/types";

interface BracketFormProps {
  onCreateBracket: (
    timeframe: BracketTimeframe,
    size: BracketSize,
    entries: { symbol: string; direction: Direction }[],
    aiPersonality?: AIPersonality
  ) => Promise<void>;
}

interface StockEntry {
  symbol: string;
  name: string;
  direction: Direction;
}

const BracketForm: React.FC<BracketFormProps> = ({ onCreateBracket }) => {
  // State for form
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<StockEntry[]>([]);
  const [timeframe, setTimeframe] = useState<BracketTimeframe>("weekly");
  const [bracketSize, setBracketSize] = useState<BracketSize>(3);
  const [selectedAI, setSelectedAI] = useState<AIPersonality | undefined>(undefined);
  
  // UI state
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiSelection, setShowAiSelection] = useState(false);
  
  const { toast } = useToast();
  
  // Load AI personalities
  const aiPersonalities = getAllAIPersonalities();
  
  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Perform stock search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await searchStocks(searchQuery, 10);
      if (result && result.results) {
        setSearchResults(result.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching stocks:", error);
      toast({
        title: "Search Error",
        description: "Unable to search for stocks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle enter key in search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  // Add stock to selected list
  const handleAddStock = (stock: StockData) => {
    // Check if we already have maximum stocks
    if (selectedStocks.length >= bracketSize) {
      toast({
        title: "Bracket Full",
        description: `You can only select ${bracketSize} stocks for this bracket size.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check if stock is already selected
    if (selectedStocks.some(s => s.symbol === stock.symbol)) {
      toast({
        title: "Already Selected",
        description: `${stock.symbol} is already in your bracket.`,
        variant: "destructive",
      });
      return;
    }
    
    // Add stock with default bullish direction
    setSelectedStocks([
      ...selectedStocks,
      {
        symbol: stock.symbol,
        name: stock.name || stock.symbol,
        direction: 'bullish'
      }
    ]);
    
    // Clear search results
    setSearchResults([]);
    setSearchQuery("");
  };
  
  // Remove stock from selected list
  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
  };
  
  // Toggle stock direction
  const toggleDirection = (symbol: string) => {
    setSelectedStocks(selectedStocks.map(stock => 
      stock.symbol === symbol
        ? { ...stock, direction: stock.direction === 'bullish' ? 'bearish' : 'bullish' }
        : stock
    ));
  };
  
  // Handle bracket size change
  const handleSizeChange = (size: string) => {
    const newSize = parseInt(size) as BracketSize;
    setBracketSize(newSize);
    
    // If current selections exceed new size, trim the excess
    if (selectedStocks.length > newSize) {
      setSelectedStocks(selectedStocks.slice(0, newSize));
      toast({
        title: "Stocks Removed",
        description: `Some stocks were removed to fit the new bracket size.`,
        variant: "default",
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate that we have the correct number of stocks
    if (selectedStocks.length !== bracketSize) {
      toast({
        title: "Incomplete Bracket",
        description: `Please select exactly ${bracketSize} stocks for your bracket.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Format entries for submission
      const entries = selectedStocks.map(stock => ({
        symbol: stock.symbol,
        direction: stock.direction
      }));
      
      // Create the bracket
      await onCreateBracket(timeframe, bracketSize, entries, selectedAI);
      
      // Success message
      toast({
        title: "Bracket Created!",
        description: `Your ${timeframe} bracket with ${bracketSize} stocks has been created.`,
        variant: "default",
      });
      
      // Reset form
      setSelectedStocks([]);
      setSelectedAI(undefined);
      
    } catch (error) {
      console.error("Error creating bracket:", error);
      toast({
        title: "Bracket Creation Failed",
        description: "Unable to create your bracket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-2"
        >
          <Swords className="h-8 w-8 mr-3" />
          <CardTitle className="text-3xl font-bold">Create New Duel</CardTitle>
        </motion.div>
        <CardDescription className="text-white/90 text-lg">
          Select your stocks and challenge AI to a trading battle
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 pt-8 relative">
        <motion.div 
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-900 shadow-lg rounded-full px-6 py-2 flex items-center gap-2 border-2 border-blue-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-lg">AI Challenge Settings</span>
        </motion.div>
        
        <div className="space-y-8">
          {/* Timeframe & Size Selection in visually appealing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Timeframe Selection */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Duel Duration</h3>
              </div>
              
              <RadioGroup 
                defaultValue={timeframe} 
                onValueChange={(value) => setTimeframe(value as BracketTimeframe)}
                className="grid grid-cols-3 gap-2"
              >
                <Label 
                  htmlFor="daily" 
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${timeframe === 'daily' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200'} 
                    hover:border-blue-300 cursor-pointer
                  `}
                >
                  <Clock className="h-6 w-6 mb-1 text-blue-600" />
                  <RadioGroupItem value="daily" id="daily" className="sr-only" />
                  <span className="font-medium">Daily</span>
                  <span className="text-xs text-gray-500">24 hours</span>
                </Label>
                
                <Label 
                  htmlFor="weekly" 
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${timeframe === 'weekly' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200'} 
                    hover:border-blue-300 cursor-pointer
                  `}
                >
                  <Calendar className="h-6 w-6 mb-1 text-blue-600" />
                  <RadioGroupItem value="weekly" id="weekly" className="sr-only" />
                  <span className="font-medium">Weekly</span>
                  <span className="text-xs text-gray-500">7 days</span>
                </Label>
                
                <Label 
                  htmlFor="monthly" 
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${timeframe === 'monthly' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200'} 
                    hover:border-blue-300 cursor-pointer
                  `}
                >
                  <BarChart className="h-6 w-6 mb-1 text-blue-600" />
                  <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                  <span className="font-medium">Monthly</span>
                  <span className="text-xs text-gray-500">30 days</span>
                </Label>
              </RadioGroup>
            </div>
            
            {/* Bracket Size Selection */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Swords className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Stock Count</h3>
              </div>
              
              <RadioGroup 
                defaultValue={bracketSize.toString()} 
                onValueChange={handleSizeChange}
                className="grid grid-cols-3 gap-2"
              >
                <Label 
                  htmlFor="size-3" 
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${bracketSize === 3 ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200'} 
                    hover:border-purple-300 cursor-pointer
                  `}
                >
                  <div className="font-bold text-2xl text-purple-600">3</div>
                  <RadioGroupItem value="3" id="size-3" className="sr-only" />
                  <span className="font-medium">Quick</span>
                  <span className="text-xs text-gray-500">3 stocks</span>
                </Label>
                
                <Label 
                  htmlFor="size-6" 
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${bracketSize === 6 ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200'} 
                    hover:border-purple-300 cursor-pointer
                  `}
                >
                  <div className="font-bold text-2xl text-purple-600">6</div>
                  <RadioGroupItem value="6" id="size-6" className="sr-only" />
                  <span className="font-medium">Standard</span>
                  <span className="text-xs text-gray-500">6 stocks</span>
                </Label>
                
                <Label 
                  htmlFor="size-9" 
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${bracketSize === 9 ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200'} 
                    hover:border-purple-300 cursor-pointer
                  `}
                >
                  <div className="font-bold text-2xl text-purple-600">9</div>
                  <RadioGroupItem value="9" id="size-9" className="sr-only" />
                  <span className="font-medium">Pro</span>
                  <span className="text-xs text-gray-500">9 stocks</span>
                </Label>
              </RadioGroup>
              
              <p className="text-sm text-center text-indigo-700 dark:text-indigo-400 mt-2 font-medium">
                Your challenge: Select {bracketSize} stocks that will outperform AI
              </p>
            </div>
          </div>
          
          {/* Stock Selection Section */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">Select Your Stocks</h3>
              <div className="ml-auto px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium">
                {selectedStocks.length}/{bracketSize} Selected
              </div>
            </div>
            
            {/* Search Field */}
            <div className="flex space-x-2 mb-4">
              <div className="relative flex-1">
                <Input
                  id="stock-search"
                  placeholder="Search by ticker or company name (e.g., AAPL, Tesla, Tech)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10 h-12 text-md"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                {isSearching && (
                  <div className="absolute right-3 top-3.5">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                size="lg"
                className="px-6"
              >
                <Zap className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
            
            {/* Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  className="mb-4 bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800">
                    <h4 className="font-medium">Search Results</h4>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                      {searchResults.map((stock) => (
                        <motion.li
                          key={stock.symbol}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          onClick={() => handleAddStock(stock)}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <span className="font-mono font-bold text-lg">{stock.symbol}</span>
                                {stock.exchange && (
                                  <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                                    {stock.exchange}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0">
                              <Plus className="h-5 w-5" />
                            </Button>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Selected Stocks Visual Display */}
            <div className="mb-2">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Your Selected Stocks
              </h4>
              
              {selectedStocks.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="mb-2">
                    <Search className="h-10 w-10 mx-auto text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">No stocks selected yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Search and add stocks to your bracket</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {selectedStocks.map((stock) => (
                      <motion.div 
                        key={stock.symbol}
                        className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        layout
                      >
                        <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-mono font-bold text-lg">{stock.symbol}</span>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{stock.name}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleRemoveStock(stock.symbol)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <p className="text-sm mb-2 font-medium">Your Prediction:</p>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant={stock.direction === 'bullish' ? 'default' : 'outline'}
                              className={`flex-1 ${stock.direction === 'bullish' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                              onClick={() => toggleDirection(stock.symbol)}
                            >
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Bullish
                            </Button>
                            <Button 
                              size="sm" 
                              variant={stock.direction === 'bearish' ? 'default' : 'outline'}
                              className={`flex-1 ${stock.direction === 'bearish' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                              onClick={() => toggleDirection(stock.symbol)}
                            >
                              <TrendingDown className="h-4 w-4 mr-1" />
                              Bearish
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Empty Slots */}
                  {Array.from({ length: bracketSize - selectedStocks.length }).map((_, index) => (
                    <div 
                      key={`empty-${index}`} 
                      className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Add a stock</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* AI Opponent Selection */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-lg">Choose Your AI Opponent</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAiSelection(!showAiSelection)}
                className="ml-auto"
              >
                {showAiSelection ? 'Random Opponent' : 'Choose Opponent'}
              </Button>
            </div>
            
            {showAiSelection ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiPersonalities.map((ai) => (
                  <motion.div 
                    key={ai.id}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedAI === ai.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-800'}
                    `}
                    onClick={() => setSelectedAI(ai.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl drop-shadow-md">
                        {ai.name.charAt(0)}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{ai.name}</h3>
                      <p className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
                        {ai.tradingStyle.split('.')[0]}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {ai.description?.substring(0, 100) || "AI trading personality"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-5 flex items-center gap-4 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  AI
                </div>
                <div>
                  <h3 className="font-medium text-lg">Random AI Opponent</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You'll be matched with a random AI trading personality
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between px-6 py-5 bg-gray-50 dark:bg-slate-950 border-t">
        <Button 
          variant="outline" 
          onClick={() => {
            setSelectedStocks([]);
            setSearchResults([]);
            setSearchQuery("");
          }}
          disabled={selectedStocks.length === 0 || isSubmitting}
          size="lg"
          className="px-5"
        >
          Reset Selections
        </Button>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={handleSubmit}
            disabled={selectedStocks.length !== bracketSize || isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 text-lg h-12"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Duel...
              </>
            ) : (
              <>
                <Swords className="mr-2 h-5 w-5" />
                Start Duel!
              </>
            )}
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
};

export default BracketForm;
