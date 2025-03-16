
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { 
  SidebarInset,
} from "@/components/ui/sidebar";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <SidebarInset className="flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6 pt-0">
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  );
};

export default Layout;
