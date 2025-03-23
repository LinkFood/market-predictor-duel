/**
 * BracketDetail Page
 * Displays the details and visualization of a specific bracket
 */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Share2,
  Trophy,
  ChevronDown,
  Users,
  Trash2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import BracketVisualizer from "@/components/duel/BracketVisualizer";
import AIOpponentProfile from "@/components/duel/AIOpponentProfile";
import { Bracket } from "@/lib/duel/types";
import { getBracketById, updateBracketPrices, resetBracket, deleteBracket } from "@/lib/duel/bracket-service";
import { format, formatDistance, parseISO } from "date-fns";

const BracketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  // Load bracket data
  useEffect(() => {
    const fetchBracket = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const bracketData = await getBracketById(id);
        setBracket(bracketData);
      } catch (err) {
        console.error("Error fetching bracket:", err);
        setError("Failed to load bracket data. It may have been deleted or you may not have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBracket();
  }, [id]);
  
  // Handle refresh bracket data
  const handleRefreshBracket = async () => {
    if (!id || !bracket) return;
    
    setIsUpdating(true);
    try {
      const updatedBracket = await updateBracketPrices(id);
      setBracket(updatedBracket);
      
      toast({
        title: "Bracket Updated",
        description: "The bracket data has been refreshed with the latest prices.",
      });
    } catch (err) {
      console.error("Error updating bracket:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update bracket with latest data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle reset bracket
  const handleResetBracket = async () => {
    if (!id || !bracket) return;
    
    setIsUpdating(true);
    setIsResetDialogOpen(false);
    
    try {
      const resetBracketData = await resetBracket(id);
      setBracket(resetBracketData);
      
      toast({
        title: "Bracket Reset",
        description: "The bracket has been reset and is ready to start again.",
      });
    } catch (err) {
      console.error("Error resetting bracket:", err);
      toast({
        title: "Reset Failed",
        description: "Failed to reset bracket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle delete bracket
  const handleDeleteBracket = async () => {
    if (!id || !bracket) return;
    
    setIsUpdating(true);
    setIsDeleteDialogOpen(false);
    
    try {
      await deleteBracket(id);
      
      toast({
        title: "Bracket Deleted",
        description: "The bracket has been deleted successfully.",
      });
      
      // Navigate back to brackets list
      navigate('/app/brackets');
    } catch (err) {
      console.error("Error deleting bracket:", err);
      toast({
        title: "Delete Failed",
        description: "Failed to delete bracket. Please try again.",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };
  
  // Format timeframe as human readable
  const formatTimeframe = (timeframe?: string) => {
    if (!timeframe) return '';
    
    switch (timeframe) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return timeframe;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center">
            <RefreshCw className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }
  
  // Show error
  if (error || !bracket) {
    return (
      <div className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Bracket Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "The requested bracket could not be found."}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/app/brackets')}
            >
              View All Brackets
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{bracket.name} | Stock Duel</title>
      </Helmet>
      
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold">{bracket.name}</h1>
                <div className="flex items-center flex-wrap gap-3 mt-1">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{format(parseISO(bracket.startDate), 'MMM d')} - {format(parseISO(bracket.endDate), 'MMM d')}</span>
                  </div>
                  
                  <Badge variant="outline">
                    {formatTimeframe(bracket.timeframe)} • {bracket.size} stocks
                  </Badge>
                  
                  {getStatusBadge(bracket.status)}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {bracket.status === 'pending' ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRefreshBracket}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Now
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshBracket}
                  disabled={isUpdating || bracket.status === 'completed'}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                  Update
                </Button>
              )}
              
              <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating || bracket.status === 'active'}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Bracket</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reset this bracket? This will clear all progress and start over with the same stocks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetBracket}>Reset Bracket</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Bracket</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this bracket? This action cannot be undone, and all associated data will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteBracket} className="bg-red-600 hover:bg-red-700">
                      Delete Bracket
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
        
        <Tabs defaultValue="bracket" className="space-y-8">
          <TabsList>
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="opponent">AI Opponent</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bracket" className="space-y-6">
            {/* Bracket Status Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold mb-1">Your Bracket Challenge</h2>
                      <p className="opacity-90">
                        {bracket.status === 'pending' ? 'Starting soon' : 
                         bracket.status === 'active' ? `Ends ${formatDistance(parseISO(bracket.endDate), new Date(), { addSuffix: true })}` :
                         'Challenge completed'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold mb-1">
                        {bracket.userPoints?.toFixed(2)}% vs {bracket.aiPoints?.toFixed(2)}%
                      </div>
                      {bracket.winnerId && (
                        <div className="flex items-center space-x-2 justify-end">
                          <Trophy className="w-4 h-4 text-yellow-300" />
                          <span>{bracket.winnerId === 'user' ? 'You win!' : `${bracket.aiPersonality} AI wins`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Bracket Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Tournament Bracket</CardTitle>
                <CardDescription>
                  Track the progress of your stocks versus the AI's picks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BracketVisualizer bracket={bracket} />
              </CardContent>
            </Card>
            
            {/* Stocks Table */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Picks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Stock</th>
                          <th className="pb-2">Direction</th>
                          <th className="pb-2">Start</th>
                          <th className="pb-2">Current</th>
                          <th className="pb-2">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bracket.userEntries.map((entry, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">
                              <div className="font-medium">{entry.symbol}</div>
                              <div className="text-xs text-gray-500">{entry.name}</div>
                            </td>
                            <td className="py-2">
                              <Badge variant={entry.direction === 'bullish' ? 'default' : 'destructive'}>
                                {entry.direction === 'bullish' ? 'Bullish' : 'Bearish'}
                              </Badge>
                            </td>
                            <td className="py-2">${entry.startPrice.toFixed(2)}</td>
                            <td className="py-2">${entry.endPrice?.toFixed(2) || '-'}</td>
                            <td className="py-2">
                              {entry.percentChange !== undefined ? (
                                <span className={entry.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {entry.percentChange >= 0 ? '+' : ''}{entry.percentChange.toFixed(2)}%
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{bracket.aiPersonality} AI Picks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Stock</th>
                          <th className="pb-2">Direction</th>
                          <th className="pb-2">Start</th>
                          <th className="pb-2">Current</th>
                          <th className="pb-2">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bracket.aiEntries.map((entry, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">
                              <div className="font-medium">{entry.symbol}</div>
                              <div className="text-xs text-gray-500">{entry.name}</div>
                            </td>
                            <td className="py-2">
                              <Badge variant={entry.direction === 'bullish' ? 'default' : 'destructive'}>
                                {entry.direction === 'bullish' ? 'Bullish' : 'Bearish'}
                              </Badge>
                            </td>
                            <td className="py-2">${entry.startPrice.toFixed(2)}</td>
                            <td className="py-2">${entry.endPrice?.toFixed(2) || '-'}</td>
                            <td className="py-2">
                              {entry.percentChange !== undefined ? (
                                <span className={entry.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {entry.percentChange >= 0 ? '+' : ''}{entry.percentChange.toFixed(2)}%
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="opponent">
            <div className="max-w-2xl mx-auto">
              <AIOpponentProfile 
                personalityId={bracket.aiPersonality} 
                wins={10}
                losses={5}
                totalCompetitions={15}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Bracket Statistics</CardTitle>
                <CardDescription>Detailed performance metrics for this bracket</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Your Performance</h3>
                    <p className="text-3xl font-bold mb-1 text-blue-600">
                      {bracket.userPoints?.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500">Total Return</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">AI Performance</h3>
                    <p className="text-3xl font-bold mb-1 text-purple-600">
                      {bracket.aiPoints?.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500">Total Return</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Outperformance</h3>
                    <p className={`text-3xl font-bold mb-1 ${((bracket.userPoints || 0) - (bracket.aiPoints || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {((bracket.userPoints || 0) - (bracket.aiPoints || 0)).toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500">Your Edge vs AI</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Best Performing Stocks</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Your best stock */}
                    {bracket.userEntries.length > 0 && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Your Best Pick</h4>
                        {(() => {
                          // Find best performing user stock
                          const userEntries = [...bracket.userEntries];
                          const sortedUserEntries = userEntries.sort((a, b) => {
                            const aPerf = a.percentChange !== undefined 
                              ? (a.direction === 'bearish' ? -a.percentChange : a.percentChange) 
                              : -Infinity;
                            const bPerf = b.percentChange !== undefined 
                              ? (b.direction === 'bearish' ? -b.percentChange : b.percentChange) 
                              : -Infinity;
                            return bPerf - aPerf;
                          });
                          
                          const bestUserStock = sortedUserEntries[0];
                          
                          if (!bestUserStock || bestUserStock.percentChange === undefined) {
                            return <p className="text-gray-500">No data available</p>;
                          }
                          
                          const performance = bestUserStock.direction === 'bearish' 
                            ? -bestUserStock.percentChange 
                            : bestUserStock.percentChange;
                          
                          return (
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold">{bestUserStock.symbol}</div>
                                <div className="text-sm text-gray-500">
                                  {bestUserStock.direction === 'bullish' ? 'Bullish' : 'Bearish'} Prediction
                                </div>
                              </div>
                              <div className={`text-xl font-bold ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {performance >= 0 ? '+' : ''}{performance.toFixed(2)}%
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    {/* AI best stock */}
                    {bracket.aiEntries.length > 0 && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">AI's Best Pick</h4>
                        {(() => {
                          // Find best performing AI stock
                          const aiEntries = [...bracket.aiEntries];
                          const sortedAiEntries = aiEntries.sort((a, b) => {
                            const aPerf = a.percentChange !== undefined 
                              ? (a.direction === 'bearish' ? -a.percentChange : a.percentChange) 
                              : -Infinity;
                            const bPerf = b.percentChange !== undefined 
                              ? (b.direction === 'bearish' ? -b.percentChange : b.percentChange) 
                              : -Infinity;
                            return bPerf - aPerf;
                          });
                          
                          const bestAiStock = sortedAiEntries[0];
                          
                          if (!bestAiStock || bestAiStock.percentChange === undefined) {
                            return <p className="text-gray-500">No data available</p>;
                          }
                          
                          const performance = bestAiStock.direction === 'bearish' 
                            ? -bestAiStock.percentChange 
                            : bestAiStock.percentChange;
                          
                          return (
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold">{bestAiStock.symbol}</div>
                                <div className="text-sm text-gray-500">
                                  {bestAiStock.direction === 'bullish' ? 'Bullish' : 'Bearish'} Prediction
                                </div>
                              </div>
                              <div className={`text-xl font-bold ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {performance >= 0 ? '+' : ''}{performance.toFixed(2)}%
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BracketDetail;