
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { useToast } from "@/hooks/use-toast";

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [devLoginLoading, setDevLoginLoading] = useState(false);
  
  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/app';

  const handleDevLogin = async () => {
    setDevLoginLoading(true);
    try {
      // Use the dev mode auto sign-in functionality
      console.log("🧪 Using development login");
      await signIn("dev@example.com", "password");
      
      toast({
        title: "Development Login",
        description: "Successfully logged in with development account",
      });
      
      // Navigate to the intended page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Dev login error:", error);
      toast({
        title: "Development Login Error",
        description: "Something went wrong with dev login",
        variant: "destructive"
      });
    } finally {
      setDevLoginLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <LoginForm 
        onDevLogin={handleDevLogin} 
        devLoginLoading={devLoginLoading} 
      />
    </AuthCard>
  );
};

export default Login;
