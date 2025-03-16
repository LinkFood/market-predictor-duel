
import React from "react";
import { TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <TrendingUp className="h-6 w-6 text-indigo-500 mr-2" />
            <span className="text-white font-bold text-xl">StockDuel</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <Separator className="bg-slate-800 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">© 2023 StockDuel. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
