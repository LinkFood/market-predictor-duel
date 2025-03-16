
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketDataTable from "@/components/MarketDataTable";
import { mockMarketData, mockStockData } from "@/data/mockData";

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
                <MarketDataTable data={mockStockData.slice(0, 5)} title="" />
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
