import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, ThumbsUp, Calendar, Clock, AlertTriangle, Trophy, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import BracketVisualizer from "@/components/duel/BracketVisualizer";
import AIOpponentProfile from "@/components/duel/AIOpponentProfile";
import { Bracket } from "@/lib/duel/types";
import { getBracketById, completeBracket } from "@/lib/duel/bracket-service";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading bracket...</p>
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
      
      <div className="flex flex-col md:flex-row justify-between mb-6 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{bracket.name}</h1>
          <div className="flex items-center mt-1 space-x-2">
            <Badge variant={bracket.status === 'completed' ? 'default' : bracket.status === 'active' ? 'default' : 'secondary'}>
              {bracket.status === 'completed' ? 'Completed' : bracket.status === 'active' ? 'In Progress' : 'Pending'}
            </Badge>
            <span className="text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(bracket.startDate).toLocaleDateString()}
            </span>
            <span className="text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {bracket.timeframe}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          {bracket.status !== 'completed' && (
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleUpdatePrices}
              disabled={isUpdating || isResetting}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Update Prices
            </Button>
          )}
          
          {bracket.status === 'pending' && (
            <Button 
              className="flex items-center" 
              onClick={handleCompleteBracket}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
              Simulate Completion
            </Button>
          )}
          
          {bracket.status === 'completed' && (
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleResetBracket}
              disabled={isResetting}
            >
              {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Reset Bracket
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="bracket" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bracket">Bracket View</TabsTrigger>
          <TabsTrigger value="ai">AI Opponent</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bracket" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                Tournament Bracket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BracketVisualizer bracket={bracket} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Opponent Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <AIOpponentProfile personalityId={bracket.aiPersonality} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed statistics for this bracket will be shown here.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Your Picks</h3>
                  <p className="text-2xl font-bold">{bracket.userPoints?.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">AI Picks</h3>
                  <p className="text-2xl font-bold">{bracket.aiPoints?.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Overall Winner</h3>
                  <p className="text-2xl font-bold">{bracket.winnerId === 'user' ? 'You' : bracket.winnerId === 'ai' ? 'AI' : 'Pending'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BracketDetail;
