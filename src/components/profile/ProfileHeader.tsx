
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

interface ProfileHeaderProps {
  username: string;
  joinDate: string;
  onLogout: () => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  username, 
  joinDate, 
  onLogout 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{username}</h1>
          <p className="text-muted-foreground">Member since {joinDate}</p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onLogout}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
};

export default ProfileHeader;
