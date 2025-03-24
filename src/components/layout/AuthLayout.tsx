
import React from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AuthLayout: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Authentication - StockDuel</title>
      </Helmet>
      <main className="min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
