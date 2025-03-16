
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from './ui/avatar';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "An error occurred while signing out."
      });
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.substring(0, 1).toUpperCase();
  };

  return (
    <header className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger className="mr-2" />
          <h2 className="text-lg font-semibold md:hidden">StockDuel</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user.email || '')}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
