
import { useState, useEffect } from 'react';
import { MarketData } from '@/types';
import { getMarketIndices, DEFAULT_INDICES } from '@/lib/market/market-indices-service';
import { useToast } from '@/hooks/use-toast';

export const useMarketIndices = () => {
  const { toast } = useToast();
  const [marketIndices, setMarketIndices] = useState<MarketData[]>(DEFAULT_INDICES);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchMarketIndices = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      console.log('Fetching market indices data...');
      
      const { data, usingMockData: isMockData } = await getMarketIndices();
      
      console.log('Market indices data received:', data, 'Using mock data:', isMockData);
      
      if (data && data.length > 0) {
        setMarketIndices(data);
        setLastUpdated(new Date());
        setUsingMockData(isMockData);
        
        if (isMockData) {
          console.log('Using mock market indices data');
        } else {
          console.log('Successfully fetched real market indices data');
        }
      } else {
        setIsError(true);
        toast({
          title: "Market Indices Warning",
          description: "Received empty market indices data. Using latest available data.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching market indices:', error);
      setIsError(true);
      
      toast({
        title: "Market Indices Error",
        description: "Failed to fetch market indices data. Using simulated data instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchMarketIndices();
    
    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchMarketIndices();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    marketIndices,
    isLoading,
    isError,
    lastUpdated,
    usingMockData,
    refreshData: fetchMarketIndices
  };
};

export default useMarketIndices;
