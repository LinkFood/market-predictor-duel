
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  title, 
  description, 
  children, 
  footer 
}) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="mx-auto flex items-center gap-2 text-indigo-600">
            <TrendingUp className="h-6 w-6" />
            <span className="font-bold text-xl">StockDuel</span>
          </div>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {children}
        </CardContent>
        
        {footer && <CardFooter className="flex flex-col">{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default AuthCard;
