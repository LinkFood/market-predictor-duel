/**
 * AI Stock Picker
 * Selects stocks for AI opponents based on their personality and strategy
 */

import { getStockData, searchStocks } from '../market';
import { logError } from '../error-handling';
import { AIPersonality, BracketEntry, BracketSize, BracketTimeframe, Direction } from './types';
import { getAIPersonality } from './ai-personalities';

// Interface for AI stock selection parameters
interface AIStockPickParams {
  personality: AIPersonality;
  size: BracketSize;
  userEntries: BracketEntry[];
  timeframe: BracketTimeframe;
}

// Stock filter criteria
interface StockFilterCriteria {
  minMarketCap?: number;
  maxMarketCap?: number;
  sectors?: string[];
  excludeSymbols?: string[];
  preferHighDividend?: boolean;
  preferGrowth?: boolean;
  preferValue?: boolean;
  preferMomentum?: boolean;
}

/**
 * Get AI stock picks based on personality and user entries
 */
export async function getAiStockPicks(params: AIStockPickParams): Promise<BracketEntry[]> {
  try {
    const { personality, size, userEntries, timeframe } = params;
    
    // Get the AI personality profile
    const aiProfile = getAIPersonality(personality);
    console.log(`Getting stock picks for AI: ${aiProfile.name} (${personality})`);
    
    // Extract user symbols to avoid duplication
    const userSymbols = userEntries.map(entry => entry.symbol);
    
    // Determine filter criteria based on personality
    const criteria = getFilterCriteriaForPersonality(personality, userEntries);
    
    // Get candidate stocks based on the criteria
    const candidates = await getCandidateStocks(criteria, userSymbols);
    console.log(`Found ${candidates.length} candidate stocks for AI`);
    
    // If we don't have enough candidates, relax criteria and try again
    if (candidates.length < size) {
      console.log('Not enough candidates, relaxing criteria');
      const relaxedCriteria = {...criteria};
      
      // Remove sector constraints if we have them
      if (relaxedCriteria.sectors && relaxedCriteria.sectors.length > 0) {
        delete relaxedCriteria.sectors;
      }
      
      // Relax market cap constraints
      if (relaxedCriteria.minMarketCap) {
        relaxedCriteria.minMarketCap = relaxedCriteria.minMarketCap / 2;
      }
      
      const additionalCandidates = await getCandidateStocks(relaxedCriteria, userSymbols);
      candidates.push(...additionalCandidates);
    }
    
    // If we still don't have enough, use some popular stocks as a fallback
    if (candidates.length < size) {
      console.log('Still not enough candidates, using popular stocks');
      const popularStocks = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'JNJ']
        .filter(symbol => !userSymbols.includes(symbol));
        
      // Add any popular stocks that aren't already in our candidates
      for (const symbol of popularStocks) {
        if (!candidates.some(c => c.symbol === symbol)) {
          try {
            const { data: stockData } = await getStockData(symbol);
            candidates.push({
              symbol,
              name: stockData.name,
              price: stockData.price,
              sector: stockData.sector || 'Technology',
              marketCap: stockData.marketCap || 1000000000000 // Default large cap
            });
          } catch (err) {
            console.error(`Error fetching data for ${symbol}`, err);
          }
        }
        
        if (candidates.length >= size * 2) break; // Ensure we have at least 2x the needed stocks
      }
    }
    
    // Sort candidates based on personality preferences
    const rankedCandidates = rankCandidatesForPersonality(candidates, personality);
    
    // Select top 'size' candidates
    const selectedCandidates = rankedCandidates.slice(0, size);
    
    // Determine direction (bullish/bearish) for each pick based on AI personality
    const aiPicks: BracketEntry[] = selectedCandidates.map((stock, index) => {
      const direction = determineDirectionForStock(stock, personality, timeframe);
      
      return {
        symbol: stock.symbol,
        name: stock.name,
        entryType: "stock", // Can be enhanced to include ETFs
        direction,
        startPrice: stock.price,
        marketCap: determineMarketCapCategory(stock.marketCap),
        sector: stock.sector,
        order: index + 1
      };
    });
    
    return aiPicks;
  } catch (error) {
    logError(error, "getAiStockPicks");
    console.error("Error getting AI stock picks:", error);
    
    // Fallback to dummy data in case of error
    return generateFallbackPicks(params.size);
  }
}

