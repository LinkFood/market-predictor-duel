
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isValidLink, setIsValidLink] = useState<boolean>(true);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    // Check if this is a valid password reset flow
    const checkResetSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          setIsValidLink(false);
          setError('Invalid or expired password reset link. Please request a new one.');
        }
      } catch (err) {
        console.error("Error checking reset session:", err);
        setIsValidLink(false);
        setError('An error occurred while validating your reset link.');
      }
    };
    
    checkResetSession();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!isValidLink) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: authError } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (authError) {
        console.error("Password update error:", authError);
        setError(authError.message);
        return;
      }
      
      setSuccess(true);
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in with your new password.",
      });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error("Unexpected error during password reset:", err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard
        title="Password Reset Successful"
        description="Your password has been reset successfully"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-lg font-medium mb-4">Your password has been updated</p>
          <p className="text-gray-500 mb-6">You will be redirected to the login page in a few seconds.</p>
          <Button 
            onClick={() => navigate('/login')} 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Login
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set New Password"
      description="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!isValidLink ? (
          <div className="text-center">
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Reset Link
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
                disabled={!isValidLink || isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
                disabled={!isValidLink || isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              type="submit"
              disabled={!isValidLink || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                  Updating Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </>
        )}
        
        <div className="text-center text-sm">
          <Link to="/login" className="text-indigo-600 hover:underline flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default ResetPassword;
