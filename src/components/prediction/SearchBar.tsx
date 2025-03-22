
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/lib/config";
import SearchResults from "./SearchResults";
import { useSearchStocks } from "./hooks/useSearchStocks";

interface SearchBarProps {
  onSelectStock: (stock: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectStock }) => {
  const {
    isLoading,
    searchQuery,
    searchResults,
    showSearchResults,
    error,
    usingMockData,
    setSearchQuery,
    setShowSearchResults,
    handleSearch
  } = useSearchStocks();

  const handleSelectStock = (stock: any, newQuery: string) => {
    setShowSearchResults(false);
    setSearchQuery(newQuery);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Search for a stock</label>
        <Badge 
          variant={!usingMockData && FEATURES.enableRealMarketData ? "default" : "outline"} 
          className={cn(
            "text-xs",
            (usingMockData || !FEATURES.enableRealMarketData) && "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
          )}
        >
          {!usingMockData && FEATURES.enableRealMarketData ? "Live Data" : "Simulated Data"}
        </Badge>
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

      <SearchResults 
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        searchQuery={searchQuery}
        error={error}
        usingMockData={usingMockData}
        onSelectStock={onSelectStock}
        onSelect={handleSelectStock}
      />
    </div>
  );
};

export default SearchBar;
