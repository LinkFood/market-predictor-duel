
import React from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import DataSourceIndicator from "./form/DataSourceIndicator";

interface SearchResultsProps {
  searchResults: any[];
  showSearchResults: boolean;
  searchQuery: string;
  error: string | null;
  usingMockData: boolean;
  onSelectStock: (stock: any) => void;
  onSelect: (stock: any, query: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  showSearchResults,
  searchQuery,
  error,
  usingMockData,
  onSelectStock,
  onSelect
}) => {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!showSearchResults) {
    return null;
  }

  if (searchResults.length > 0) {
    return (
      <>
        <DataSourceIndicator isRealData={!usingMockData} />
        <div className="mt-2 border rounded-md shadow-sm overflow-hidden">
          <ul className="divide-y">
            {searchResults.map((stock, index) => (
              <li
                key={`${stock.symbol}-${index}`}
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  onSelectStock({...stock, usingMockData});
                  onSelect(stock, stock.name);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{stock.name}</div>
                    <div className="text-xs text-gray-500">{stock.symbol}</div>
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    ${stock.price.toFixed(2)}
                    <span className="ml-2">
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
  
  if (showSearchResults && searchResults.length === 0) {
    return (
      <div className="mt-2 text-sm text-gray-500 text-center p-4 border rounded-md">
        No stocks found matching "{searchQuery}"
      </div>
    );
  }
  
  return null;
};

export default SearchResults;
