import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  ChevronRight,
  Trophy,
  Users,
  LineChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMarketData, mockPredictions, mockStockData, currentUser, mockGlobalStats, mockLeaderboard } from "@/data/mockData";

// Helper components for iOS-style UI
const ModuleHeader = ({ title, action, onActionClick }: { title: string, action?: string, onActionClick?: () => void }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-headline">{title}</h3>
    {action && (
      <button 
        onClick={onActionClick} 
        className="flex items-center text-primary text-subhead ios-tap"
      >
        {action} <ChevronRight className="h-4 w-4 ml-0.5" />
      </button>
    )}
  </div>
);

// Market movement indicator with iOS styling
const MarketIndicator = ({ type }: { type: 'bullish' | 'bearish' | 'neutral' }) => {
  const Icon = type === 'bullish' 
    ? ArrowUpRight 
    : type === 'bearish' 
      ? ArrowDownRight 
      : Minus;
  
  return (
    <div className={cn(
      "rounded-full w-6 h-6 flex items-center justify-center",
      type === 'bullish' && "bg-[hsl(var(--ios-green))]/20",
      type === 'bearish' && "bg-[hsl(var(--ios-red))]/20",
      type === 'neutral' && "bg-[hsl(var(--ios-yellow))]/20"
    )}>
      <Icon className={cn(
        "w-3.5 h-3.5",
        type === 'bullish' && "text-[hsl(var(--ios-green))]",
        type === 'bearish' && "text-[hsl(var(--ios-red))]",
        type === 'neutral' && "text-[hsl(var(--ios-yellow))]"
      )} />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Only show 2 recent predictions on mobile
  const recentPredictions = mockPredictions.slice(0, 2);
  const userRank = mockLeaderboard.find(item => item.userId === currentUser.id)?.rank;
  
  // Hot opportunities for today (swipeable on mobile)
  const hotOpportunities = [
    { 
      name: "NVIDIA", 
      ticker: "NVDA", 
      description: "Earnings tomorrow", 
      confidence: 89, 
      movement: "volatile" as const,
      icon: <Sparkles className="h-4 w-4 text-[hsl(var(--ios-yellow))]" /> 
    },
    { 
      name: "S&P 500", 
      ticker: "SPY",
      description: "Fed announcement", 
      confidence: 76, 
      movement: "bearish" as const,
      icon: <Clock className="h-4 w-4 text-[hsl(var(--ios-blue))]" /> 
    },
    { 
      name: "Retail", 
      ticker: "XRT",
      description: "Consumer data release", 
      confidence: 82, 
      movement: "bullish" as const,
      icon: <Calendar className="h-4 w-4 text-[hsl(var(--ios-green))]" /> 
    },
  ];

  return (
    <div className="animate-fade-in space-y-5 mt-1">
      {/* Welcome Message - iOS Dynamic Island style notification */}
      {showWelcome && (
        <div className="ios-dynamic-island mb-3" onClick={() => setShowWelcome(false)}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-full">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-caption1 opacity-80">Welcome back</p>
                <p className="text-subhead font-ios-medium">{currentUser.username}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="text-caption1 bg-white/10 rounded-full px-2 py-0.5 ml-2 ios-tap"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Battle Stats Module - Gamification Element */}
      <section className="ios-module mb-5">
        <div className="p-4 pb-3 bg-gradient-to-br from-primary/90 to-[hsl(var(--ios-indigo))]/90 text-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-[hsl(var(--ios-yellow))]" />
              <h3 className="text-headline font-ios-semibold">AI vs Humans Battle</h3>
            </div>
            <Link to="/app/leaderboard" className="flex items-center text-caption1 bg-white/10 rounded-full px-2.5 py-1 ios-tap">
              Leaderboard <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
          
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-caption1 opacity-80">Humans</p>
              <p className="text-headline sf-numeric">{mockGlobalStats.humanWins}</p>
            </div>
            <div>
              <p className="text-caption1 opacity-80">AI</p>
              <p className="text-headline sf-numeric">{mockGlobalStats.aiWins}</p>
            </div>
            <div>
              <p className="text-caption1 opacity-80">Today's Battles</p>
              <p className="text-headline sf-numeric">{mockGlobalStats.humanWins + mockGlobalStats.aiWins + mockGlobalStats.ties}</p>
            </div>
          </div>
        </div>
        
        {/* Battle Progress Bar */}
        <div className="px-4 py-3 bg-secondary/60">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[hsl(var(--ios-green))] to-[hsl(var(--ios-green))]" 
                style={{ width: `${(mockGlobalStats.humanWins / (mockGlobalStats.humanWins + mockGlobalStats.aiWins)) * 100}%` }}
              ></div>
            </div>
            
            <Link 
              to="/app/predict" 
              className="flex-shrink-0 ios-button-primary py-1.5 px-4 ios-button-sm"
            >
              Join Battle
            </Link>
          </div>
        </div>
      </section>
      
      {/* iOS-style Horizontal Scrolling Modules */}
      <section className="mb-5">
        <ModuleHeader title="Market Movers" action="All Markets" onActionClick={() => {}} />
        
        <div className="flex overflow-x-auto gap-3 pb-2 snap-ios hide-scrollbar">
          {mockStockData.slice(0, 5).map((stock, index) => (
            <div 
              key={index} 
              className="ios-card flex-shrink-0 w-44 snap-start ios-press"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-caption1 text-muted-foreground">{stock.symbol}</p>
                  <p className="text-subhead font-ios-medium">{stock.name.split(' ')[0]}</p>
                </div>
                <MarketIndicator 
                  type={stock.percentChange > 0 ? 'bullish' : stock.percentChange < 0 ? 'bearish' : 'neutral'} 
                />
              </div>
              
              <div className="mt-1">
                <p className="text-title3 sf-numeric">${stock.price.toFixed(2)}</p>
                <p className={cn(
                  "text-caption1 sf-numeric",
                  stock.percentChange > 0 ? "text-[hsl(var(--ios-green))]" : 
                  stock.percentChange < 0 ? "text-[hsl(var(--ios-red))]" : 
                  "text-[hsl(var(--ios-yellow))]"
                )}>
                  {stock.percentChange > 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Prediction Opportunities - Horizontal scrolling cards with iOS styling */}
      <section className="mb-5">
        <ModuleHeader title="Prediction Opportunities" action="See All" />
        
        <div className="flex overflow-x-auto gap-3 pb-2 snap-ios hide-scrollbar">
          {hotOpportunities.map((opportunity, index) => (
            <div 
              key={index} 
              className="ios-card flex-shrink-0 w-60 h-36 snap-start flex flex-col ios-press"
            >
              <div className="flex justify-between mb-auto">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-headline font-ios-semibold">{opportunity.ticker}</p>
                    <MarketIndicator 
                      type={opportunity.movement === 'bullish' ? 'bullish' : 
                            opportunity.movement === 'bearish' ? 'bearish' : 'neutral'} 
                    />
                  </div>
                  <p className="text-caption1 text-muted-foreground">{opportunity.name}</p>
                </div>
                {opportunity.icon}
              </div>
              
              <div className="mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full",
                        opportunity.movement === 'bullish' && "bg-[hsl(var(--ios-green))]",
                        opportunity.movement === 'bearish' && "bg-[hsl(var(--ios-red))]",
                        opportunity.movement === 'volatile' && "bg-[hsl(var(--ios-yellow))]"
                      )}
                      style={{ width: `${opportunity.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-caption1 font-ios-medium">{opportunity.confidence}%</span>
                </div>
                <p className="text-footnote mt-1">{opportunity.description}</p>
              </div>
              
              <Link 
                to={`/app/predict?symbol=${opportunity.ticker}`}
                className="mt-2 text-primary text-footnote flex items-center ios-tap self-end"
              >
                Make Prediction <ArrowRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      {/* Your Stats Card - iOS Module Style */}
      <section className="ios-module mb-5">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-headline font-ios-semibold mb-1">Your Performance</h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex flex-col items-center">
                <p className="text-headline sf-numeric">{currentUser.winRate}%</p>
                <p className="text-caption2 text-muted-foreground">Win Rate</p>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-headline sf-numeric">{currentUser.score}</p>
                <p className="text-caption2 text-muted-foreground">Score</p>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <Trophy className="h-3.5 w-3.5 text-[hsl(var(--ios-yellow))] mr-0.5" />
                  <p className="text-headline sf-numeric">#{userRank}</p>
                </div>
                <p className="text-caption2 text-muted-foreground">Rank</p>
              </div>
            </div>
          </div>
          
          <div className="p-1.5 rounded-full bg-secondary">
            <LineChart className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {/* Quick stat actions */}
        <div className="px-3 pb-3 grid grid-cols-3 gap-2">
          <Link to="/app/predict" className="ios-button-secondary py-2 text-footnote ios-button-sm">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            Predict
          </Link>
          <Link to="/app/predictions/history" className="ios-button-secondary py-2 text-footnote ios-button-sm">
            <LineChart className="mr-1.5 h-3.5 w-3.5" /> 
            History
          </Link>
          <Link to="/app/leaderboard" className="ios-button-secondary py-2 text-footnote ios-button-sm">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Rankings
          </Link>
        </div>
      </section>
      
      {/* Recent Predictions */}
      <section>
        <ModuleHeader title="Recent Predictions" action="View All" onActionClick={() => {}} />
        
        <div className="ios-list">
          {recentPredictions.map((prediction, index) => (
            <Link 
              key={index}
              to={`/app/predictions/${prediction.id}`} 
              className="ios-list-item ios-tap"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  prediction.result === 'win' && "bg-[hsl(var(--ios-green))]/20",
                  prediction.result === 'loss' && "bg-[hsl(var(--ios-red))]/20",
                  prediction.result === 'pending' && "bg-[hsl(var(--ios-yellow))]/20",
                )}>
                  <span className="text-footnote font-ios-medium">{prediction.symbol}</span>
                </div>
                
                <div>
                  <p className="text-subhead font-ios-medium">{prediction.asset}</p>
                  <p className="text-caption1 text-muted-foreground">{prediction.direction} • {prediction.timeframe}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className={cn(
                  "text-subhead mr-2",
                  prediction.result === 'win' && "text-[hsl(var(--ios-green))]",
                  prediction.result === 'loss' && "text-[hsl(var(--ios-red))]",
                  prediction.result === 'pending' && "text-[hsl(var(--ios-yellow))]",
                )}>
                  {prediction.result === 'win' && '+'}
                  {prediction.result === 'win' ? prediction.points : 
                   prediction.result === 'loss' ? '-' + prediction.points :
                   'Pending'}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* FAB for new prediction - fixed position */}
      <Link 
        to="/app/predict"
        className="fixed right-5 bottom-24 bg-primary text-white rounded-full p-4 shadow-ios-md"
        aria-label="New Prediction"
      >
        <TrendingUp className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default Dashboard;