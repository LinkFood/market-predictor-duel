
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
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
              <span className="hidden md:inline text-sm text-gray-600">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
