
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from "lucide-react";

interface BadgesTabProps {
  badges: string[];
  isLoading: boolean;
}

const BadgesTab: React.FC<BadgesTabProps> = ({ badges, isLoading }) => {
  return (
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
            {badges.map((badge, index) => (
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
  );
};

export default BadgesTab;
