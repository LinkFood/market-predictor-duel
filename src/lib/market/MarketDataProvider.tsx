
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockData } from './types';
import { getTopMovers } from './market-movers-service';
import { MARKET_CONFIG, FEATURES } from '../config';
import { useToast } from '@/hooks/use-toast';

interface MarketDataContextType {
  gainers: StockData[];
  losers: StockData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
  usingMockData: boolean;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};

interface MarketDataProviderProps {
  children: ReactNode;
}

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingMockData, setUsingMockData] = useState(!FEATURES.enableRealMarketData);

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      console.log('Fetching market movers data...');
      
      const { gainers: newGainers, losers: newLosers, usingMockData: isMockData } = await getTopMovers();
      
      console.log('Received market movers data:', { 
        gainers: newGainers.length, 
        losers: newLosers.length,
        usingMockData: isMockData
      });
      
      // Only update state if we received valid data
      if (newGainers.length > 0 || newLosers.length > 0) {
        setGainers(newGainers);
        setLosers(newLosers);
        setLastUpdated(new Date());
        setUsingMockData(isMockData);
        
        if (isMockData && FEATURES.enableRealMarketData) {
          toast({
            title: "Using Mock Data",
            description: "Real market data could not be fetched. Using simulated data instead.",
            variant: "warning"
          });
        }
      } else {
        setIsError(true);
        setErrorMessage("Received empty market data");
        toast({
          title: "Market Data Warning",
          description: "Received empty market data. Using latest available data.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error fetching market data");
      setUsingMockData(true);
      
      toast({
        title: "Market Data Error",
        description: "Failed to fetch market data. Using simulated data instead.",
        variant: "destructive"
      });
      
      // Don't update with empty data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchMarketData();
    
    // Set up refresh interval
    const interval = setInterval(() => {
      fetchMarketData();
    }, MARKET_CONFIG.refreshInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketDataContext.Provider 
      value={{ 
        gainers, 
        losers, 
        isLoading, 
        isError,
        errorMessage,
        lastUpdated, 
        refreshData: fetchMarketData,
        usingMockData
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};
