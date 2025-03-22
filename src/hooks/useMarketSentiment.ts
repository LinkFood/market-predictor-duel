
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FEATURES } from '@/lib/config';

// Market sentiment data type
export interface MarketSentiment {
  value: number;
  label: string;
  description: string;
}

// Calculate a sentiment value based on the top movers data
const calculateSentiment = (gainers: any[], losers: any[]): MarketSentiment => {
  if (!gainers.length && !losers.length) {
    return {
      value: 50,
      label: "Neutral Market",
      description: "The market appears to be balanced with no clear direction."
    };
  }
  
  // Calculate average percentage change for gainers and losers
  const avgGainerChange = gainers.reduce((sum, gainer) => sum + gainer.changePercent, 0) / Math.max(gainers.length, 1);
  const avgLoserChange = losers.reduce((sum, loser) => sum + Math.abs(loser.changePercent), 0) / Math.max(losers.length, 1);
  
  // Calculate sentiment based on relative strength of gainers vs losers
  const totalChange = avgGainerChange + avgLoserChange;
  let sentimentValue = totalChange === 0 ? 50 : (avgGainerChange / totalChange) * 100;
  
  // Normalize to be between 0-100 with a bias toward the middle (30-70 range)
  sentimentValue = Math.min(Math.max(sentimentValue, 0), 100);
  
  // Adjust to make 50 truly neutral and avoid extreme values
  sentimentValue = 30 + (sentimentValue * 0.4);
  
  if (sentimentValue > 70) {
    return {
      value: Math.round(sentimentValue),
      label: "Strongly Bullish",
      description: "The market is showing significant upward momentum with gainers substantially outperforming losers."
    };
  } else if (sentimentValue > 60) {
    return {
      value: Math.round(sentimentValue),
      label: "Bullish",
      description: "The market has a positive bias with more stocks rising than falling."
    };
  } else if (sentimentValue > 40) {
    return {
      value: Math.round(sentimentValue),
      label: "Neutral",
      description: "The market is showing a balanced performance with no clear directional bias."
    };
  } else if (sentimentValue > 30) {
    return {
      value: Math.round(sentimentValue),
      label: "Bearish",
      description: "The market has a negative bias with more stocks falling than rising."
    };
  } else {
    return {
      value: Math.round(sentimentValue),
      label: "Strongly Bearish",
      description: "The market is showing significant downward pressure with losers substantially outperforming gainers."
    };
  }
};

// Generate mock market sentiment data based on time of day
const getMockSentiment = (): MarketSentiment => {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  
  // Weekend effect - markets tend to be more uncertain
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      value: 45,
      label: "Weekend Neutral",
      description: "Markets are closed for the weekend. Sentiment reflects Friday's closing position with weekend uncertainty."
    };
  }
  
  // Morning optimism
  if (hour < 11) {
    return {
      value: 65,
      label: "Morning Optimism",
      description: "The market shows typical morning optimism as traders position for the day ahead."
    };
  }
  
  // Midday consolidation
  if (hour >= 11 && hour < 14) {
    return {
      value: 50,
      label: "Midday Consolidation",
      description: "The market is in a typical midday consolidation phase as traders reassess positions."
    };
  }
  
  // Afternoon trend
  if (hour >= 14 && hour < 16) {
    // Generate a slightly random sentiment for demonstration
    const randomValue = Math.random();
    if (randomValue > 0.7) {
      return {
        value: 67,
        label: "Afternoon Rally",
        description: "The market is experiencing a late-day rally as institutional investors increase positions."
      };
    } else if (randomValue > 0.4) {
      return {
        value: 45,
        label: "Late-Day Caution",
        description: "The market is showing caution as traders reduce risk ahead of the close."
      };
    } else {
      return {
        value: 35,
        label: "Afternoon Weakness",
        description: "The market is showing weakness into the close as selling pressure increases."
      };
    }
  }
  
  // After-hours sentiment
  return {
    value: 50,
    label: "After-Hours Neutral",
    description: "Market has closed regular trading hours. Sentiment reflects the day's closing position."
  };
};

export const useMarketSentiment = (gainers: any[] = [], losers: any[] = []) => {
  const { toast } = useToast();
  const [sentiment, setSentiment] = useState<MarketSentiment>({
    value: 50,
    label: "Loading...",
    description: "Calculating current market sentiment..."
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingMockData, setUsingMockData] = useState(!FEATURES.enableRealMarketData);

  const calculateMarketSentiment = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      
      // In a real implementation, we might call a dedicated API endpoint
      // For now, we'll calculate based on the gainers/losers or use mock data

      let newSentiment: MarketSentiment;
      
      if (FEATURES.enableRealMarketData && gainers.length && losers.length) {
        // Calculate sentiment based on real data
        newSentiment = calculateSentiment(gainers, losers);
        setUsingMockData(false);
      } else {
        // Use mock sentiment data
        newSentiment = getMockSentiment();
        setUsingMockData(true);
      }
      
      setSentiment(newSentiment);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error calculating market sentiment:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "Failed to calculate market sentiment");
      
      // Fall back to mock data
      const mockSentiment = getMockSentiment();
      setSentiment(mockSentiment);
      setUsingMockData(true);
      
      toast({
        title: "Market Sentiment Error",
        description: "Failed to calculate market sentiment. Using simulated data instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate sentiment when component mounts or gainers/losers change
  useEffect(() => {
    calculateMarketSentiment();
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      calculateMarketSentiment();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [gainers, losers]);

  return {
    sentiment,
    isLoading,
    isError,
    errorMessage,
    lastUpdated,
    usingMockData,
    refreshData: calculateMarketSentiment
  };
};

export default useMarketSentiment;
