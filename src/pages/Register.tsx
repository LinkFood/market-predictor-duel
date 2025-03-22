
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import { isSupabaseConfigured, getSupabaseConfigError } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Register: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check Supabase configuration on load
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.error("Supabase configuration error:", getSupabaseConfigError());
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Supabase is not configured correctly. Please check the configuration.",
      });
    }
  }, [toast]);

  return (
    <AuthCard
      title="Create an account"
      description="Enter your information to get started with StockDuel"
    >
      <RegisterForm />
    </AuthCard>
  );
};

export default Register;
