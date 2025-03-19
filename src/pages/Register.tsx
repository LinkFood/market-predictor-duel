
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import { useToast } from "@/hooks/use-toast";

const Register: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [devLoginLoading, setDevLoginLoading] = useState(false);
  
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
      
      // Navigate to the app dashboard
      navigate('/dashboard');
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
      title="Create an account"
      description="Enter your information to get started with StockDuel"
    >
      <RegisterForm 
        onDevLogin={handleDevLogin}
        devLoginLoading={devLoginLoading}
      />
    </AuthCard>
  );
};

export default Register;
