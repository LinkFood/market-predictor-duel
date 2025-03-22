
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[hsl(var(--background))] p-4"
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-md">Search Markets</h3>
          <button 
            onClick={onClose}
            className="btn-icon btn-ghost"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Search stocks, markets, or predictions..."
            className="w-full py-3 pl-10 pr-4 bg-[hsl(var(--surface-1))] border border-white/10 rounded-[var(--radius-md)] text-[hsl(var(--foreground))]"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="overline text-[hsl(var(--muted-foreground))]">Recent Searches</h4>
          <div className="glass-card-subtle p-3">
            <p className="body-md">No recent searches</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchOverlay;
