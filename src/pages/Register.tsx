
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

const Register: React.FC = () => {
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
