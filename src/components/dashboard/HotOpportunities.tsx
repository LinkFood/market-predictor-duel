
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  ChevronRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Opportunity {
  name: string;
  description: string;
  confidence: number;
  movement: "bullish" | "bearish" | "volatile";
  icon: React.ReactNode;
}

interface HotOpportunitiesProps {
  opportunities: Opportunity[];
}

const HotOpportunities: React.FC<HotOpportunitiesProps> = ({ opportunities }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
            Hot Opportunities
          </CardTitle>
        </div>
        <CardDescription>
          High-confidence prediction opportunities detected by our AI
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => navigate("/predict")}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  {opportunity.icon}
                  <h4 className="font-semibold ml-2">{opportunity.name}</h4>
                </div>
                <Badge variant={opportunity.movement === "bullish" ? "default" : opportunity.movement === "bearish" ? "destructive" : "outline"} className="capitalize">
                  {opportunity.movement}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{opportunity.description}</span>
                <div className="flex items-center">
                  <span className="text-xs font-medium mr-2">{opportunity.confidence}% Confidence</span>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        opportunity.confidence > 85 ? "bg-emerald-500" : 
                        opportunity.confidence > 70 ? "bg-amber-500" : "bg-sky-500"
                      }`} 
                      style={{ width: `${opportunity.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t py-3">
        <Button variant="outline" onClick={() => navigate("/predict")} className="w-full">
          View All Opportunities
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotOpportunities;
