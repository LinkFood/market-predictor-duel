/**
 * Brackets Page
 * Overview of all user's brackets
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
  HistoryIcon
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
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Your Brackets | Stock Duel</title>
      </Helmet>
      
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Your Brackets</h1>
              <p className="text-gray-500">
                Compete against AI traders with your stock picks
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/app/brackets/create')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Bracket
            </Button>
          </div>
          
          {/* Stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="text-2xl font-bold">{brackets.length}</h3>
                  <p className="text-sm text-gray-500">Total Brackets</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="text-2xl font-bold">{userWins}</h3>
                  <p className="text-sm text-gray-500">Victories</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mb-2" />
                  <h3 className="text-2xl font-bold">{aiWins}</h3>
                  <p className="text-sm text-gray-500">Defeats</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="text-2xl font-bold">{winRate.toFixed(0)}%</h3>
                  <p className="text-sm text-gray-500">Win Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Filter bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <Tabs 
            defaultValue="all" 
            className="w-full"
            onValueChange={(value) => setActiveFilter(value === 'all' ? null : value)}
          >
            <div className="flex justify-between items-center">
              <TabsList>
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
                <TabsTrigger value="pending">
                  Pending
                  <Badge variant="outline" className="ml-2">{pendingBrackets}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    {timeframeFilter ? `${timeframeFilter} brackets` : 'Filter by timeframe'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Bracket Timeframe</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTimeframeFilter(null)}>
                    All timeframes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeframeFilter('daily')}>
                    Daily brackets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeframeFilter('weekly')}>
                    Weekly brackets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeframeFilter('monthly')}>
                    Monthly brackets
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <TabsContent value="all" className="mt-6">
              {filteredBrackets.length === 0 ? (
                <NoRackets createNew={() => navigate('/app/brackets/create')} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrackets.map(bracket => (
                    <BracketCard key={bracket.id} bracket={bracket} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              {filteredBrackets.length === 0 ? (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="py-8 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Active Brackets</h3>
                    <p className="text-gray-500 mb-4">You don't have any active bracket competitions right now.</p>
                    <Button onClick={() => navigate('/app/brackets/create')}>
                      Create New Bracket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrackets.map(bracket => (
                    <BracketCard key={bracket.id} bracket={bracket} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              {filteredBrackets.length === 0 ? (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="py-8 text-center">
                    <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Completed Brackets</h3>
                    <p className="text-gray-500 mb-4">You haven't completed any brackets yet.</p>
                    <Button onClick={() => navigate('/app/brackets/create')}>
                      Create New Bracket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrackets.map(bracket => (
                    <BracketCard key={bracket.id} bracket={bracket} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              {filteredBrackets.length === 0 ? (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="py-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Pending Brackets</h3>
                    <p className="text-gray-500 mb-4">You don't have any brackets waiting to start.</p>
                    <Button onClick={() => navigate('/app/brackets/create')}>
                      Create New Bracket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrackets.map(bracket => (
                    <BracketCard key={bracket.id} bracket={bracket} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

// Component for when no brackets exist
const NoRackets: React.FC<{ createNew: () => void }> = ({ createNew }) => {
  return (
    <Card className="bg-gray-50 border-dashed">
      <CardContent className="py-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">No Brackets Created Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start your first bracket competition against our AI traders and see if your stock picks can win!
          </p>
          <Button 
            size="lg"
            onClick={createNew}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Bracket
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default Brackets;