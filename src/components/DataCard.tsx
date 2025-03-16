
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  className,
  trend
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {trend ? (
            <span className={trend === "up" ? "bullish" : trend === "down" ? "bearish" : ""}>
              {value}
            </span>
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
