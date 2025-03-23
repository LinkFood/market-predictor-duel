
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Bracket } from "@/lib/duel/types";
import { getBracketById, updateBracketStatus } from "@/lib/duel/bracket-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowLeft, Check, Timer, RefreshCw, Trash2 } from "lucide-react";
import BracketVisualizer from "@/components/duel/BracketVisualizer";
import AIOpponentProfile from "@/components/duel/AIOpponentProfile";
import LoadingScreen from "@/components/LoadingScreen";

// Mock update functions
const updateBracketPrices = async (bracketId: string): Promise<boolean> => {
  console.log("Updating bracket prices", bracketId);
  return true;
};

const resetBracket = async (bracketId: string): Promise<boolean> => {
  console.log("Resetting bracket", bracketId);
  return true;
};

const BracketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadBracket() {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error("Bracket ID is required");
        }
        
        const bracketData = await getBracketById(id);
        
        if (!bracketData) {
          throw new Error("Bracket not found");
        }
        
        setBracket(bracketData);
      } catch (err) {
        console.error("Error loading bracket:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadBracket();
  }, [id]);

  const handleUpdatePrices = async () => {
    if (!bracket?.id) return;
    
    try {
      setIsUpdating(true);
      const success = await updateBracketPrices(bracket.id);
      
      if (success) {
        // Load updated bracket
        const updatedBracket = await getBracketById(bracket.id);
        if (updatedBracket) {
          setBracket(updatedBracket);
        }
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetBracket = async () => {
    if (!bracket?.id) return;
    
    try {
      setIsUpdating(true);
      const success = await resetBracket(bracket.id);
      
      if (success) {
        // Load updated bracket
        const updatedBracket = await getBracketById(bracket.id);
        if (updatedBracket) {
          setBracket(updatedBracket);
        }
      }
    } catch (error) {
      console.error("Error resetting bracket:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading bracket..." />;
  }

  if (error || !bracket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Bracket</h1>
          <p className="text-gray-600 mb-6">{error || "Bracket not found"}</p>
          <Button onClick={() => navigate("/brackets")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brackets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{bracket.name} | Stock Duel</title>
      </Helmet>
      
      <Button 
        variant="outline" 
        onClick={() => navigate("/brackets")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Brackets
      </Button>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">{bracket.name}</CardTitle>
                <div className="flex items-center">
                  {bracket.status === "active" && (
                    <Button variant="outline" size="sm" className="mr-2" onClick={handleUpdatePrices} disabled={isUpdating}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                      Update Prices
                    </Button>
                  )}
                  {bracket.status === "active" && (
                    <Button variant="outline" size="sm" onClick={handleResetBracket} disabled={isUpdating}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-slate-100 px-3 py-1 rounded-md text-sm flex items-center">
                  <Timer className="h-4 w-4 mr-1" />
                  {bracket.timeframe.charAt(0).toUpperCase() + bracket.timeframe.slice(1)}
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-md text-sm flex items-center">
                  {bracket.status === "pending" && <Timer className="h-4 w-4 mr-1" />}
                  {bracket.status === "active" && <RefreshCw className="h-4 w-4 mr-1" />}
                  {bracket.status === "completed" && <Check className="h-4 w-4 mr-1" />}
                  {bracket.status.charAt(0).toUpperCase() + bracket.status.slice(1)}
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-md text-sm">
                  {bracket.size} Stocks
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="overflow-auto">
                <BracketVisualizer bracket={bracket} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-96">
          <AIOpponentProfile aiPersonality={bracket.aiPersonality} />
        </div>
      </div>
    </div>
  );
};

export default BracketDetail;
