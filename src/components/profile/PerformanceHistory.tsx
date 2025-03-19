
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PerformanceChart from "@/components/PerformanceChart";

const PerformanceHistory: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance History</CardTitle>
        <CardDescription>Your prediction accuracy over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <PerformanceChart />
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceHistory;
