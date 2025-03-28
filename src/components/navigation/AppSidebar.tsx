
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigationItems, mobileNavItems } from "./navigationConfig";
import MobileSidebarMenu from "./MobileSidebarMenu";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import DesktopSidebar from "./DesktopSidebar";

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  collapsed = false, 
  onToggle 
}) => {
  const isMobile = useIsMobile();
  
  // Mobile bottom navigation
  if (isMobile) {
    return <MobileSidebarMenu items={mobileNavItems} />;
  }
  
  // Desktop sidebar
  return (
    <DesktopSidebar 
      collapsed={collapsed} 
      onToggle={onToggle || (() => {})}
      navigationItems={navigationItems}
    />
  );
};

// Mobile sidebar drawer component
export const MobileSidebar: React.FC = () => {
  return <MobileSidebarDrawer navigationItems={navigationItems} />;
};

export default AppSidebar;
