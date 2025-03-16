import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  LineChart,
  BarChart4,
  Trophy,
  Users,
  Sparkles,
  Clock,
  Zap,
  Calendar,
  Info,
  X,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mockMarketData, mockPredictions, mockStockData, currentUser, mockGlobalStats, mockLeaderboard } from "@/data/mockData";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.07
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
  }
};

// Market trend indicator
const TrendIndicator = ({ direction }: { direction: 'up' | 'down' | 'neutral' }) => {
  const Icon = direction === 'up' 
    ? ArrowUpRight 
    : direction === 'down' 
      ? ArrowDownRight 
      : Minus;
  
  return (
    <div className={`rounded-full w-7 h-7 flex items-center justify-center ${
      direction === 'up' 
        ? 'bg-[hsl(var(--success-muted))]' 
        : direction === 'down' 
          ? 'bg-[hsl(var(--error-muted))]' 
          : 'bg-[hsl(var(--warning-muted))]'
    }`}>
      <Icon className={`w-4 h-4 ${
        direction === 'up' 
          ? 'text-[hsl(var(--success))]' 
          : direction === 'down' 
            ? 'text-[hsl(var(--error))]' 
            : 'text-[hsl(var(--warning))]'
      }`} />
    </div>
  );
};

// Banner alert component
const AlertBanner = ({ onDismiss }: { onDismiss: () => void }) => (
  <motion.div 
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="mb-5 overflow-hidden"
  >
    <div className="rounded-[var(--radius-md)] border border-[hsl(var(--warning-muted))] bg-[hsl(var(--warning-muted))]/20 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))]" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="body-md text-[hsl(var(--warning))]">Market volatility is high today. Create predictions carefully.</p>
          <button 
            onClick={onDismiss}
            className="ml-3 flex-shrink-0"
          >
            <X className="h-5 w-5 text-[hsl(var(--warning))]" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Mini chart component
const MiniChart = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  const color = trend === 'up' 
    ? 'hsl(var(--success))' 
    : trend === 'down' 
      ? 'hsl(var(--error))' 
      : 'hsl(var(--warning))';
  
  // Generate random chart paths based on trend
  const generatePath = () => {
    let path = 'M0,30 ';
    const points = 10;
    
    for (let i = 1; i <= points; i++) {
      const x = (i / points) * 100;
      let y;
      
      if (trend === 'up') {
        y = 30 - (i / points) * 25 + (Math.random() * 8 - 4);
      } else if (trend === 'down') {
        y = 5 + (i / points) * 25 + (Math.random() * 8 - 4);
      } else {
        y = 15 + (Math.random() * 10 - 5);
      }
      
      path += `L${x},${y} `;
    }
    
    return path;
  };
  
  return (
    <svg width="100" height="35" viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d={generatePath()} 
        stroke={color} 
        strokeWidth="2"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Market badge
const MarketBadge = ({ type }: { type: string }) => (
  <span className="px-2 py-0.5 bg-[hsl(var(--surface-2))] rounded-full caption">
    {type}
  </span>
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [showAlert, setShowAlert] = useState(true);
  const recentPredictions = mockPredictions.slice(0, 3);
  const userRank = mockLeaderboard.find(item => item.userId === currentUser.id)?.rank || 0;
  
  // Calculate win rate
  const userWinRate = Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100);
  
  // Generate opportunities with smart suggestions
  const opportunities = [
    { 
      name: "NVIDIA",  
      symbol: "NVDA", 
      type: "Stock",
      confidence: 89, 
      trend: 'up' as const, 
      reason: "Earnings release tomorrow",
      aiSentiment: "Strongly Bullish",
      icon: <Sparkles className="h-4 w-4 text-[hsl(var(--warning))]" />
    },
    { 
      name: "S&P 500", 
      symbol: "SPY", 
      type: "Index",
      confidence: 76, 
      trend: 'down' as const, 
      reason: "Fed announcement impact",
      aiSentiment: "Bearish",
      icon: <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
    },
    { 
      name: "Bitcoin", 
      symbol: "BTC", 
      type: "Crypto",
      confidence: 83, 
      trend: 'up' as const, 
      reason: "Technical breakout pattern",
      aiSentiment: "Bullish",
      icon: <Zap className="h-4 w-4 text-[hsl(var(--success))]" />
    },
    { 
      name: "Retail ETF", 
      symbol: "XRT", 
      type: "Sector",
      confidence: 71, 
      trend: 'up' as const, 
      reason: "Consumer data release",
      aiSentiment: "Moderately Bullish",
      icon: <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
    }
  ];

  return (
    <>
      {/* Main page content with animation */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-1 pb-10 space-y-6 max-w-md mx-auto"
      >
        {/* Alert banner */}
        <AnimatePresence>
          {showAlert && <AlertBanner onDismiss={() => setShowAlert(false)} />}
        </AnimatePresence>
        
        {/* User Stats Section */}
        <motion.section variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="title-md">Welcome back, {currentUser.username}</h3>
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-[hsl(var(--surface-2))] flex items-center justify-center">
              <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <p className="caption text-[hsl(var(--muted-foreground))]">Win Rate</p>
              <p className="numeric-md">{userWinRate}%</p>
            </div>
            <div>
              <p className="caption text-[hsl(var(--muted-foreground))]">Score</p>
              <p className="numeric-md">{currentUser.points}</p>
            </div>
            <div>
              <p className="caption text-[hsl(var(--muted-foreground))]">Rank</p>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-[hsl(var(--warning))] mr-1" />
                <p className="numeric-md">#{userRank}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link to="/app/predict" className="btn-primary btn-md w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Make a Prediction
            </Link>
            <Link to="/app/predictions/history" className="btn-secondary btn-md w-full">
              View Your History
            </Link>
          </div>
        </motion.section>
        
        {/* AI vs Humans Battle Stats */}
        <motion.section variants={itemVariants} className="glass-card-raised overflow-hidden">
          <div className="p-5 pb-4 gradient-blue">
            <div className="flex justify-between items-center mb-2 text-white">
              <h3 className="title-sm">AI vs Humans Battle</h3>
              <Link to="/app/leaderboard" className="btn-ghost rounded-full px-2 py-1 caption">
                Leaderboard <ChevronRight className="h-3 w-3 inline-block" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3 text-white">
              <div>
                <p className="caption opacity-80">Humans</p>
                <p className="numeric-md">{mockGlobalStats.humanWins}</p>
              </div>
              <div>
                <p className="caption opacity-80">AI</p>
                <p className="numeric-md">{mockGlobalStats.aiWins}</p>
              </div>
              <div>
                <p className="caption opacity-80">Ties</p>
                <p className="numeric-md">{mockGlobalStats.ties}</p>
              </div>
            </div>
          </div>
          
          <div className="px-5 py-3 bg-[hsl(var(--surface-2))]">
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1.5">
                <p className="caption opacity-80">Humans: {Math.round((mockGlobalStats.humanWins / (mockGlobalStats.humanWins + mockGlobalStats.aiWins)) * 100)}%</p>
                <p className="caption opacity-80">AI: {Math.round((mockGlobalStats.aiWins / (mockGlobalStats.humanWins + mockGlobalStats.aiWins)) * 100)}%</p>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill gradient-green"
                  style={{ width: `${(mockGlobalStats.humanWins / (mockGlobalStats.humanWins + mockGlobalStats.aiWins)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="caption">{mockGlobalStats.totalPredictions} total predictions</p>
              <Link 
                to="/app/predict" 
                className="btn-primary btn-sm"
              >
                Join Battle
              </Link>
            </div>
          </div>
        </motion.section>
        
        {/* Market Overview */}
        <motion.section variants={itemVariants}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="title-sm">Top Markets</h3>
            <Link to="/markets" className="btn-ghost caption text-[hsl(var(--primary))]">
              View All <ChevronRight className="h-3 w-3 inline-block" />
            </Link>
          </div>
          
          <div className="space-y-2">
            {mockMarketData.map((market, index) => (
              <Link 
                key={index} 
                to={`/markets/${market.name.toLowerCase().replace(/ /g, '-')}`}
                className="glass-card-subtle p-4 flex items-center justify-between touch-scale"
              >
                <div>
                  <p className="body-md">{market.name}</p>
                  <p className={`caption ${market.change > 0 ? 'bullish' : market.change < 0 ? 'bearish' : 'neutral'}`}>
                    {market.change > 0 ? '+' : ''}{market.change.toFixed(2)} ({market.changePercent > 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <p className="numeric-md">{market.value.toLocaleString()}</p>
                  <TrendIndicator direction={market.change > 0 ? 'up' : market.change < 0 ? 'down' : 'neutral'} />
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
        
        {/* Market Opportunities */}
        <motion.section variants={itemVariants}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="title-sm">Prediction Opportunities</h3>
            <button className="btn-ghost caption text-[hsl(var(--muted-foreground))]">
              Filter <ChevronDown className="h-3 w-3 inline-block" />
            </button>
          </div>
          
          <div className="space-y-3">
            {opportunities.map((opportunity, index) => (
              <Link
                key={index}
                to={`/app/predict?symbol=${opportunity.symbol}`}
                className="glass-card p-4 flex flex-col touch-scale"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="title-sm">{opportunity.symbol}</p>
                      <MarketBadge type={opportunity.type} />
                    </div>
                    <p className="caption text-[hsl(var(--muted-foreground))]">{opportunity.name}</p>
                  </div>
                  <TrendIndicator direction={opportunity.trend === 'up' ? 'up' : opportunity.trend === 'down' ? 'down' : 'neutral'} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="caption text-[hsl(var(--muted-foreground))]">Confidence</p>
                    <div className="flex items-center gap-1.5">
                      <div className="progress-bar flex-1 w-auto">
                        <div 
                          className={`progress-bar-fill ${
                            opportunity.trend === 'up' 
                              ? 'gradient-green' 
                              : opportunity.trend === 'down' 
                                ? 'gradient-red' 
                                : 'gradient-orange'
                          }`}
                          style={{ width: `${opportunity.confidence}%` }}
                        ></div>
                      </div>
                      <span className="caption font-medium">{opportunity.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="caption text-[hsl(var(--muted-foreground))]">AI Sentiment</p>
                    <p className={`caption font-medium ${
                      opportunity.aiSentiment.includes('Bullish') 
                        ? 'text-[hsl(var(--success))]' 
                        : opportunity.aiSentiment.includes('Bearish') 
                          ? 'text-[hsl(var(--error))]' 
                          : 'text-[hsl(var(--warning))]'
                    }`}>
                      {opportunity.aiSentiment}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {opportunity.icon}
                    <p className="caption">{opportunity.reason}</p>
                  </div>
                  <div className="text-[hsl(var(--primary))] flex items-center">
                    <span className="caption font-medium">Predict</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      
        {/* Recent Predictions */}
        <motion.section variants={itemVariants}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="title-sm">Your Recent Predictions</h3>
            <Link to="/app/predictions/history" className="btn-ghost caption text-[hsl(var(--primary))]">
              View All <ChevronRight className="h-3 w-3 inline-block" />
            </Link>
          </div>
          
          <div className="space-y-2">
            {recentPredictions.map((prediction, index) => (
              <Link 
                key={index}
                to={`/app/predictions/${prediction.id}`}
                className="glass-card-subtle p-4 flex items-center justify-between touch-scale"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    prediction.status === 'correct' 
                      ? 'bg-[hsl(var(--success-muted))]' 
                      : prediction.status === 'incorrect' 
                        ? 'bg-[hsl(var(--error-muted))]' 
                        : 'bg-[hsl(var(--warning-muted))]'
                  }`}>
                    <span className="body-sm font-medium">{prediction.targetName.slice(0, 4)}</span>
                  </div>
                  
                  <div>
                    <p className="body-md">{prediction.targetName}</p>
                    <p className="caption text-[hsl(var(--muted-foreground))]">
                      {prediction.userPrediction} • {prediction.timeframe}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className={`body-md font-medium ${
                    prediction.status === 'correct' 
                      ? 'text-[hsl(var(--success))]' 
                      : prediction.status === 'incorrect' 
                        ? 'text-[hsl(var(--error))]' 
                        : 'text-[hsl(var(--warning))]'
                  }`}>
                    {prediction.status === 'correct' && '+25'}
                    {prediction.status === 'incorrect' && '-10'}
                    {prediction.status === 'pending' && 'Pending'}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
        
        {/* Community Stats */}
        <motion.section variants={itemVariants} className="glass-card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="title-sm">Community Stats</h3>
            <div className="btn-icon btn-secondary">
              <Info className="h-4 w-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="caption text-[hsl(var(--muted-foreground))]">Active Users</p>
              <p className="numeric-md">1,248</p>
            </div>
            <div>
              <p className="caption text-[hsl(var(--muted-foreground))]">Predictions Today</p>
              <p className="numeric-md">387</p>
            </div>
            <div>
              <p className="caption text-[hsl(var(--muted-foreground))]">Top Human Win Rate</p>
              <p className="numeric-md">78%</p>
            </div>
            <div>
              <p className="caption text-[hsl(var(--muted-foreground))]">AI Win Rate</p>
              <p className="numeric-md">51%</p>
            </div>
          </div>
          
          <Link to="/app/leaderboard" className="btn-secondary btn-md w-full">
            <Trophy className="h-4 w-4 mr-2" />
            View Leaderboard
          </Link>
        </motion.section>
      </motion.div>

      {/* Floating Action Button */}
      <Link to="/app/predict" className="fab right-6 bottom-24">
        <TrendingUp className="h-6 w-6" />
      </Link>
    </>
  );
};

export default Dashboard;