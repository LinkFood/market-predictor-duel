
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LeaderboardEntry } from "@/types";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, currentUserId }) => {
  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    } else if (rank === 2) {
      return <Trophy className="h-4 w-4 text-gray-400" />;
    } else if (rank === 3) {
      return <Trophy className="h-4 w-4 text-amber-800" />;
    }
    return rank;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">Predictions</TableHead>
            <TableHead className="text-right">Accuracy</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Win Rate vs AI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.userId} className={cn(entry.userId === currentUserId && "bg-secondary")}>
              <TableCell className="font-medium">
                <div className="flex justify-center items-center">
                  {getRankDisplay(entry.rank)}
                </div>
              </TableCell>
              <TableCell>{entry.username}</TableCell>
              <TableCell className="text-right">{entry.points.toLocaleString()}</TableCell>
              <TableCell className="text-right">{entry.totalPredictions}</TableCell>
              <TableCell className="text-right">{(entry.accuracy * 100).toFixed(1)}%</TableCell>
              <TableCell className="text-right hidden sm:table-cell">{(entry.winRateAgainstAi * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
