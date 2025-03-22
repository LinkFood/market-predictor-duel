
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-indigo max-w-none">
        <p className="text-lg text-gray-700 mb-4">
          This Privacy Policy describes how StockDuel collects, uses, and shares your personal information.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when you create an account,
          such as your name, email address, and password. We also collect information about your
          usage of our service, including your predictions, performance, and interaction with our platform.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services,
          to communicate with you, and to personalize your experience. We may also use your
          information to develop new products and services.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
        <p>
          We do not share your personal information with third parties except as described in this
          privacy policy. We may share your information with service providers who perform services on our behalf,
          such as hosting, analytics, and customer service.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
        <p>
          We take reasonable measures to help protect your personal information from loss, theft,
          misuse, and unauthorized access, disclosure, alteration, and destruction.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Choices</h2>
        <p>
          You can access, update, or delete your account information at any time through your account settings.
          You can also contact us directly to request access to, correction of, or deletion of your personal information.
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

export default Privacy;
