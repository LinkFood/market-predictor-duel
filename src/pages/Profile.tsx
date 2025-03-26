
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictionsTab from "@/components/profile/PredictionsTab";
import SettingsTab from "@/components/profile/SettingsTab";
import BadgesTab from "@/components/profile/BadgesTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/profile/BadgesTab";
import { ProfileFormData } from "@/components/profile/SettingsTab";

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = async (): Promise<void> => {
    await signOut();
  };

  const handleUpdateProfile = async (data: ProfileFormData): Promise<void> => {
    try {
      setIsUpdating(true);
      
      // This would normally call supabase to update the profile
      // Simulating an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 flex justify-center items-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link to="/app/settings">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      <ProfileHeader
        username={user?.email?.split('@')[0] || 'User'}
        joinDate={formatDate(user?.created_at || new Date().toISOString())}
        avatarUrl={user?.user_metadata?.avatar_url}
        subscriptionTier="free"
        onLogout={handleLogout}
      />

      <div className="mt-8">
        <Tabs defaultValue="predictions" className="w-full">
          <TabsList>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions">
            <PredictionsTab isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="badges">
            <BadgesTab badges={badges} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab 
              defaultUsername={user?.email?.split('@')[0] || 'User'}
              defaultEmail={user?.email || ''}
              defaultAvatarUrl={user?.user_metadata?.avatar_url}
              isLoading={isLoading}
              isUpdating={isUpdating}
              onUpdateProfile={handleUpdateProfile}
            />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionTab isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
