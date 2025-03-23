
import React from "react";
import LeaderboardWidget from "@/components/LeaderboardWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

const TopPerformers: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Top Performers</h2>
        <Link to="/app/leaderboard">
          <Button variant="ghost" size="sm" className="text-sm">
            <Trophy className="h-4 w-4 mr-1" />
            Full Leaderboard
          </Button>
        </Link>
      </div>
      <LeaderboardWidget />
    </div>
  );
};

export default TopPerformers;
