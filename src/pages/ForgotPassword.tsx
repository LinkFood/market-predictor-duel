
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/lib/auth-service";
import AuthCard from "@/components/auth/AuthCard";
import { useToast } from "@/hooks/use-toast";

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      const { success, error } = await resetPassword(data.email);
      
      if (!success) {
        setError(error || 'Failed to send password reset email');
        return;
      }
      
      setSuccess(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we'll send you a password reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              We've sent you an email with a link to reset your password.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            disabled={success}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="flex flex-col space-y-4">
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700" 
            type="submit"
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
          
          <div className="text-center text-sm">
            <Link to="/login" className="text-indigo-600 hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </form>
    </AuthCard>
  );
};

export default ForgotPassword;
