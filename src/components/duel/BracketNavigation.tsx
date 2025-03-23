import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeft, 
  ChevronRight, 
  ListFilter, 
  Zap, 
  Clock, 
  CheckCircle, 
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { Bracket } from '@/lib/duel/types';
import { format, parseISO } from 'date-fns';

interface BracketNavigationProps {
  currentBracketId: string;
  showBackToList?: boolean;
}

const BracketNavigation: React.FC<BracketNavigationProps> = ({ 
  currentBracketId,
  showBackToList = true
}) => {
  const navigate = useNavigate();
  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Mock data for demonstration - in a real app, this would fetch from API
  useEffect(() => {
    // Simulating API call to get user brackets
    const fetchBrackets = async () => {
      setIsLoading(true);
      
      // Mock brackets data
      const mockBrackets: Bracket[] = [
        {
          id: "bracket-1",
          name: "Weekly Tech Face-off",
          status: "active",
          timeframe: "weekly",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-1",
          size: 3,
          aiPersonality: "ValueHunter",
          userEntries: [],
          aiEntries: [],
          matches: [],
          createdAt: new Date().toISOString(),
          userPoints: 0,
          aiPoints: 0
        },
        {
          id: "bracket-2",
          name: "Monthly Growth Stars",
          status: "pending",
          timeframe: "monthly",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-1",
          size: 3,
          aiPersonality: "GrowthSeeker",
          userEntries: [],
          aiEntries: [],
          matches: [],
          createdAt: new Date().toISOString(),
          userPoints: 0,
          aiPoints: 0
        },
        {
          id: "bracket-3",
          name: "Tech Giants Showdown",
          status: "completed",
          timeframe: "weekly",
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          userId: "user-1",
          size: 6,
          aiPersonality: "TechTrends",
          userEntries: [],
          aiEntries: [],
          matches: [],
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          userPoints: 5.2,
          aiPoints: 3.8,
          winnerId: "user"
        }
      ];
      
      // Find the index of the current bracket
      const index = mockBrackets.findIndex(b => b.id === currentBracketId);
      
      setBrackets(mockBrackets);
      setCurrentIndex(index);
      setIsLoading(false);
    };
    
    fetchBrackets();
  }, [currentBracketId]);

  // Navigate to previous bracket
  const goToPrevious = () => {
    if (currentIndex > 0) {
      navigate(`/app/brackets/${brackets[currentIndex - 1].id}`);
    }
  };

  // Navigate to next bracket
  const goToNext = () => {
    if (currentIndex < brackets.length - 1) {
      navigate(`/app/brackets/${brackets[currentIndex + 1].id}`);
    }
  };

  // Status icon component
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'active':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full p-4 mb-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>
      </Card>
    );
  }

  // If bracket not found in the list
  if (currentIndex === -1) {
    return (
      <Card className="w-full p-4 mb-6 border border-slate-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Bracket not found in your tournaments
          </div>
          {showBackToList && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/app/brackets')}
              className="flex items-center text-sm h-9"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              All Brackets
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 mb-6 border border-slate-200 bg-white dark:bg-slate-950">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="hidden sm:flex items-center mr-2">
            <span className="text-xs text-muted-foreground mr-2">
              {currentIndex + 1} of {brackets.length}
            </span>
          </div>
          
          {currentIndex > 0 && (
            <div className="mr-2 hidden sm:block">
              <div className="flex flex-col items-end text-right">
                <span className="text-xs text-muted-foreground">Previous</span>
                <span className="text-sm font-medium truncate max-w-[100px]">
                  {brackets[currentIndex - 1].name}
                </span>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPrevious} 
            disabled={currentIndex <= 0}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center">
          <div className="flex space-x-1 mx-2">
            {brackets.map((bracket, idx) => (
              <Link 
                key={bracket.id} 
                to={`/app/brackets/${bracket.id}`}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Go to ${bracket.name}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNext} 
            disabled={currentIndex >= brackets.length - 1}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {currentIndex < brackets.length - 1 && (
            <div className="ml-2 hidden sm:block">
              <div className="flex flex-col items-start text-left">
                <span className="text-xs text-muted-foreground">Next</span>
                <span className="text-sm font-medium truncate max-w-[100px]">
                  {brackets[currentIndex + 1].name}
                </span>
              </div>
            </div>
          )}
          
          {showBackToList && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/app/brackets')}
              className="ml-2 flex items-center text-sm h-9"
            >
              <ListFilter className="h-4 w-4 mr-1" />
              All Brackets
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BracketNavigation;