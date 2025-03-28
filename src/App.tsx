
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { MarketDataProvider } from '@/lib/market/MarketDataProvider';
import './App.css';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ApiSettings from '@/pages/ApiSettings';
import Settings from '@/pages/Settings';
import MakePrediction from '@/pages/MakePrediction';
import PredictionDetail from '@/pages/PredictionDetail';
import Profile from '@/pages/Profile';
import Brackets from '@/pages/Brackets';
import BracketDetail from '@/pages/BracketDetail';
import CreateBracket from '@/pages/CreateBracket';
import Account from '@/pages/Account';
import Leaderboard from '@/pages/Leaderboard';
import Markets from '@/pages/Markets';
import PredictionsHistory from '@/pages/PredictionsHistory';

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <MarketDataProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                
                {/* App Routes - Protected by ProtectedRoute */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="account" element={<Account />} />
                  <Route path="api-settings" element={<ApiSettings />} />
                  <Route path="predict" element={<MakePrediction />} />
                  <Route path="prediction/:id" element={<PredictionDetail />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="brackets" element={<Brackets />} />
                  <Route path="brackets/:id" element={<BracketDetail />} />
                  <Route path="create-bracket" element={<CreateBracket />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="markets" element={<Markets />} />
                  <Route path="history" element={<PredictionsHistory />} />
                </Route>
                
                {/* Redirects */}
                <Route path="/dashboard" element={<Navigate to="/app" replace />} />
                <Route path="/app/make-prediction" element={<Navigate to="/app/predict" replace />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </MarketDataProvider>
        </AuthProvider>
      </HelmetProvider>
    </AppErrorBoundary>
  );
};

export default App;
