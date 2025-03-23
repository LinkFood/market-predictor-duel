/**
 * Brackets Page - Redesigned
 * A focused interface for the bracket competitions feature
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  FilterIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  HistoryIcon,
  Bot,
  User,
  ChevronRight,
  Medal
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import BracketCard from "@/components/duel/BracketCard";
import { Bracket, BracketTimeframe } from "@/lib/duel/types";
import { getUserBrackets } from "@/lib/duel/bracket-service";

// AI opponent options for quick-start
const quickStartOptions = [
  {
    name: "Daily Sprint",
    description: "3 stocks, 1-day competition",
    icon: <Clock className="w-4 h-4" />,
    timeframe: "daily",
    stocks: 3,
    badge: "Beginner Friendly"
  },
  {
    name: "Weekly Challenge",
    description: "5 stocks, 1-week battle",
    icon: <Calendar className="w-4 h-4" />,
    timeframe: "weekly",
    stocks: 5,
    badge: "Most Popular"
  },
  {
    name: "Monthly Marathon",
    description: "8 stocks, 30-day competition",
    icon: <TrendingUp className="w-4 h-4" />,
    timeframe: "monthly",
    stocks: 8,
    badge: "High Stakes"
  }
];

const Brackets: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [filteredBrackets, setFilteredBrackets] = useState<Bracket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [timeframeFilter, setTimeframeFilter] = useState<BracketTimeframe | null>(null);
  
  // Load user brackets
  useEffect(() => {
    const fetchBrackets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const userBrackets = await getUserBrackets();
        setBrackets(userBrackets);
        setFilteredBrackets(userBrackets);
      } catch (err) {
        console.error("Error fetching brackets:", err);
        setError("Failed to load your brackets. Please try again later.");
        
        toast({
          title: "Error",
          description: "Failed to load your brackets. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrackets();
  }, [toast]);
  
  // Filter brackets based on status and timeframe
  useEffect(() => {
    let filtered = [...brackets];
    
    // Apply status filter
    if (activeFilter) {
      filtered = filtered.filter(bracket => bracket.status === activeFilter);
    }
    
    // Apply timeframe filter
    if (timeframeFilter) {
      filtered = filtered.filter(bracket => bracket.timeframe === timeframeFilter);
    }
    
    setFilteredBrackets(filtered);
  }, [brackets, activeFilter, timeframeFilter]);
  
  // Stats for brackets
  const activeBrackets = brackets.filter(b => b.status === 'active').length;
  const completedBrackets = brackets.filter(b => b.status === 'completed').length;
  const pendingBrackets = brackets.filter(b => b.status === 'pending').length;
  
  // User win stats
  const userWins = brackets.filter(b => b.status === 'completed' && b.winnerId === 'user').length;
  const aiWins = brackets.filter(b => b.status === 'completed' && b.winnerId === 'ai').length;
  const winRate = completedBrackets > 0 ? (userWins / completedBrackets) * 100 : 0;

  // Start a quick bracket competition with predefined settings
  const startQuickBracket = (timeframe: string, numStocks: number) => {
    navigate('/app/brackets/create', { 
      state: { 
        quickStart: true,
        timeframe,
        numStocks
      } 
    });
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`stat-${index}`} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        
        <Skeleton className="h-10 w-full mb-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`card-${index}`} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Stock Duels | StockDuel</title>
      </Helmet>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-bold">Stock Duels</h1>
              <p className="text-muted-foreground">
                Compete against AI traders with your stock picks
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/app/brackets/create')}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Duel
            </Button>
          </div>
        </motion.div>
        
        {/* Stats summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Duels</p>
                <p className="text-2xl font-bold">{brackets.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-muted-foreground/30" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Your Wins</p>
                <p className="text-2xl font-bold">{userWins}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500/30" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">AI Wins</p>
                <p className="text-2xl font-bold">{aiWins}</p>
              </div>
              <Bot className="w-10 h-10 text-blue-500/30" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{winRate.toFixed(0)}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary/30" />
            </CardContent>
          </Card>
        </div>
        
        {brackets.length === 0 ? (
          <EmptyBracketsView createNew={() => navigate('/app/brackets/create')} quickStart={startQuickBracket} />
        ) : (
          <Tabs 
            defaultValue="all" 
            className="w-full"
            onValueChange={(value) => setActiveFilter(value === 'all' ? null : value)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all">
                  All
                  <Badge variant="outline" className="ml-2">{brackets.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active
                  <Badge variant="outline" className="ml-2">{activeBrackets}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  <Badge variant="outline" className="ml-2">{completedBrackets}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    {timeframeFilter ? `${timeframeFilter}` : 'Filter Time'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Timeframe</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTimeframeFilter(null)}>
                    All timeframes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeframeFilter('daily')}>
                    Daily
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeframeFilter('weekly')}>
                    Weekly
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeframeFilter('monthly')}>
                    Monthly
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <TabsContent value="all" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrackets.map(bracket => (
                  <BracketCard key={bracket.id} bracket={bracket} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="mt-2">
              {filteredBrackets.length === 0 ? (
                <EmptyStateCard
                  icon={<Clock className="w-12 h-12" />}
                  title="No Active Duels"
                  description="You don't have any active duels right now."
                  actionText="Start New Duel"
                  onAction={() => navigate('/app/brackets/create')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBrackets.map(bracket => (
                    <BracketCard key={bracket.id} bracket={bracket} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-2">
              {filteredBrackets.length === 0 ? (
                <EmptyStateCard
                  icon={<HistoryIcon className="w-12 h-12" />}
                  title="No Completed Duels"
                  description="You haven't completed any duels yet."
                  actionText="Start New Duel"
                  onAction={() => navigate('/app/brackets/create')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBrackets.map(bracket => (
                    <BracketCard key={bracket.id} bracket={bracket} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

// Component for when no brackets exist
const EmptyBracketsView: React.FC<{ 
  createNew: () => void;
  quickStart: (timeframe: string, numStocks: number) => void; 
}> = ({ createNew, quickStart }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-muted/40 border-dashed">
        <CardContent className="py-12 px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Medal className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Start Your First Stock Duel</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Challenge AI traders with your stock picks and see if you can outperform the algorithms!
            </p>
            <Button 
              size="lg"
              onClick={createNew}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Custom Duel
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Quick Start Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStartOptions.map((option, index) => (
            <Card key={index} className="hover:border-primary cursor-pointer transition-all" onClick={() => quickStart(option.timeframe, option.stocks)}>
              <CardContent className="p-4">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-primary/10 p-2 rounded">
                      {option.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">{option.badge}</Badge>
                  </div>
                  
                  <h4 className="font-medium text-base mt-2">{option.name}</h4>
                  <p className="text-xs text-muted-foreground mb-4">{option.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-500" />
                      <span>You</span>
                      <span className="text-muted-foreground">vs</span>
                      <Bot className="w-4 h-4 text-blue-500" />
                      <span>AI</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Empty state card component
const EmptyStateCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}> = ({ icon, title, description, actionText, onAction }) => {
  return (
    <Card className="bg-muted/40 border-dashed">
      <CardContent className="py-8 text-center">
        <div className="text-muted-foreground/50 mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button onClick={onAction}>
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Brackets;