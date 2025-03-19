
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface MarketTabContentProps {
  title: string;
  children?: React.ReactNode;
  variants: any;
}

const MarketTabContent: React.FC<MarketTabContentProps> = ({ title, children, variants }) => {
  return (
    <motion.div variants={variants}>
      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children || <p>{title} market data coming soon...</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketTabContent;