/**
 * Get filter criteria based on AI personality
 */
function getFilterCriteriaForPersonality(
  personality: AIPersonality, 
  userEntries: BracketEntry[]
): StockFilterCriteria {
  // Extract user symbols to avoid picking the same stocks
  const userSymbols = userEntries.map(entry => entry.symbol);
  
  // Get market cap range from user entries to stay competitive
  const userMarketCaps = userEntries
    .map(entry => entry.marketCap === "large" ? 10000000000 : 
                 entry.marketCap === "mid" ? 2000000000 : 500000000);
  
  const avgUserMarketCap = userMarketCaps.reduce((sum, cap) => sum + cap, 0) / userMarketCaps.length;
  
  // Extract user sectors to consider similar or different sectors
  const userSectors = [...new Set(userEntries.map(entry => entry.sector))];
  
  switch (personality) {
    case "ValueHunter":
      return {
        minMarketCap: avgUserMarketCap * 0.5,
        excludeSymbols: userSymbols,
        preferValue: true,
        preferHighDividend: true
      };
      
    case "MomentumTrader":
      return {
        minMarketCap: avgUserMarketCap * 0.3,
        excludeSymbols: userSymbols,
        preferMomentum: true,
        sectors: ["Technology", "Consumer Discretionary", "Communication Services"]
      };
      
    case "TrendFollower":
      // TrendFollower tends to stick to similar sectors as the user
      return {
        minMarketCap: avgUserMarketCap * 0.7,
        excludeSymbols: userSymbols,
        sectors: userSectors, // Follow similar sectors
        preferMomentum: true
      };
      
    case "ContraThinker":
      // ContraThinker deliberately avoids user sectors
      const contraSectors = ["Financial", "Healthcare", "Energy", "Utilities", "Industrial", "Materials"]
        .filter(sector => !userSectors.includes(sector));
        
      return {
        minMarketCap: avgUserMarketCap * 0.5,
        maxMarketCap: avgUserMarketCap * 3,
        excludeSymbols: userSymbols,
        sectors: contraSectors.length > 0 ? contraSectors : undefined
      };
      
    case "GrowthSeeker":
      return {
        minMarketCap: avgUserMarketCap * 0.2, // Willing to go smaller for growth
        excludeSymbols: userSymbols,
        preferGrowth: true,
        sectors: ["Technology", "Healthcare", "Communication Services"]
      };
      
    case "DividendCollector":
      return {
        minMarketCap: avgUserMarketCap,
        excludeSymbols: userSymbols,
        preferHighDividend: true,
        sectors: ["Utilities", "Financial", "Consumer Staples", "Energy"]
      };
      
    default:
      return {
        excludeSymbols: userSymbols
      };
  }
}

/**
 * Get candidate stocks based on filter criteria
 */
