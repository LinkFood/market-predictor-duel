
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MarketOverviewSection from "@/components/landing/MarketOverviewSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/lib/auth-context";

const Index: React.FC = () => {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated and on the landing page, redirect to dashboard
  useEffect(() => {
    if (user && isInitialized) {
      navigate("/dashboard");
    }
  }, [user, isInitialized, navigate]);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <MarketOverviewSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
