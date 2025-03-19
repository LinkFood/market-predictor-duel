
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-indigo max-w-none">
        <p className="text-lg text-gray-700 mb-4">
          Welcome to StockDuel. By using our service, you agree to these terms.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Account Registration</h2>
        <p>
          When you create an account with us, you must provide accurate and complete information.
          You are responsible for the security of your account and password.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Usage Rules</h2>
        <p>
          StockDuel is intended for educational and entertainment purposes only. The predictions
          and analysis provided should not be considered financial advice. Users should consult
          with qualified financial professionals before making investment decisions.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. Content Ownership</h2>
        <p>
          All content provided on StockDuel, including but not limited to text, graphics, logos,
          and software, is the property of StockDuel or its content suppliers and is protected by
          copyright laws.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. Limitation of Liability</h2>
        <p>
          StockDuel is not responsible for any financial losses incurred as a result of using
          our service. We provide market data and predictions for informational purposes only.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will provide notice of
          significant changes by updating the date at the top of this page.
        </p>
      </div>
      
      <div className="mt-12 text-center">
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link to="/register">Return to Registration</Link>
        </Button>
      </div>
    </div>
  );
};

export default Terms;
