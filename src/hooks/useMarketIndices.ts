
import { useState, useEffect } from 'react';
import { MarketData } from '@/types';

export const useMarketIndices = () => {
  const [marketIndices, setMarketIndices] = useState<MarketData[]>([]);

  useEffect(() => {
    // Create mock market indices data
    const mockIndices = [
      { 
        name: "S&P 500", 
        value: 5234.32, 
        change: 12.45, 
        changePercent: 0.24,
      },
      { 
        name: "Dow Jones", 
        value: 38721.78, 
        change: -82.12, 
        changePercent: -0.21,
      },
      { 
        name: "NASDAQ", 
        value: 16432.67, 
        change: 87.34, 
        changePercent: 0.53,
      },
      { 
        name: "Russell 2000", 
        value: 2146.89, 
        change: -5.23, 
        changePercent: -0.24,
      }
    ];
    
    setMarketIndices(mockIndices);
  }, []);

  return marketIndices;
};

export default useMarketIndices;
