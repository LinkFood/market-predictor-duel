
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import MakePrediction from "./pages/MakePrediction";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PredictionDetail from "./pages/PredictionDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { AuthProvider } from "./lib/auth-context";
import { MarketDataProvider } from "./lib/market/MarketDataProvider";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <MarketDataProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </MarketDataProvider>
    </AuthProvider>
  );
}

export default App;
