/**
 * CreateBracket Page
 * Page for creating a new bracket competition
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import BracketForm from "@/components/duel/BracketForm";
import { AIPersonality, BracketSize, BracketTimeframe, Direction } from "@/lib/duel/types";
import { createBracket } from "@/lib/duel/bracket-service";

const CreateBracket: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  // Handle bracket creation
  const handleCreateBracket = async (
    timeframe: BracketTimeframe,
    size: BracketSize,
    entries: { symbol: string; direction: Direction }[],
    aiPersonality?: AIPersonality
  ) => {
    setIsCreating(true);
    try {
      // Create the bracket
      const bracket = await createBracket(timeframe, size, entries, aiPersonality);
      
      // Show success toast
      toast({
        title: "Bracket Created!",
        description: `Your ${timeframe} bracket with ${size} stocks has been created successfully.`,
      });
      
      // Navigate to the bracket detail page
      navigate(`/app/brackets/${bracket.id}`);
    } catch (error) {
      console.error("Error creating bracket:", error);
      toast({
        title: "Error",
        description: "Failed to create bracket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Create New Bracket | Stock Duel</title>
      </Helmet>
      
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold">Create New Bracket</h1>
          <p className="text-gray-500">
            Select stocks and compete against AI in a head-to-head bracket tournament
          </p>
        </motion.div>
        
        <BracketForm onCreateBracket={handleCreateBracket} />
      </div>
    </>
  );
};

export default CreateBracket;