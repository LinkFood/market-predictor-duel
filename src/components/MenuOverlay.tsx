
import React from "react";
import { Home, TrendingUp, LineChart, Trophy, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="fixed top-0 right-0 bottom-0 w-[70%] max-w-xs bg-[hsl(var(--surface-1))] border-l border-white/5 p-5"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="title-md">Menu</h3>
          <button 
            onClick={onClose}
            className="btn-icon btn-ghost"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation("/app")}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname === "/app" ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <Home className={`h-5 w-5 mr-3 ${location.pathname === "/app" ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Home</span>
          </button>
          
          <button
            onClick={() => handleNavigation("/app/predict")}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/predict") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <TrendingUp className={`h-5 w-5 mr-3 ${location.pathname.includes("/predict") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Predict</span>
          </button>
          
          <button
            onClick={() => handleNavigation("/app/predictions/history")}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/predictions/history") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <LineChart className={`h-5 w-5 mr-3 ${location.pathname.includes("/predictions/history") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">History</span>
          </button>
          
          <button
            onClick={() => handleNavigation("/app/leaderboard")}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/leaderboard") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <Trophy className={`h-5 w-5 mr-3 ${location.pathname.includes("/leaderboard") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Leaderboard</span>
          </button>
          
          <button
            onClick={() => handleNavigation("/app/profile")}
            className={`w-full flex items-center py-3 px-1 border-b border-white/5 touch-opacity ${location.pathname.includes("/profile") ? "text-[hsl(var(--primary))]" : ""}`}
          >
            <User className={`h-5 w-5 mr-3 ${location.pathname.includes("/profile") ? "text-[hsl(var(--primary))]" : ""}`} />
            <span className="body-md">Profile</span>
          </button>
          
          <div className="pt-4">
            <button className="btn-secondary btn-md w-full">
              Settings
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenuOverlay;
