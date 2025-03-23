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
import { Loader2, Search, Plus, Minus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { searchStocks } from "@/lib/market";
import { AIPersonality, BracketSize, BracketTimeframe, Direction } from "@/lib/duel/types";
import { getAllAIPersonalities } from "@/lib/duel/ai-personalities";
import { motion } from "framer-motion";

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
  const [searchResults, setSearchResults] = useState<any[]>([]);
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
      const results = await searchStocks(searchQuery, 10);
      setSearchResults(results);
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
  const handleAddStock = (stock: any) => {
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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="text-2xl">Create New Bracket</CardTitle>
        <CardDescription className="text-white/80">
          Choose stocks and compete against AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label>Bracket Timeframe</Label>
            <RadioGroup 
              defaultValue={timeframe} 
              onValueChange={(value) => setTimeframe(value as BracketTimeframe)}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="cursor-pointer">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="cursor-pointer">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Bracket Size Selection */}
          <div className="space-y-2">
            <Label>Bracket Size</Label>
            <RadioGroup 
              defaultValue={bracketSize.toString()} 
              onValueChange={handleSizeChange}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="size-3" />
                <Label htmlFor="size-3" className="cursor-pointer">3 Stocks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="size-6" />
                <Label htmlFor="size-6" className="cursor-pointer">6 Stocks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="9" id="size-9" />
                <Label htmlFor="size-9" className="cursor-pointer">9 Stocks</Label>
              </div>
            </RadioGroup>
            
            <p className="text-sm text-gray-500 mt-1">
              Select {bracketSize} stocks for your bracket
            </p>
          </div>
          
          {/* Stock Search */}
          <div className="space-y-2">
            <Label htmlFor="stock-search">Add Stocks to Your Bracket</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="stock-search"
                  placeholder="Search for stocks (e.g., AAPL, Tesla, Tech)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                size="sm"
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  <ul className="divide-y">
                    {searchResults.map((stock) => (
                      <motion.li
                        key={stock.symbol}
                        className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                        onClick={() => handleAddStock(stock)}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div>
                          <span className="font-medium">{stock.symbol}</span>
                          <p className="text-sm text-gray-500">{stock.name}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Selected Stocks */}
            <div className="mt-4">
              <Label className="mb-2 block">Your Selected Stocks ({selectedStocks.length}/{bracketSize})</Label>
              {selectedStocks.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No stocks selected yet</p>
                  <p className="text-sm text-gray-400">Search and add stocks to your bracket</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedStocks.map((stock) => (
                    <motion.li 
                      key={stock.symbol}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-sm text-gray-500">{stock.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant={stock.direction === 'bullish' ? 'default' : 'outline'}
                          className={stock.direction === 'bullish' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => toggleDirection(stock.symbol)}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Bull
                        </Button>
                        <Button 
                          size="sm" 
                          variant={stock.direction === 'bearish' ? 'default' : 'outline'}
                          className={stock.direction === 'bearish' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => toggleDirection(stock.symbol)}
                        >
                          <TrendingDown className="h-4 w-4 mr-1" />
                          Bear
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveStock(stock.symbol)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* AI Opponent Selection */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">AI Opponent</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAiSelection(!showAiSelection)}
              >
                {showAiSelection ? 'Random Opponent' : 'Choose Opponent'}
              </Button>
            </div>
            
            {showAiSelection ? (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {aiPersonalities.map((ai) => (
                  <div 
                    key={ai.id}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer
                      ${selectedAI === ai.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}
                    `}
                    onClick={() => setSelectedAI(ai.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {ai.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{ai.name}</h3>
                        <p className="text-xs text-gray-500">{ai.tradingStyle.split('.')[0]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                You'll compete against a random AI opponent
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between px-6 py-4 bg-gray-50 border-t">
        <Button 
          variant="outline" 
          onClick={() => {
            setSelectedStocks([]);
            setSearchResults([]);
            setSearchQuery("");
          }}
          disabled={selectedStocks.length === 0 || isSubmitting}
        >
          Clear
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={selectedStocks.length !== bracketSize || isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Bracket'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BracketForm;