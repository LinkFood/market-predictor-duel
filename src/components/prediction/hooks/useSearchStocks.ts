
import { useState } from "react";
import { searchStocks } from "@/lib/market";
import { useToast } from "@/hooks/use-toast";
import { FEATURES } from "@/lib/config";

export function useSearchStocks() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Searching for stocks:', searchQuery);
      
      const { results, usingMockData: isMockData } = await searchStocks(searchQuery);
      console.log('Search results:', results, 'Using mock data:', isMockData);
      
      setSearchResults(results);
      setShowSearchResults(true);
      setUsingMockData(isMockData);
      
      if (isMockData && FEATURES.enableRealMarketData) {
        toast({
          title: "Using Simulated Data",
          description: "Real market data could not be fetched. Using simulated data instead.",
          variant: "default"
        });
      }
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: `No stocks found matching "${searchQuery}"`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      setError(error instanceof Error ? error.message : "Failed to search for stocks");
      setUsingMockData(true);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to search for stocks. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    searchQuery,
    searchResults,
    showSearchResults,
    error,
    usingMockData,
    setSearchQuery,
    setShowSearchResults,
    handleSearch
  };
}
