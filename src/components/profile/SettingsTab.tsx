
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

const profileFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  avatarUrl: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

interface SettingsTabProps {
  defaultUsername: string;
  defaultEmail: string;
  defaultAvatarUrl?: string;
  isLoading: boolean;
  isUpdating: boolean;
  onUpdateProfile: (data: ProfileFormData) => Promise<void>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  defaultUsername,
  defaultEmail,
  defaultAvatarUrl,
  isLoading,
  isUpdating,
  onUpdateProfile
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: defaultUsername,
      email: defaultEmail,
      avatarUrl: defaultAvatarUrl
    }
  });
  
  const watchAvatarUrl = watch('avatarUrl');
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real implementation, this would upload to Supabase storage
    // For now, just create a data URL
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setValue('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onUpdateProfile)}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your profile information and preferences
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Update your profile details and how others see you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div>
                <Avatar className="h-20 w-20">
                  <AvatarImage src={watchAvatarUrl} />
                  <AvatarFallback>{getInitials(defaultUsername)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="w-full md:w-auto"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: JPG, PNG. Max size: 2MB
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register('username')}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm font-medium text-destructive">{errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                To change your email, please contact support
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
            <Button variant="default" type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                Password reset functionality is not currently available. 
                Please contact support if you need to reset your password.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notification settings coming soon. Stay tuned!
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default SettingsTab;
