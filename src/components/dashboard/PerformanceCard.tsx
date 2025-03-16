
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerformanceChart from "@/components/PerformanceChart";

const PerformanceCard: React.FC = () => {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Your Performance</CardTitle>
          <Tabs defaultValue="weekly" className="w-fit">
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs h-7 px-2">Day</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs h-7 px-2">Week</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-7 px-2">Month</TabsTrigger>
              <TabsTrigger value="allTime" className="text-xs h-7 px-2">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <PerformanceChart />
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
