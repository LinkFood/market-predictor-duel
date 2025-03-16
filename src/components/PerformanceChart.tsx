
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PerformanceData {
  name: string;
  user: number;
  ai: number;
}

const performanceData: PerformanceData[] = [
  { name: "Markets", user: 68, ai: 72 },
  { name: "Technology", user: 82, ai: 75 },
  { name: "Healthcare", user: 65, ai: 70 },
  { name: "Energy", user: 58, ai: 62 },
  { name: "Finance", user: 74, ai: 68 },
];

const PerformanceChart: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Prediction Accuracy by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, ""]} />
              <Legend />
              <Bar dataKey="user" name="Your Accuracy" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ai" name="AI Accuracy" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
