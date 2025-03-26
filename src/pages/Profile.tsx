
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictionsTab from "@/components/profile/PredictionsTab";
import SettingsTab from "@/components/profile/SettingsTab";
import BadgesTab from "@/components/profile/BadgesTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useAuth();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        onLogout={() => {}}
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
            <PredictionsTab />
          </TabsContent>

          <TabsContent value="badges">
            <BadgesTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
