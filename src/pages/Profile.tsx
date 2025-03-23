
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from "@/lib/auth-service";
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
  subscription_tier?: string;
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
        if (!user) return;
        
        // Fetch profile data
        const { profile, error } = await getUserProfile(user.id);
        
        if (error) {
          console.error('Error loading profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive"
          });
        } else if (profile) {
          setUserData({
            username: profile.username || user.user_metadata?.username || "User",
            joinDate: new Date(profile.created_at || user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            avatar_url: profile.avatar_url,
            subscription_tier: profile.subscription_tier
          });
        }
        
        // Load user stats from Supabase
        const stats = await getUserStats(user.id);
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
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [user, toast, navigate]);
  
  // Handle profile update
  const onUpdateProfile = async (data: ProfileFormData) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { success, error } = await updateUserProfile(user.id, {
        username: data.username,
        avatar_url: data.avatarUrl
      });
      
      if (!success) {
        throw new Error(error || 'Failed to update profile');
      }
      
      // Update the local state
      setUserData({
        ...userData,
        username: data.username,
        avatar_url: data.avatarUrl
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <ProfileHeader 
        username={userData.username}
        joinDate={userData.joinDate}
        avatarUrl={userData.avatar_url}
        subscriptionTier={userData.subscription_tier}
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
            defaultAvatarUrl={userData.avatar_url}
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
