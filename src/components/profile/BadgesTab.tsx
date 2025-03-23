
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  isEarned: boolean;
}

interface BadgesTabProps {
  badges: Badge[];
  isLoading: boolean;
}

const BadgesTab: React.FC<BadgesTabProps> = ({ badges, isLoading }) => {
  const defaultBadges: Badge[] = [
    {
      id: "first-win",
      name: "First Victory",
      description: "Win your first prediction against AI",
      icon: "🏆",
      isEarned: false
    },
    {
      id: "streak-3",
      name: "Hot Streak",
      description: "Win 3 predictions in a row",
      icon: "🔥",
      isEarned: false
    },
    {
      id: "all-personalities",
      name: "AI Whisperer",
      description: "Beat all AI personalities at least once",
      icon: "🤖",
      isEarned: false
    },
    {
      id: "perfect-bracket",
      name: "Perfect Bracket",
      description: "Complete a bracket with all correct predictions",
      icon: "✨",
      isEarned: false
    },
    {
      id: "underdog-victory",
      name: "Underdog Victory",
      description: "Win with a prediction that had less than 30% confidence",
      icon: "🐕",
      isEarned: false
    },
    {
      id: "market-master",
      name: "Market Master",
      description: "Win 10 predictions in the same market sector",
      icon: "📈",
      isEarned: false
    }
  ];
  
  // Combine default badges with earned badges
  const allBadges = defaultBadges.map(defaultBadge => {
    const earnedBadge = badges.find(b => b.id === defaultBadge.id);
    if (earnedBadge) {
      return {
        ...defaultBadge,
        ...earnedBadge,
        isEarned: true
      };
    }
    return defaultBadge;
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Your Badges</h3>
        <p className="text-sm text-muted-foreground">
          Achievements you've earned by competing in StockDuel
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map((badge) => (
          <Card 
            key={badge.id}
            className={`overflow-hidden transition-all ${
              badge.isEarned 
                ? 'border-primary bg-primary/5' 
                : 'opacity-60 grayscale'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  {badge.name}
                </CardTitle>
                {badge.isEarned && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    Earned
                  </span>
                )}
              </div>
              <CardDescription>
                {badge.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {badge.isEarned && badge.earnedAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              )}
              {!badge.isEarned && (
                <p className="text-xs text-muted-foreground mt-2">
                  Keep trading to earn this badge!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          More badges will be unlocked as you continue your trading journey!
        </p>
      </div>
    </div>
  );
};

export default BadgesTab;