async function getCandidateStocks(
  criteria: StockFilterCriteria, 
  excludeSymbols: string[]
): Promise<any[]> {
  try {
    let candidates: any[] = [];
    
    // If we have sector preferences, search by sector
    if (criteria.sectors && criteria.sectors.length > 0) {
      for (const sector of criteria.sectors) {
        const results = await searchStocks(sector, 20);
        candidates.push(...results.filter(stock => !excludeSymbols.includes(stock.symbol)));
      }
    } else {
      // Otherwise search for popular stocks
      const popularStockTypes = ['technology', 'dividend', 'blue chip', 'growth'];
      for (const type of popularStockTypes) {
        const results = await searchStocks(type, 10);
        candidates.push(...results.filter(stock => !excludeSymbols.includes(stock.symbol)));
      }
    }
    
    // Filter by market cap if specified
    if (criteria.minMarketCap || criteria.maxMarketCap) {
      candidates = candidates.filter(stock => {
        if (criteria.minMarketCap && (!stock.marketCap || stock.marketCap < criteria.minMarketCap)) {
          return false;
        }
        if (criteria.maxMarketCap && stock.marketCap > criteria.maxMarketCap) {
          return false;
        }
        return true;
      });
    }
    
    // Ensure unique stocks by symbol
    const uniqueCandidates: any[] = [];
    const symbolsAdded = new Set<string>();
    
    for (const stock of candidates) {
      if (!symbolsAdded.has(stock.symbol)) {
        uniqueCandidates.push(stock);
        symbolsAdded.add(stock.symbol);
      }
    }
    
    return uniqueCandidates;
  } catch (error) {
    logError(error, "getCandidateStocks");
    console.error("Error getting candidate stocks:", error);
    
    // Return an empty array in case of error
    return [];
  }
}

/**
 * Rank candidate stocks based on AI personality
 */
function rankCandidatesForPersonality(
  candidates: any[], 
  personality: AIPersonality
): any[] {
  // Create a copy of candidates to avoid modifying the original
  const rankedCandidates = [...candidates];
  
  switch (personality) {
    case "ValueHunter":
      // Sort by P/E ratio (lower is better for value)
      rankedCandidates.sort((a, b) => {
        const aRatio = a.peRatio || 100;
        const bRatio = b.peRatio || 100;
        return aRatio - bRatio;
      });
      break;
      
    case "MomentumTrader":
      // Sort by momentum (based on recent performance)
      rankedCandidates.sort((a, b) => {
        const aMomentum = a.recentPerformance || a.changePercent || 0;
        const bMomentum = b.recentPerformance || b.changePercent || 0;
        return bMomentum - aMomentum; // Higher momentum is better
      });
      break;
      
    case "TrendFollower":
      // Sort by trend strength
      rankedCandidates.sort((a, b) => {
        const aTrend = a.trendStrength || a.changePercent || 0;
        const bTrend = b.trendStrength || b.changePercent || 0;
        return bTrend - aTrend; // Stronger trend is better
      });
      break;
      
    case "ContraThinker":
      // Sort by contrary indicators (oversold or overbought)
      rankedCandidates.sort((a, b) => {
        // For ContraThinker, negative recent performance might be an opportunity
        const aScore = a.changePercent ? -a.changePercent : 0; // Invert change
        const bScore = b.changePercent ? -b.changePercent : 0;
        return bScore - aScore;
      });
      break;
      
    case "GrowthSeeker":
      // Sort by growth metrics
      rankedCandidates.sort((a, b) => {
        const aGrowth = a.revenueGrowth || a.earningsGrowth || 0;
        const bGrowth = b.revenueGrowth || b.earningsGrowth || 0;
        return bGrowth - aGrowth; // Higher growth is better
      });
      break;
      
    case "DividendCollector":
      // Sort by dividend yield
      rankedCandidates.sort((a, b) => {
        const aDividend = a.dividendYield || 0;
        const bDividend = b.dividendYield || 0;
        return bDividend - aDividend; // Higher dividend is better
      });
      break;
      
    default:
      // Random shuffle for default case
      rankedCandidates.sort(() => Math.random() - 0.5);
  }
  
  return rankedCandidates;
}

/**
 * Determine direction for stock based on AI personality
 */
