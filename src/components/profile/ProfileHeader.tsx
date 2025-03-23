
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, Crown } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  joinDate: string;
  avatarUrl?: string;
  subscriptionTier?: string;
  onLogout: () => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  joinDate,
  avatarUrl,
  subscriptionTier = "free",
  onLogout
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getSubscriptionColor = (tier: string): string => {
    switch (tier.toLowerCase()) {
      case 'pro':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getSubscriptionLabel = (tier: string): string => {
    switch (tier.toLowerCase()) {
      case 'pro':
        return 'Pro';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Free';
    }
  };
  
  return (
    <div className="flex justify-between items-center p-6 bg-card rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-2 border-background">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{getInitials(username)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{username}</h1>
            {subscriptionTier && subscriptionTier.toLowerCase() !== 'free' && (
              <Badge className={`ml-2 flex items-center gap-1 ${getSubscriptionColor(subscriptionTier)}`}>
                <Crown className="h-3 w-3" />
                {getSubscriptionLabel(subscriptionTier)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Member since {joinDate}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
