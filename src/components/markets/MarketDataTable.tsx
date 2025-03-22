
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MarketData } from "@/types";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MarketDataTableProps {
  data: MarketData[];
  title: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const MarketDataTable: React.FC<MarketDataTableProps> = ({ 
  data, 
  title, 
  onRefresh, 
  isLoading = false 
}) => {
  return (
    <div className="space-y-2">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          )}
        </div>
      )}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">% Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right financial-value">
                  {typeof item.value === "number" ? item.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.value}
                </TableCell>
                <TableCell className={cn("text-right financial-value", item.change >= 0 ? "bullish" : "bearish")}>
                  <div className="flex items-center justify-end gap-1">
                    {item.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(item.change).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </TableCell>
                <TableCell className={cn("text-right financial-value", item.changePercent >= 0 ? "bullish" : "bearish")}>
                  {(item.changePercent >= 0 ? "+" : "") + item.changePercent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MarketDataTable;
