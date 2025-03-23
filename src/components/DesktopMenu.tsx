
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", path: "/app" },
  { label: "Brackets", path: "/app/brackets" },
  { label: "Make Prediction", path: "/app/predict" },
  { label: "My Predictions", path: "/app/predictions/history" },
  { label: "Leaderboard", path: "/app/leaderboard" },
];

const DesktopMenu: React.FC = () => {
  return (
    <nav className="hidden md:flex space-x-1">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/app"}
          className={({ isActive }) => cn(
            "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
            isActive
              ? "bg-secondary text-primary"
              : "text-foreground hover:bg-secondary/60"
          )}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopMenu;
