
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getUserStats } from "@/lib/prediction";
import { UserStats } from "@/lib/prediction/types";

// Import components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import PerformanceHistory from "@/components/profile/PerformanceHistory";
import PredictionsTab from "@/components/profile/PredictionsTab";
import BadgesTab from "@/components/profile/BadgesTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";
import SettingsTab, { ProfileFormData } from "@/components/profile/SettingsTab";

interface UserProfile {
  username: string;
  joinDate: string;
  avatar_url?: string;
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State for user profile data
  const [userData, setUserData] = useState<UserProfile>({
    username: user?.user_metadata?.username || "User",
    joinDate: new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  });

  // State for user stats
  const [userStats, setUserStats] = useState<UserStats>({
    totalPredictions: 0,
    completedPredictions: 0,
    pendingPredictions: 0,
    totalPoints: 0,
    winRate: 0,
    winStreak: 0,
    bestWinStreak: 0,
    aiVictories: 0,
    userVictories: 0,
    ties: 0
  });
  
  // Load user data
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      try {
        // For now just use real user info
        setUserData({
          username: user?.user_metadata?.username || "User",
          joinDate: new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });
        
        // Load real user stats from Supabase
        const stats = await getUserStats(user?.id);
        setUserStats(stats);
        
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadUserProfile();
    }
  }, [user, toast]);
  
  // Handle profile update
  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { username: data.username }
      });
      
      if (error) throw error;
      
      // Update the local state
      setUserData({
        ...userData,
        username: data.username
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileHeader 
        username={userData.username}
        joinDate={userData.joinDate}
        onLogout={handleLogout}
      />

      <ProfileStats 
        accuracy={userStats.winRate}
        totalPredictions={userStats.totalPredictions}
        correctPredictions={userStats.totalPredictions * (userStats.winRate / 100)}
        winsAgainstAI={userStats.userVictories}
        lossesAgainstAI={userStats.aiVictories}
        ties={userStats.ties}
        currentStreak={userStats.winStreak}
        bestStreak={userStats.bestWinStreak}
      />

      <PerformanceHistory />

      <Tabs defaultValue="predictions">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4 pt-4">
          <PredictionsTab isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="badges" className="space-y-4 pt-4">
          <BadgesTab badges={[]} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4 pt-4">
          <SubscriptionTab isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <SettingsTab
            defaultUsername={userData.username}
            defaultEmail={user?.email || ""}
            isLoading={isLoading}
            isUpdating={isUpdating}
            onUpdateProfile={onUpdateProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
