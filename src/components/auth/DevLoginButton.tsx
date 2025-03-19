
import React from "react";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";

interface DevLoginButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const DevLoginButton: React.FC<DevLoginButtonProps> = ({ onClick, isLoading }) => {
  // Always disable the button
  const disabled = true;
  
  return (
    <Button 
      type="button"
      variant="outline" 
      className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-center opacity-50"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      <Beaker className="mr-2 h-4 w-4" />
      {isLoading ? 'Logging in...' : 'Development Login (Disabled)'}
    </Button>
  );
};

export default DevLoginButton;
