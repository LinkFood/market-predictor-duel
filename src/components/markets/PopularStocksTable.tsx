
import React, { useState, useEffect } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Search, RefreshCw, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { POPULAR_TICKERS } from "@/lib/market/data/popular-tickers";
import { getMockStockData } from "@/lib/market/mock-data-utils";
import { StockData } from "@/lib/market/types";
import { Badge } from "@/components/ui/badge";

const PopularStocksTable: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"symbol" | "price" | "change" | "changePercent">("symbol");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 25;
  
  // Generate mock data for all popular stocks
  const generateStocksData = () => {
    setIsLoading(true);
    
    // Generate mock data for all tickers
    const stocksData = POPULAR_TICKERS.map(ticker => getMockStockData(ticker));
    
    // Sort by default sorting
    const sortedData = sortStocks(stocksData, sortField, sortDirection);
    
    setStocks(sortedData);
    applyFilters(sortedData, searchQuery);
    setIsLoading(false);
  };
  
  // Sort stocks by the given field and direction
  const sortStocks = (data: StockData[], field: string, direction: "asc" | "desc") => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "change":
          comparison = a.change - b.change;
          break;
        case "changePercent":
          comparison = a.changePercent - b.changePercent;
          break;
        default:
          comparison = 0;
      }
      
      return direction === "asc" ? comparison : -comparison;
    });
  };
  
  // Apply filters and search to the stocks data
  const applyFilters = (data: StockData[], query: string) => {
    if (!query.trim()) {
      setFilteredStocks(data);
      return;
    }
    
    const filtered = data.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredStocks(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(stocks, query);
  };
  
  // Handle sort change
  const handleSort = (field: "symbol" | "price" | "change" | "changePercent") => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    const sortedData = sortStocks(stocks, field, newDirection);
    setStocks(sortedData);
    applyFilters(sortedData, searchQuery);
  };
  
  // Calculate pagination information
  const totalPages = Math.max(1, Math.ceil(filteredStocks.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleStocks = filteredStocks.slice(startIndex, startIndex + itemsPerPage);
  
  // Format price value to 2 decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  // Generate pagination UI
  const renderPagination = () => {
    // Don't show pagination if there's only one page
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if end page is at max
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {pages}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  // Load data on mount and when dependencies change
  useEffect(() => {
    generateStocksData();
  }, []);
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle>Top 250 Traded Stocks via AI</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              A curated list of the most popular, highly liquid stocks in the market
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
              AI Curated
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={generateStocksData}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by symbol or company name..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">
                  <button 
                    className="flex items-center space-x-1 hover:text-foreground focus:outline-none"
                    onClick={() => handleSort("symbol")}
                  >
                    <span>Symbol</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Name</TableHead>
                <TableHead className="text-right">
                  <button 
                    className="flex items-center space-x-1 ml-auto hover:text-foreground focus:outline-none"
                    onClick={() => handleSort("price")}
                  >
                    <span>Price</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button 
                    className="flex items-center space-x-1 ml-auto hover:text-foreground focus:outline-none"
                    onClick={() => handleSort("changePercent")}
                  >
                    <span>% Change</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto w-16"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto w-16"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : visibleStocks.length > 0 ? (
                visibleStocks.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell className="hidden md:table-cell">{stock.name}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${formatPrice(stock.price)}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      stock.changePercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      <div className="flex items-center justify-end gap-1">
                        {stock.changePercent >= 0 ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No stocks found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {renderPagination()}
        
        <div className="text-xs text-muted-foreground mt-3">
          Showing {visibleStocks.length} of {filteredStocks.length} stocks
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularStocksTable;
