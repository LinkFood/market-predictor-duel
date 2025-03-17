
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { searchStocks } from "@/lib/market";
import { FEATURES } from "@/lib/config";

interface SearchBarProps {
  onSelectStock: (stock: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectStock }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      console.log('Searching for stocks:', searchQuery);
      const results = await searchStocks(searchQuery);
      console.log('Search results:', results);
      setSearchResults(results);
      setShowSearchResults(true);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: `No stocks found matching "${searchQuery}"`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to search for stocks. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Search for a stock</label>
        {FEATURES.enableRealMarketData && (
          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full">
            Live Data
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Enter stock name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button 
          type="button" 
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
      
      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="mt-2 border rounded-md shadow-sm overflow-hidden">
          <ul className="divide-y">
            {searchResults.map((stock, index) => (
              <li
                key={`${stock.symbol}-${index}`}
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  onSelectStock(stock);
                  setShowSearchResults(false);
                  setSearchQuery(stock.name);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{stock.name}</div>
                    <div className="text-xs text-gray-500">{stock.symbol}</div>
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    ${stock.price.toFixed(2)}
                    <span className="ml-2">
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showSearchResults && searchResults.length === 0 && (
        <div className="mt-2 text-sm text-gray-500 text-center p-4 border rounded-md">
          No stocks found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
