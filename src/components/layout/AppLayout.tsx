
import React from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AppLayout: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>StockDuel - Dashboard</title>
      </Helmet>
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
