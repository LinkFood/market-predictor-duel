
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MarketOverviewSection from "@/components/landing/MarketOverviewSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <MarketOverviewSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      
      {user && (
        <div className="fixed bottom-8 right-8 z-50">
          <Link
            to="/app"
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
