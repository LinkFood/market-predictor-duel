
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataCard from "@/components/DataCard";
import PerformanceChart from "@/components/PerformanceChart";
import { ArrowUp, Award, BarChart3, Trophy, User } from "lucide-react";

const Profile: React.FC = () => {
  // Mock user data - would come from auth context in a real app
  const userData = {
    username: "InvestorPro",
    joinDate: "May 2023",
    totalPredictions: 47,
    correctPredictions: 29,
    accuracy: 61.7,
    winsAgainstAI: 24,
    lossesAgainstAI: 19,
    ties: 4,
    currentStreak: 3,
    bestStreak: 7,
    badges: ["5-Win Streak", "10 Correct Predictions", "Market Master"]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-market-blue flex items-center justify-center text-white">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{userData.username}</h1>
            <p className="text-muted-foreground">Member since {userData.joinDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard 
          title="Prediction Accuracy" 
          value={`${userData.accuracy}%`} 
          icon={<BarChart3 />} 
          description={`${userData.correctPredictions} of ${userData.totalPredictions} correct`}
          trend="up"
        />
        <DataCard 
          title="Record vs. AI" 
          value={`${userData.winsAgainstAI}W - ${userData.lossesAgainstAI}L - ${userData.ties}T`} 
          icon={<Trophy />} 
          description="51% win rate against AI"
        />
        <DataCard 
          title="Current Streak" 
          value={userData.currentStreak.toString()} 
          icon={<ArrowUp />} 
          description={`Best streak: ${userData.bestStreak}`}
          trend="up"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
          <CardDescription>Your prediction accuracy over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PerformanceChart />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="predictions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Predictions</CardTitle>
              <CardDescription>Your recent market predictions and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Recent predictions will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Achievements you've earned through predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userData.badges.map((badge, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-market-blue/10 flex items-center justify-center text-market-blue">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Account settings will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
