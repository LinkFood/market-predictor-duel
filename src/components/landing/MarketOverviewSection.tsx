
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketDataTable from "@/components/MarketDataTable";

// Mock data for market overview
const mockMarketData = [
  {
    name: "S&P 500",
    value: 4393.63,
    change: 27.37,
    changePercent: 0.63
  },
  {
    name: "Nasdaq",
    value: 13638.59,
    change: 128.41,
    changePercent: 0.95
  },
  {
    name: "Dow Jones",
    value: 34212.24,
    change: 183.56,
    changePercent: 0.54
  },
  {
    name: "Russell 2000",
    value: 1854.21,
    change: 12.87,
    changePercent: 0.70
  },
  {
    name: "VIX",
    value: 16.85,
    change: -0.52,
    changePercent: -3.00
  }
];

// Mock data for popular stocks
const mockStockData = [
  {
    name: "Apple Inc.",
    symbol: "AAPL",
    value: 173.45,
    change: 2.21,
    changePercent: 1.29
  },
  {
    name: "Microsoft Corp",
    symbol: "MSFT",
    value: 338.11,
    change: 3.57,
    changePercent: 1.07
  },
  {
    name: "Amazon.com Inc",
    symbol: "AMZN",
    value: 131.94,
    change: 1.29,
    changePercent: 0.99
  },
  {
    name: "Alphabet Inc",
    symbol: "GOOGL",
    value: 131.86,
    change: 1.74,
    changePercent: 1.34
  },
  {
    name: "Tesla Inc",
    symbol: "TSLA",
    value: 183.25,
    change: -4.34,
    changePercent: -2.31
  }
];

const MarketOverviewSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Current Market Overview</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stay updated with the latest market movements
          </p>
        </div>
        
        <Tabs defaultValue="indices" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="indices" className="flex-1">Major Indices</TabsTrigger>
            <TabsTrigger value="stocks" className="flex-1">Popular Stocks</TabsTrigger>
          </TabsList>
          <TabsContent value="indices">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <MarketDataTable data={mockMarketData} title="" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stocks">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <MarketDataTable data={mockStockData} title="" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate("/register")}>
            Sign Up to Make Predictions
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketOverviewSection;
