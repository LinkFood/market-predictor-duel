/**
 * AI Personalities for Stock Duel
 * Defines the different AI opponents users can compete against
 */

import { AIPersonality, AIPersonalityProfile } from './types';

export const AI_PERSONALITIES: Record<AIPersonality, AIPersonalityProfile> = {
  ValueHunter: {
    id: "ValueHunter",
    name: "Warren",
    avatar: "/ai-avatars/value-hunter.png",
    description: "Seeks undervalued companies with strong fundamentals and cash flow.",
    tradingStyle: "Focuses on price-to-earnings ratios, book value, and consistent dividends.",
    strengths: [
      "Excels in volatile markets",
      "Great at finding hidden gems",
      "Patient investment approach"
    ],
    weaknesses: [
      "May miss growth opportunities",
      "Can underperform in bull markets",
      "Slower to adapt to disruptive technologies"
    ],
    favoredSectors: ["Financial", "Consumer Staples", "Utilities"],
    riskTolerance: "low",
    timeHorizon: "long",
    catchphrase: "Price is what you pay, value is what you get."
  },
  
  MomentumTrader: {
    id: "MomentumTrader",
    name: "Mia",
    avatar: "/ai-avatars/momentum-trader.png",
    description: "Rides the wave of market trends, focusing on stocks with upward momentum.",
    tradingStyle: "Analyzes price trends, volume, and market sentiment to capture upward price movements.",
    strengths: [
      "Quick to capitalize on trends",
      "Excellent in strong bull markets",
      "Responsive to market sentiment"
    ],
    weaknesses: [
      "Vulnerable to false breakouts",
      "Struggles in choppy markets",
      "May hold too long when momentum shifts"
    ],
    favoredSectors: ["Technology", "Consumer Discretionary", "Energy"],
    riskTolerance: "high",
    timeHorizon: "short",
    catchphrase: "The trend is your friend until the end when it bends."
  },
  
  TrendFollower: {
    id: "TrendFollower",
    name: "Tina",
    avatar: "/ai-avatars/trend-follower.png",
    description: "Follows established market trends with a systematic approach.",
    tradingStyle: "Uses technical indicators and moving averages to identify and follow trends.",
    strengths: [
      "Disciplined approach",
      "Good at capturing major market moves",
      "Clear entry and exit strategies"
    ],
    weaknesses: [
      "Late to enter and exit trends",
      "Suffers from whipsaws",
      "Underperforms in range-bound markets"
    ],
    favoredSectors: ["Broad Market ETFs", "Commodities", "Industrial"],
    riskTolerance: "medium",
    timeHorizon: "medium",
    catchphrase: "Follow the smart money, not the noise."
  },
  
  ContraThinker: {
    id: "ContraThinker",
    name: "Carl",
    avatar: "/ai-avatars/contra-thinker.png",
    description: "Goes against market consensus, looking for overreactions and mean reversion.",
    tradingStyle: "Seeks oversold and overbought conditions, betting against extreme market sentiment.",
    strengths: [
      "Excellent at spotting market extremes",
      "Performs well during market panics",
      "Disciplined when markets are greedy"
    ],
    weaknesses: [
      "Can be early and suffer losses",
      "Struggles in strong trending markets",
      "May underestimate structural changes"
    ],
    favoredSectors: ["Healthcare", "Real Estate", "Basic Materials"],
    riskTolerance: "high",
    timeHorizon: "medium",
    catchphrase: "Be fearful when others are greedy, and greedy when others are fearful."
  },
  
  GrowthSeeker: {
    id: "GrowthSeeker",
    name: "Grace",
    avatar: "/ai-avatars/growth-seeker.png",
    description: "Focuses on companies with high growth potential, prioritizing revenue and user growth.",
    tradingStyle: "Invests in innovation, disruption, and companies with strong revenue growth rates.",
    strengths: [
      "Excellent at identifying future leaders",
      "Performs well in innovation-driven markets",
      "Willing to pay premium for growth"
    ],
    weaknesses: [
      "Vulnerable to valuation contractions",
      "Struggles when interest rates rise",
      "May ignore profitability concerns"
    ],
    favoredSectors: ["Technology", "Healthcare", "Consumer Discretionary"],
    riskTolerance: "high",
    timeHorizon: "long",
    catchphrase: "The biggest risk is not taking any risk in a rapidly changing world."
  },
  
  DividendCollector: {
    id: "DividendCollector",
    name: "Diana",
    avatar: "/ai-avatars/dividend-collector.png",
    description: "Seeks income-generating investments with steady cash flow and reliable dividends.",
    tradingStyle: "Focuses on dividend yield, payout ratios, and dividend growth history.",
    strengths: [
      "Generates consistent income",
      "Less volatile during market downturns",
      "Benefits from dividend reinvestment"
    ],
    weaknesses: [
      "May underperform in growth-oriented markets",
      "Sensitive to interest rate changes",
      "Limited capital appreciation potential"
    ],
    favoredSectors: ["Utilities", "Consumer Staples", "REITs"],
    riskTolerance: "low",
    timeHorizon: "long",
    catchphrase: "The safest dividend is the one that's just been raised."
  }
};

/**
 * Get AI personality by ID
 */
export function getAIPersonality(personalityId: AIPersonality): AIPersonalityProfile {
  return AI_PERSONALITIES[personalityId];
}

/**
 * Get all AI personalities
 */
export function getAllAIPersonalities(): AIPersonalityProfile[] {
  return Object.values(AI_PERSONALITIES);
}

/**
 * Get a random AI personality
 */
export function getRandomAIPersonality(): AIPersonalityProfile {
  const personalities = Object.values(AI_PERSONALITIES);
  const randomIndex = Math.floor(Math.random() * personalities.length);
  return personalities[randomIndex];
}

/**
 * Get a suitable opponent based on user preferences or history
 */
export function getSuitableOpponent(
  userFavoredSectors: string[] = [], 
  difficultyPreference: "easy" | "medium" | "hard" = "medium"
): AIPersonalityProfile {
  // If user has sector preferences, try to find an AI that specializes in different sectors
  if (userFavoredSectors.length > 0) {
    const personalities = Object.values(AI_PERSONALITIES);
    
    // Find personalities with least sector overlap
    const rankedByDifference = personalities.map(personality => {
      const overlapCount = personality.favoredSectors.filter(
        sector => userFavoredSectors.includes(sector)
      ).length;
      
      return {
        personality,
        overlapCount
      };
    }).sort((a, b) => a.overlapCount - b.overlapCount);
    
    // Return one of the top 3 least overlapping personalities
    const randomIndex = Math.floor(Math.random() * Math.min(3, rankedByDifference.length));
    return rankedByDifference[randomIndex].personality;
  }
  
  // Based on difficulty preference
  const personalities = Object.values(AI_PERSONALITIES);
  let candidates: AIPersonalityProfile[] = [];
  
  switch (difficultyPreference) {
    case "easy":
      candidates = personalities.filter(p => p.riskTolerance === "low");
      break;
    case "medium":
      candidates = personalities.filter(p => p.riskTolerance === "medium");
      break;
    case "hard":
      candidates = personalities.filter(p => p.riskTolerance === "high");
      break;
    default:
      candidates = personalities;
  }
  
  // If no matching candidates, return any random personality
  if (candidates.length === 0) {
    candidates = personalities;
  }
  
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}