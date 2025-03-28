
import { 
  Home,
  TrendingUp, 
  BarChart3, 
  Trophy, 
  User,
  GitFork,
  Settings
} from "lucide-react";
import { NavItem } from "./MobileSidebarMenu";

// Navigation sections and items
export interface NavSection {
  section: string;
  items: NavItem[];
}

export const navigationItems: NavSection[] = [
  {
    section: "Core",
    items: [
      {
        name: "Dashboard",
        path: "/app",
        icon: Home,
        exact: true
      },
      {
        name: "Make Prediction",
        path: "/app/predict",
        icon: TrendingUp
      },
      {
        name: "Markets",
        path: "/app/markets",
        icon: BarChart3
      }
    ]
  },
  {
    section: "Tournaments",
    items: [
      {
        name: "Brackets",
        path: "/app/brackets",
        icon: GitFork
      },
      {
        name: "Leaderboard",
        path: "/app/leaderboard",
        icon: Trophy
      }
    ]
  },
  {
    section: "Your Account",
    items: [
      {
        name: "Profile",
        path: "/app/profile",
        icon: User
      },
      {
        name: "Settings",
        path: "/app/settings",
        icon: Settings
      }
    ]
  }
];

// Bottom navigation items (simplified for mobile)
export const mobileNavItems: NavItem[] = [
  {
    name: "Home",
    path: "/app",
    icon: Home,
    exact: true
  },
  {
    name: "Predict",
    path: "/app/predict",
    icon: TrendingUp
  },
  {
    name: "Brackets",
    path: "/app/brackets",
    icon: GitFork
  },
  {
    name: "Markets",
    path: "/app/markets",
    icon: BarChart3
  },
  {
    name: "Profile",
    path: "/app/profile",
    icon: User
  }
];
