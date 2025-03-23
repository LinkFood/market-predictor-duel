/**
 * Stock Duel Types
 * Core types for the bracket competition system
 */

// Timeframes for bracket competitions
export type BracketTimeframe = "daily" | "weekly" | "monthly";

// Size options for brackets
export type BracketSize = 3 | 6 | 9;

// Status of a bracket
export type BracketStatus = "pending" | "active" | "completed";

// AI Strategy personalities
export type AIPersonality = "ValueHunter" | "MomentumTrader" | "TrendFollower" | 
                           "ContraThinker" | "GrowthSeeker" | "DividendCollector";

// Bracket entry types
export type EntryType = "stock" | "etf";

// Direction prediction for each stock
export type Direction = "bullish" | "bearish";

// Individual stock entry in a bracket
export interface BracketEntry {
  id?: string;
  symbol: string;
  name: string;
  entryType: EntryType;
  direction: Direction;
  startPrice: number;
  endPrice?: number;
  percentChange?: number;
  marketCap: "large" | "mid" | "small";
  sector: string;
  order: number; // Position in bracket
}

// Match between two stocks in a tournament
export interface BracketMatch {
  id?: string;
  roundNumber: number;
  matchNumber: number;
  entry1Id?: string;
  entry2Id?: string;
  winnerId?: string;
  entry1PercentChange?: number;
  entry2PercentChange?: number;
  completed: boolean;
}

// Complete bracket tournament
export interface Bracket {
  id?: string;
  userId: string;
  name: string;
  timeframe: BracketTimeframe;
  size: BracketSize;
  status: BracketStatus;
  aiPersonality: AIPersonality;
  userEntries: BracketEntry[];
  aiEntries: BracketEntry[];
  matches: BracketMatch[];
  winnerId?: string; // "user" or "ai"
  startDate: string;
  endDate: string;
  createdAt: string;
  userPoints: number;
  aiPoints: number;
}

// AI Personality Profile
export interface AIPersonalityProfile {
  id: AIPersonality;
  name: string;
  avatar: string;
  description: string;
  tradingStyle: string;
  strengths: string[];
  weaknesses: string[];
  favoredSectors: string[];
  riskTolerance: "low" | "medium" | "high";
  timeHorizon: "short" | "medium" | "long";
  catchphrase: string;
}

// Tournament results summary
export interface TournamentResult {
  id: string;
  bracketId: string;
  winner: "user" | "ai";
  userScore: number;
  aiScore: number;
  mvpStock: string; // Best performing stock
  upsetStock: string; // Unexpected winner
  completed: string;
}

// User tournament stats
export interface UserTournamentStats {
  totalBrackets: number;
  wins: number;
  losses: number;
  winStreak: number;
  totalPoints: number;
  byTimeframe: {
    daily: {
      played: number;
      won: number;
    },
    weekly: {
      played: number;
      won: number;
    },
    monthly: {
      played: number;
      won: number;
    }
  };
  byAiOpponent: {
    [key in AIPersonality]?: {
      played: number;
      won: number;
    }
  };
}

// Achievement types
export type AchievementType = 
  "FirstWin" | "WinStreak" | "BeatAllAI" | "PerfectBracket" | 
  "UnderdogVictory" | "SectorMaster" | "DailyDomination";

// User achievements
export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
}