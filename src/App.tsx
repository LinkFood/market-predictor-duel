
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';
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
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* App Routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="api-settings" element={<ApiSettings />} />
              <Route path="make-prediction" element={<MakePrediction />} />
              <Route path="prediction/:id" element={<PredictionDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="brackets" element={<Brackets />} />
              <Route path="brackets/:id" element={<BracketDetail />} />
              <Route path="create-bracket" element={<CreateBracket />} />
              <Route path="account" element={<Account />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="markets" element={<Markets />} />
              <Route path="history" element={<PredictionsHistory />} />
            </Route>
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </AppErrorBoundary>
  );
};

export default App;