function determineDirectionForStock(
  stock: any, 
  personality: AIPersonality,
  timeframe: BracketTimeframe
): Direction {
  // Extract some stock properties with defaults
  const recentChange = stock.changePercent || 0;
  const peRatio = stock.peRatio || 20;
  const dividendYield = stock.dividendYield || 0;
  
  // Determine baseline direction tendency based on personality and timeframe
  let bullishProbability = 0.5; // Start with neutral probability
  
  switch (personality) {
    case "ValueHunter":
      // Value hunter more bearish on high PE stocks, bullish on low PE with good dividends
      bullishProbability += (20 - peRatio) * 0.01; // Lower PE increases bullishness
      bullishProbability += dividendYield * 0.1; // Higher dividend increases bullishness
      bullishProbability -= Math.max(0, recentChange * 0.01); // Recent rises make less attractive
      break;
      
    case "MomentumTrader":
      // Momentum trader follows recent momentum strongly
      bullishProbability += recentChange * 0.03; // Recent momentum heavily influences
      if (timeframe === 'daily') bullishProbability += 0.1; // More bullish on short timeframes
      break;
      
    case "TrendFollower":
      // Trend follower follows established trends
      bullishProbability += recentChange * 0.02; // Recent trends matter
      // Less extreme than momentum trader
      bullishProbability = Math.min(0.85, Math.max(0.15, bullishProbability));
      break;
      
    case "ContraThinker":
      // Contrarian goes against recent moves
      bullishProbability -= recentChange * 0.02; // Opposite of recent trend
      if (recentChange < -10) bullishProbability += 0.2; // Very bullish after big drops
      if (recentChange > 10) bullishProbability -= 0.2; // Very bearish after big rises
      break;
      
    case "GrowthSeeker":
      // Growth seeker generally bullish, especially on tech and high growth
      bullishProbability += 0.2; // Generally more bullish
      if (stock.sector === 'Technology') bullishProbability += 0.1;
      if (peRatio > 30) bullishProbability += 0.1; // High PE might signal growth
      if (timeframe === 'monthly') bullishProbability += 0.1; // More bullish on longer timeframes
      break;
      
    case "DividendCollector":
      // Dividend collector cautious but likes stable dividend payers
      bullishProbability += dividendYield * 0.15; // Higher dividends increase bullishness
      bullishProbability -= Math.abs(recentChange) * 0.01; // Prefers stability (less change)
      if (stock.sector === 'Utilities' || stock.sector === 'Consumer Staples') {
        bullishProbability += 0.1; // Prefers stable sectors
      }
      break;
  }
  
  // Ensure the probability is between 0 and 1
  bullishProbability = Math.min(0.9, Math.max(0.1, bullishProbability));
  
  // Randomly determine direction based on bullish probability
  return Math.random() < bullishProbability ? 'bullish' : 'bearish';
}

/**
 * Generate fallback picks in case of API failures
 */
function generateFallbackPicks(size: BracketSize): BracketEntry[] {
  const fallbackStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 334.58, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 133.95, sector: 'Communication Services' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 145.89, sector: 'Consumer Discretionary' },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 175.21, sector: 'Consumer Discretionary' },
    { symbol: 'META', name: 'Meta Platforms Inc', price: 319.34, sector: 'Communication Services' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 437.53, sector: 'Technology' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co', price: 179.96, sector: 'Financial' },
    { symbol: 'V', name: 'Visa Inc', price: 270.37, sector: 'Financial' }
  ];
  
  // Select a random subset of the appropriate size
  const shuffled = [...fallbackStocks].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, size);
  
  // Create bracket entries
  return selected.map((stock, index) => ({
    symbol: stock.symbol,
    name: stock.name,
    entryType: "stock",
    direction: Math.random() > 0.5 ? 'bullish' : 'bearish',
    startPrice: stock.price,
    marketCap: "large",
    sector: stock.sector,
    order: index + 1
  }));
}

/**
 * Determine market cap category from market cap value
 */
function determineMarketCapCategory(marketCap?: number): "large" | "mid" | "small" {
  if (!marketCap) return "mid";
  
  if (marketCap >= 10000000000) { // $10B+
    return "large";
  } else if (marketCap >= 2000000000) { // $2B+
    return "mid";
  } else {
    return "small";
  }
}