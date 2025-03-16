
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Challenge the AI?</h2>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          Join thousands of users testing their market prediction skills against our advanced AI models.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/register")}
            className="bg-white text-indigo-700 hover:bg-indigo-50"
          >
            Create Free Account
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/login")}
            className="border-indigo-200 text-white hover:bg-indigo-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
