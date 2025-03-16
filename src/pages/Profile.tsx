
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataCard from "@/components/DataCard";
import PerformanceChart from "@/components/PerformanceChart";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Award, BarChart3, LogOut, Save, Trophy, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

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

interface ProfileFormData {
  username: string;
  email: string;
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
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      username: user?.user_metadata?.username || "User",
      email: user?.email || "",
    }
  });
  
  // Load user data
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch the user profile from Supabase
        // For now we'll just use the mock data with the actual user email
        
        // Example of how you would fetch this data:
        // const { data, error } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('user_id', user?.id)
        //   .single();
        
        // if (error) throw error;
        
        // Set form values
        setValue('username', user?.user_metadata?.username || "User");
        setValue('email', user?.email || "");
        
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{userData.username}</h1>
            <p className="text-muted-foreground">Member since {userData.joinDate}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
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
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-indigo-600"></div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Recent predictions will be displayed here.</p>
              )}
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
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-indigo-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {userData.badges.map((badge, index) => (
                    <div key={index} className="border rounded-lg p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                        <Award className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              )}
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
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-indigo-600"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      {...register('username', { required: 'Username is required' })}
                      className={errors.username ? 'border-red-500' : ''}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      {...register('email')}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
