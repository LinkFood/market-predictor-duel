
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeframeSelectorProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ timeframe, setTimeframe }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Prediction timeframe</label>
      <Select value={timeframe} onValueChange={setTimeframe}>
        <SelectTrigger>
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1d">1 Day</SelectItem>
          <SelectItem value="1w">1 Week</SelectItem>
          <SelectItem value="2w">2 Weeks</SelectItem>
          <SelectItem value="1m">1 Month</SelectItem>
          <SelectItem value="3m">3 Months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeframeSelector;
