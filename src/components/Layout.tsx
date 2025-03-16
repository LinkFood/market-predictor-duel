
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "./ui/sidebar-provider";

const Layout: React.FC = () => {
  const { open } = useSidebar();
  
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar />
      <div className={`flex flex-col flex-1 transition-all duration-200 ${open ? 'md:ml-64' : ''}`}>
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
