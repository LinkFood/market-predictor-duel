
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

interface SettingsTabProps {
  defaultUsername: string;
  defaultEmail: string;
  isLoading: boolean;
  isUpdating: boolean;
  onUpdateProfile: (data: ProfileFormData) => Promise<void>;
}

export interface ProfileFormData {
  username: string;
  email: string;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  defaultUsername, 
  defaultEmail,
  isLoading, 
  isUpdating, 
  onUpdateProfile 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      username: defaultUsername,
      email: defaultEmail,
    }
  });

  return (
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
  );
};

export default SettingsTab;
