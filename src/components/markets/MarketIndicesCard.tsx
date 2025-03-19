
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketData } from "@/types";

interface MarketIndicesCardProps {
  marketIndices: MarketData[];
}

const MarketIndicesCard: React.FC<MarketIndicesCardProps> = ({ marketIndices }) => {
  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-3">
        <CardTitle className="text-lg font-semibold">Market Indices</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {marketIndices.map((index, i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{index.name}</p>
                <p className={`text-sm ${index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium">{index.value.toLocaleString()}</p>
                <p className={`text-sm ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketIndicesCard;
