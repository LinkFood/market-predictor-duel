
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // For mobile, create a more app-like feel with simplified UI
  if (isMobile) {
    return (
      <div className="pt-1 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Hello, {user.username}!
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Ready to challenge the AI today?</span>
            </div>
          </div>
          
          {/* No buttons on mobile - we use the floating action button instead */}
          <div className="hidden">
            <Link to="/app/profile">
              <Trophy className="h-6 w-6 text-amber-500" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop gets a more elaborate header
  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hello, <span className="text-primary">{user.username}</span>!
        </h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Ready to challenge the AI today?</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="secondary" 
          onClick={() => navigate("/app/profile")} 
          className="rounded-full"
        >
          <Trophy className="mr-2 h-4 w-4 text-amber-500" />
          My Stats
        </Button>
        <Button 
          onClick={() => navigate("/app/predict")} 
          className="ios-button-primary"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Make Prediction
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
