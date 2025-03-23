import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, ArrowUp, Users, PieChart } from "lucide-react";
import { LeaderboardEntry } from "@/lib/prediction/types";
import { getLeaderboard, getUserRank } from "@/lib/prediction/leaderboard";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<"all" | "weekly" | "monthly">("all");

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
        
        if (user) {
          const rank = await getUserRank(user.id);
          setUserRank(rank);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [user, timeframe]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const userPosition = user ? leaderboard.findIndex(entry => entry.userId === user.id) : -1;

  const getMedal = (position: number) => {
    if (position === 0) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (position === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 2) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="font-bold text-muted-foreground">{position + 1}</span>;
  };

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <motion.div 
        className="space-y-2"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other predictors</p>
      </motion.div>

      {user && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <Trophy className="h-7 w-7 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Your Ranking</h3>
                    {loading ? (
                      <Skeleton className="h-7 w-20 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {userRank ? (
                          <>
                            #{userRank}
                            {userRank <= 10 && (
                              <Badge className="ml-2 bg-green-500 hover:bg-green-600">Top 10</Badge>
                            )}
                          </>
                        ) : (
                          "Not ranked yet"
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <Button className="font-medium" size="sm" onClick={() => window.location.href = "/app/predict"}>
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Climb the Ranks
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setTimeframe(value as any)}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{leaderboard.length} users ranked</span>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <LeaderboardTable 
            leaderboard={leaderboard} 
            loading={loading} 
            userPosition={userPosition}
            getMedal={getMedal}
          />
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <LeaderboardTable 
            leaderboard={leaderboard} 
            loading={loading} 
            userPosition={userPosition}
            getMedal={getMedal}
          />
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <LeaderboardTable 
            leaderboard={leaderboard} 
            loading={loading} 
            userPosition={userPosition}
            getMedal={getMedal}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  userPosition: number;
  getMedal: (position: number) => React.ReactNode;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  leaderboard, 
  loading, 
  userPosition,
  getMedal
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-2">
          <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">No Data Yet</h3>
          <p className="text-muted-foreground">
            Be the first to make predictions and join the leaderboard!
          </p>
          <Button className="mt-2" asChild>
            <a href="/app/predict">Make a Prediction</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="bg-muted rounded-lg overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 py-3 px-4 text-sm font-medium text-muted-foreground border-b">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">User</div>
          <div className="col-span-2 text-center">Win Rate</div>
          <div className="col-span-2 text-center">Predictions</div>
          <div className="col-span-2 text-center">Points</div>
        </div>

        <div className="divide-y">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.userId} 
              className={`grid grid-cols-12 py-4 px-4 items-center ${
                index === userPosition ? 'bg-primary/5' : 'hover:bg-muted/70'
              } transition-colors`}
            >
              <div className="col-span-1 flex justify-center">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  index === 0 ? "bg-amber-100 text-amber-700" : 
                  index === 1 ? "bg-gray-100 text-gray-700" : 
                  index === 2 ? "bg-amber-50 text-amber-800" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {getMedal(index)}
                </div>
              </div>
              
              <div className="col-span-5 flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={entry.avatarUrl || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {entry.username ? entry.username.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {entry.username || `User ${index + 1}`}
                    {index === userPosition && (
                      <Badge className="ml-2 bg-primary/20 text-primary border-primary/30" variant="outline">You</Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Joined {entry.joinDate || "recently"}</p>
                </div>
              </div>
              
              <div className="col-span-2 text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="block mx-auto">
                      <span className="font-medium">{Math.round(entry.accuracy * 100)}%</span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{Math.round(entry.totalPredictions * (entry.accuracy / 100))} correct of {entry.totalPredictions} predictions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="col-span-2 text-center font-medium">
                {entry.totalPredictions}
              </div>
              
              <div className="col-span-2 text-center">
                <span className="font-bold text-lg">{entry.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
