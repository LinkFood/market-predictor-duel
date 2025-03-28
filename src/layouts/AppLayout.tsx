
import React from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AppLayout: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>StockDuel - Dashboard</title>
        <meta name="theme-color" content="#111827" />
      </Helmet>
      <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
