
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2, LogOut, User } from "lucide-react";

const Account: React.FC = () => {
  const { user, signOut, refreshSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: { username }
      });
      
      if (error) {
        throw error;
      }
      
      await refreshSession();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <Helmet>
        <title>Account - StockDuel</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-indigo-600 text-white text-xl">
                  {getInitials(username || email || "User")}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{username || "User"}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Email verification</span>
                {user?.email_confirmed_at ? (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" /> Not verified
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Account created</span>
                <span className="text-sm">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Email address cannot be changed
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-4">
                  <Input
                    id="password"
                    value="••••••••••"
                    type="password"
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
