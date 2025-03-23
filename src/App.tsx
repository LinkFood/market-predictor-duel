import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { extendedTheme } from "@/lib/chakra-theme";
import { AuthProvider } from "@/lib/auth-context";
import { SubscriptionProvider } from "@/lib/subscription/subscription-context";
import { MarketDataProvider } from "@/lib/market/MarketDataProvider";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Predictions from "@/pages/Predictions";
import PredictionDetail from "@/pages/PredictionDetail";
import CreatePrediction from "@/pages/CreatePrediction";
import Markets from "@/pages/Markets";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import ApiSettings from "@/pages/ApiSettings";
import AccountSettings from "@/pages/AccountSettings";
import NotificationSettings from "@/pages/NotificationSettings";
import PrivacySettings from "@/pages/PrivacySettings";
import BillingSettings from "@/pages/BillingSettings";
import CreateBracket from "@/pages/CreateBracket";
import BracketDetail from "@/pages/BracketDetail";
import Brackets from "@/pages/Brackets";
import NotFound from "@/pages/NotFound";
import TestApiIntegration from "@/pages/TestApiIntegration";

// Layout components
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import MarketingLayout from "@/components/layout/MarketingLayout";

// Auth components
import RequireAuth from "@/components/auth/RequireAuth";
import RequireSubscription from "@/components/subscription/RequireSubscription";

function App() {
  return (
    <ChakraProvider theme={extendedTheme}>
      <BrowserRouter>
        <ThemeProvider>
          <Toaster />
          <Routes>
            {/* Marketing routes */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* App routes - require authentication */}
            <Route element={
              <AuthProvider>
                <SubscriptionProvider>
                  <MarketDataProvider>
                    <RequireAuth>
                      <AppLayout />
                    </RequireAuth>
                  </MarketDataProvider>
                </SubscriptionProvider>
              </AuthProvider>
            }>
              <Route path="/app/dashboard" element={<Dashboard />} />
              <Route path="/app/predictions" element={<Predictions />} />
              <Route path="/app/predictions/:id" element={<PredictionDetail />} />
              <Route path="/app/predictions/create" element={<CreatePrediction />} />
              <Route path="/app/markets" element={<Markets />} />
              <Route path="/app/leaderboard" element={<Leaderboard />} />
              <Route path="/app/profile" element={<Profile />} />
              <Route path="/app/settings" element={<Settings />} />
              <Route path="/app/settings/api" element={<ApiSettings />} />
              <Route path="/app/settings/account" element={<AccountSettings />} />
              <Route path="/app/settings/notifications" element={<NotificationSettings />} />
              <Route path="/app/settings/privacy" element={<PrivacySettings />} />
              <Route path="/app/settings/billing" element={<BillingSettings />} />
              
              {/* Bracket routes */}
              <Route path="/app/brackets" element={<Brackets />} />
              <Route path="/app/brackets/create" element={<CreateBracket />} />
              <Route path="/app/brackets/:id" element={<BracketDetail />} />
              
              {/* Premium routes */}
              <Route element={<RequireSubscription feature="apiAccess" />}>
                <Route path="/app/api-test" element={<TestApiIntegration />} />
              </Route>
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
