import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  ThumbsUp, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Trophy, 
  RefreshCw, 
  Share2, 
  TrendingUp, 
  TrendingDown,
  Swords,
  ArrowLeft,
  BarChart,
  User,
  Sparkles,
  Zap,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import BracketVisualizer from "@/components/duel/BracketVisualizer";
import AIOpponentProfile from "@/components/duel/AIOpponentProfile";
import BracketLoadingSkeleton from "@/components/duel/BracketLoadingSkeleton";
import BracketNavigation from "@/components/duel/BracketNavigation";
import { Bracket, BracketEntry } from "@/lib/duel/types";
import { getBracketById, completeBracket } from "@/lib/duel/bracket-service";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistance, parseISO, differenceInDays } from "date-fns";

const BracketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [activePick, setActivePick] = useState<BracketEntry | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchBracket = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getBracketById(id);
        setBracket(data);
      } catch (err) {
        console.error('Error fetching bracket:', err);
        setError('Failed to load bracket. Please try again.');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load bracket details."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBracket();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Back Navigation */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="flex items-center text-muted-foreground" 
            onClick={() => navigate('/app/brackets')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Brackets
          </Button>
        </div>
        
        <BracketLoadingSkeleton />
      </div>
    );
  }
  
  if (error || !bracket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h2 className="mt-4 text-xl font-bold">Failed to load bracket</h2>
        <p className="mt-2 text-muted-foreground">{error || "Bracket not found"}</p>
        <Button className="mt-6" onClick={() => navigate("/app/brackets")}>
          Back to brackets
        </Button>
      </div>
    );
  }
  
  // Function to update bracket prices
  const handleUpdatePrices = async () => {
    try {
      setIsUpdating(true);
      toast({
        title: "Updating prices...",
        description: "Fetching latest market data"
      });
      
      // This would fetch the latest prices and update the bracket
      // For now, we just simulate a success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Prices updated",
        description: "Latest market data has been applied.",
        variant: "default"
      });
      
      // In a real implementation, we would call an API to update the prices
      // For now, just update the local state
      setBracket({...bracket});
      
    } catch (err) {
      console.error('Error updating prices:', err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update prices. Please try again."
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Function to reset bracket
  const handleResetBracket = async () => {
    try {
      setIsResetting(true);
      toast({
        title: "Resetting bracket...",
        description: "This may take a moment"
      });
      
      // This would call the API to reset the bracket
      // For now, we just simulate a success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Bracket reset",
        description: "Bracket has been reset to initial state.",
        variant: "default"
      });
      
      // In a real implementation, we would call an API to reset the bracket
      // For now, just update the local state
      const updatedBracket = {...bracket, status: 'pending' as 'pending' | 'active' | 'completed'};
      setBracket(updatedBracket);
      
    } catch (err) {
      console.error('Error resetting bracket:', err);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "Failed to reset bracket. Please try again."
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Share bracket results
  const handleShare = () => {
    setIsShareDialogOpen(true);
  };
  
  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share it with your friends to show off your bracket.",
      variant: "default"
    });
  };
  
  // Calculate progress percentage for active brackets
  const getProgressPercentage = () => {
    if (!bracket) return 0;
    if (bracket.status === 'completed') return 100;
    if (bracket.status === 'pending') return 0;
    
    const startDate = parseISO(bracket.startDate);
    const endDate = parseISO(bracket.endDate);
    const now = new Date();
    
    // If past end date, return 100%
    if (now > endDate) return 100;
    
    // Calculate progress percentage
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();
    
    return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  };
  
  // Calculate time remaining in readable format
  const getTimeRemaining = () => {
    if (!bracket) return "";
    
    const now = new Date();
    const endDate = parseISO(bracket.endDate);
    
    if (now > endDate) return "Completed";
    
    return formatDistance(endDate, now, { addSuffix: true });
  };
  
  // Sort entries by performance
  const sortEntriesByPerformance = (entries: BracketEntry[]) => {
    return [...entries].sort((a, b) => {
      const aPerf = a.percentChange ? (a.direction === 'bearish' ? -a.percentChange : a.percentChange) : 0;
      const bPerf = b.percentChange ? (b.direction === 'bearish' ? -b.percentChange : b.percentChange) : 0;
      return bPerf - aPerf; // Sort descending (best first)
    });
  };
  
  // Function to complete bracket manually (for demo purposes)
  const handleCompleteBracket = async () => {
    try {
      setIsUpdating(true);
      toast({
        title: "Completing bracket...",
        description: "This may take a moment"
      });
      
      const result = await completeBracket(bracket.id || "");
      
      toast({
        title: "Bracket completed",
        description: "Results have been calculated.",
        variant: "default"
      });
      
      setBracket(result);
    } catch (err) {
      console.error('Error completing bracket:', err);
      toast({
        variant: "destructive",
        title: "Completion failed",
        description: "Failed to complete bracket. Please try again."
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Helmet>
        <title>{bracket.name} | Stock Bracket Tournament</title>
      </Helmet>
      
      {/* Bracket Navigation */}
      <BracketNavigation currentBracketId={bracket.id || ""} />
      
      {/* Header Section with Summary */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{bracket.name}</h1>
            
            <div className="flex flex-wrap items-center mt-2 gap-3">
              <Badge 
                variant={bracket.status === 'completed' ? 'default' : bracket.status === 'active' ? 'success' : 'secondary'}
                className="px-3 py-1 text-sm"
              >
                {bracket.status === 'completed' ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Completed
                  </span>
                ) : bracket.status === 'active' ? (
                  <span className="flex items-center">
                    <Zap className="h-3.5 w-3.5 mr-1.5" />
                    In Progress
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Starting Soon
                  </span>
                )}
              </Badge>
              
              <div className="flex items-center text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                <span>{format(parseISO(bracket.startDate), 'MMM d')} - {format(parseISO(bracket.endDate), 'MMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                <span className="capitalize">{bracket.timeframe} Tournament</span>
              </div>
              
              <div className="flex items-center text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
                <Swords className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                <span>{bracket.size} Stock Battle</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {bracket.status !== 'completed' ? (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center" 
                  onClick={handleUpdatePrices}
                  disabled={isUpdating || isResetting}
                >
                  {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Update Prices
                </Button>
                
                {bracket.status === 'pending' && (
                  <Button 
                    className="flex items-center" 
                    onClick={handleCompleteBracket}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Simulate Completion
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center" 
                  onClick={handleResetBracket}
                  disabled={isResetting}
                >
                  {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Reset Bracket
                </Button>
                
                <Button 
                  className="flex items-center" 
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Results
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Tournament Progress Bar */}
        {bracket.status !== 'completed' && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-blue-600" />
                Tournament Progress
              </h3>
              <div className="text-sm text-muted-foreground">
                {bracket.status === 'active' ? getTimeRemaining() : `Starts ${formatDistance(parseISO(bracket.startDate), new Date(), { addSuffix: true })}`}
              </div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <Progress 
                value={getProgressPercentage()} 
                className="h-2.5 mb-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Started {format(parseISO(bracket.startDate), 'MMM d')}</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
                <span>Ends {format(parseISO(bracket.endDate), 'MMM d')}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Scores Summary */}
        {(bracket.status === 'active' || bracket.status === 'completed') && (
          <div className="mt-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* User Score */}
              <div className={`rounded-lg p-4 ${bracket.status === 'completed' && bracket.winnerId === 'user' ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Your Performance</h3>
                      {bracket.status === 'completed' && bracket.winnerId === 'user' && (
                        <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-700">
                          <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                          Winner
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className={`text-2xl font-bold ${bracket.userPoints && bracket.userPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bracket.userPoints ? (bracket.userPoints >= 0 ? '+' : '') + bracket.userPoints.toFixed(2) : '0.00'}%
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">overall return</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Score */}
              <div className={`rounded-lg p-4 ${bracket.status === 'completed' && bracket.winnerId === 'ai' ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-800' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-2 mr-3">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{bracket.aiPersonality} AI Performance</h3>
                      {bracket.status === 'completed' && bracket.winnerId === 'ai' && (
                        <Badge variant="outline" className="bg-purple-100 border-purple-300 text-purple-700">
                          <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                          Winner
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className={`text-2xl font-bold ${bracket.aiPoints && bracket.aiPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bracket.aiPoints ? (bracket.aiPoints >= 0 ? '+' : '') + bracket.aiPoints.toFixed(2) : '0.00'}%
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">overall return</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="head-to-head" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px] mb-2">
          <TabsTrigger value="head-to-head">
            <Swords className="h-4 w-4 mr-2" />
            Head-to-Head
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="ai-profile">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Profile
          </TabsTrigger>
        </TabsList>
        
        {/* Head-to-Head View Tab */}
        <TabsContent value="head-to-head" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                Stock Battle: You vs {bracket.aiPersonality} AI
              </CardTitle>
              <CardDescription>
                See how your stock picks match up against the AI's selections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Entries */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center border-b pb-2">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Your Picks
                  </h3>
                  
                  {sortEntriesByPerformance(bracket.userEntries).map((entry, index) => {
                    const adjustedPerformance = entry.percentChange 
                      ? (entry.direction === 'bearish' ? -entry.percentChange : entry.percentChange)
                      : 0;
                      
                    return (
                      <motion.div 
                        key={entry.id} 
                        className="bg-white dark:bg-slate-800 rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActivePick(entry)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="font-mono font-bold text-lg">{entry.symbol}</span>
                              {entry.direction === 'bullish' ? (
                                <TrendingUp className="h-4 w-4 ml-2 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 ml-2 text-red-600" />
                              )}
                              <Badge className="ml-2 capitalize">{entry.direction}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{entry.name}</p>
                          </div>
                          
                          {entry.percentChange !== undefined && (
                            <Badge variant={adjustedPerformance >= 0 ? "default" : "destructive"} className="text-sm">
                              {adjustedPerformance >= 0 ? '+' : ''}{adjustedPerformance.toFixed(2)}%
                            </Badge>
                          )}
                        </div>
                        
                        {entry.startPrice && (
                          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Start Price</p>
                              <p className="font-medium">${entry.startPrice.toFixed(2)}</p>
                            </div>
                            {entry.endPrice && (
                              <div>
                                <p className="text-muted-foreground">Current Price</p>
                                <p className="font-medium">${entry.endPrice.toFixed(2)}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* AI Entries */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center border-b pb-2">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                    {bracket.aiPersonality} AI Picks
                  </h3>
                  
                  {sortEntriesByPerformance(bracket.aiEntries).map((entry, index) => {
                    const adjustedPerformance = entry.percentChange 
                      ? (entry.direction === 'bearish' ? -entry.percentChange : entry.percentChange)
                      : 0;
                      
                    return (
                      <motion.div 
                        key={entry.id} 
                        className="bg-white dark:bg-slate-800 rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActivePick(entry)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="font-mono font-bold text-lg">{entry.symbol}</span>
                              {entry.direction === 'bullish' ? (
                                <TrendingUp className="h-4 w-4 ml-2 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 ml-2 text-red-600" />
                              )}
                              <Badge className="ml-2 capitalize">{entry.direction}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{entry.name}</p>
                          </div>
                          
                          {entry.percentChange !== undefined && (
                            <Badge variant={adjustedPerformance >= 0 ? "default" : "destructive"} className="text-sm">
                              {adjustedPerformance >= 0 ? '+' : ''}{adjustedPerformance.toFixed(2)}%
                            </Badge>
                          )}
                        </div>
                        
                        {entry.startPrice && (
                          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Start Price</p>
                              <p className="font-medium">${entry.startPrice.toFixed(2)}</p>
                            </div>
                            {entry.endPrice && (
                              <div>
                                <p className="text-muted-foreground">Current Price</p>
                                <p className="font-medium">${entry.endPrice.toFixed(2)}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-blue-600" />
                Performance Tracking
              </CardTitle>
              <CardDescription>
                Detailed statistics and performance metrics for this tournament
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Your Return</h4>
                    <p className={`text-3xl font-bold ${bracket.userPoints && bracket.userPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bracket.userPoints ? (bracket.userPoints >= 0 ? '+' : '') + bracket.userPoints.toFixed(2) : '0.00'}%
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">AI Return</h4>
                    <p className={`text-3xl font-bold ${bracket.aiPoints && bracket.aiPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bracket.aiPoints ? (bracket.aiPoints >= 0 ? '+' : '') + bracket.aiPoints.toFixed(2) : '0.00'}%
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Winner</h4>
                    {bracket.status === 'completed' ? (
                      <div className="flex items-center">
                        <Trophy className="h-6 w-6 text-amber-500 mr-2" />
                        <p className="text-2xl font-bold">
                          {bracket.winnerId === 'user' ? 'You' : bracket.winnerId === 'ai' ? 'AI' : 'Tie'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Detailed Match Results</h3>
                <div className="overflow-x-auto">
                  <BracketVisualizer bracket={bracket} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Profile Tab */}
        <TabsContent value="ai-profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                {bracket.aiPersonality} AI Profile
              </CardTitle>
              <CardDescription>
                Learn about the AI trading style and strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIOpponentProfile personalityId={bracket.aiPersonality} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Bracket Results</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Button 
                className="flex-1 flex justify-center items-center gap-3" 
                onClick={copyShareLink}
              >
                <Share2 className="h-4 w-4" />
                Copy Link
              </Button>
              
              {/* Add more share options here if needed */}
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-muted-foreground text-sm">
                Share your {bracket.status === 'completed' ? 
                  (bracket.winnerId === 'user' ? 'victory' : 'battle') : 
                  'bracket'} with friends and challenge them to beat your performance!
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BracketDetail;
