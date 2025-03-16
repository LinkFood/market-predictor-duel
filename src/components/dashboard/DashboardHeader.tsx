
import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hello, <span className="text-indigo-600 dark:text-indigo-400">{user.username}</span>!
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to challenge the AI today?
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate("/profile")} className="flex items-center">
          <Trophy className="mr-2 h-4 w-4 text-amber-500" />
          My Stats
        </Button>
        <Button onClick={() => navigate("/predict")} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
          <TrendingUp className="mr-2 h-4 w-4" />
          Make Prediction
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
