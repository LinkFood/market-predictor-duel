
import React from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const MarketingLayout: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>StockDuel - Human vs AI Market Prediction Game</title>
      </Helmet>
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default MarketingLayout;
