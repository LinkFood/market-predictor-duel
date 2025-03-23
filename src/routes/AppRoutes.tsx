
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

// Import pages
import Dashboard from '@/pages/Dashboard';
import Markets from '@/pages/Markets';
import MakePrediction from '@/pages/MakePrediction';
import PredictionDetail from '@/pages/PredictionDetail';
import PredictionsHistory from '@/pages/PredictionsHistory';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import Brackets from '@/pages/Brackets';
import CreateBracket from '@/pages/CreateBracket';
import BracketDetail from '@/pages/BracketDetail';
import NotFound from '@/pages/NotFound';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Protected route component
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected app routes */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="markets" element={<Markets />} />
        <Route path="predict" element={<MakePrediction />} />
        <Route path="predictions/:id" element={<PredictionDetail />} />
        <Route path="predictions/history" element={<PredictionsHistory />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="brackets" element={<Brackets />} />
        <Route path="brackets/create" element={<CreateBracket />} />
        <Route path="brackets/:id" element={<BracketDetail />} />
      </Route>

      {/* Redirect root to app */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

      {/* 404 for everything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
