
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  href, 
  className = "" 
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`px-2 py-1 h-auto rounded-full ${className}`}
      asChild
    >
      <Link to={href}>
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </Link>
    </Button>
  );
};
