
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  success: string | null;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, success }) => {
  return (
    <div className="flex flex-col space-y-4 mt-6">
      <Button 
        className="w-full bg-indigo-600 hover:bg-indigo-700" 
        type="submit"
        disabled={isLoading || !!success}
      >
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SubmitButton;
