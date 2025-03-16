
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockData } from './types';
import { getTopMovers } from './market-movers-service';
import { MARKET_CONFIG } from '../config';

interface MarketDataContextType {
  gainers: StockData[];
  losers: StockData[];
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
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
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      const { gainers: newGainers, losers: newLosers } = await getTopMovers();
      setGainers(newGainers);
      setLosers(newLosers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
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
        lastUpdated, 
        refreshData: fetchMarketData 
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};
