
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import MakePrediction from "@/pages/MakePrediction";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PredictionDetail from "@/pages/PredictionDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import { useAuth } from "@/lib/auth-context";
import LoadingScreen from "@/components/LoadingScreen";
import { SidebarProvider } from "@/components/ui/sidebar";

const AppRoutes = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen message="Initializing authentication..." />;
  }

  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="predict" element={<MakePrediction />} />
          <Route path="predictions/:id" element={<PredictionDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </SidebarProvider>
  );
};

export default AppRoutes;
