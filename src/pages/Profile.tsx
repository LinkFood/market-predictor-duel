
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

// Import new components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import PerformanceHistory from "@/components/profile/PerformanceHistory";
import PredictionsTab from "@/components/profile/PredictionsTab";
import BadgesTab from "@/components/profile/BadgesTab";
import SettingsTab, { ProfileFormData } from "@/components/profile/SettingsTab";

interface UserProfile {
  username: string;
  joinDate: string;
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  winsAgainstAI: number;
  lossesAgainstAI: number;
  ties: number;
  currentStreak: number;
  bestStreak: number;
  badges: string[];
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
    totalPredictions: 47,
    correctPredictions: 29,
    accuracy: 61.7,
    winsAgainstAI: 24,
    lossesAgainstAI: 19,
    ties: 4,
    currentStreak: 3,
    bestStreak: 7,
    badges: ["5-Win Streak", "10 Correct Predictions", "Market Master"]
  });
  
  // Load user data
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch the user profile from Supabase
        // For now we'll just use the mock data with the actual user email
        
        // For now just use dummy data with real user info
        setUserData({
          ...userData,
          username: user?.user_metadata?.username || "User",
          joinDate: new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });
        
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
  }, [user]);
  
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
        accuracy={userData.accuracy}
        totalPredictions={userData.totalPredictions}
        correctPredictions={userData.correctPredictions}
        winsAgainstAI={userData.winsAgainstAI}
        lossesAgainstAI={userData.lossesAgainstAI}
        ties={userData.ties}
        currentStreak={userData.currentStreak}
        bestStreak={userData.bestStreak}
      />

      <PerformanceHistory />

      <Tabs defaultValue="predictions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4 pt-4">
          <PredictionsTab isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="badges" className="space-y-4 pt-4">
          <BadgesTab badges={userData.badges} isLoading={isLoading} />
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
