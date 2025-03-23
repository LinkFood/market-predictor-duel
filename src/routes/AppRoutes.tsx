
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

// Layouts
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Pages
import HomePage from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Brackets from "@/pages/Brackets";
import BracketDetail from "@/pages/BracketDetail";
import CreateBracket from "@/pages/CreateBracket";
import PredictionHistory from "@/pages/PredictionHistory";
import Account from "@/pages/Account";
import NotFound from "@/pages/NotFound";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import AuthCallback from "@/components/auth/AuthCallback";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={
          user ? <Navigate to="/app" replace /> : <Login />
        } />
        <Route path="register" element={
          user ? <Navigate to="/app" replace /> : <Register />
        } />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="auth/callback" element={<AuthCallback />} />
      </Route>
      
      {/* Protected App Routes */}
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="brackets" element={<Brackets />} />
        <Route path="brackets/:id" element={<BracketDetail />} />
        <Route path="brackets/create" element={<CreateBracket />} />
        <Route path="predictions" element={<PredictionHistory />} />
        <Route path="account" element={<Account />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
