
import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import PredictionCard from "./PredictionCard";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-indigo-700 hover:bg-indigo-800 mb-4 px-3 py-1">
                <Zap className="mr-1 h-3.5 w-3.5" />
                <span>Now in Public Beta</span>
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Challenge AI in Stock Market Predictions
              </h1>
              <p className="text-xl mt-6 text-indigo-100 max-w-lg">
                Test your market intuition against advanced AI models. Make predictions, track performance, and climb the leaderboard.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
                className="bg-white text-indigo-700 hover:bg-indigo-50 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/login")}
                className="border-indigo-200 text-white hover:bg-indigo-700 text-lg"
              >
                Sign In
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 pt-4 text-indigo-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-indigo-600 flex items-center justify-center text-xs font-medium">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm">
                Join <span className="font-bold">2,500+</span> users already making predictions
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <PredictionCard />
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-500/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
