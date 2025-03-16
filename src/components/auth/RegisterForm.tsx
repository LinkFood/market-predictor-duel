
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Validation schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onDevLogin: () => void;
  devLoginLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onDevLogin,
  devLoginLoading
}) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Debug info
      console.log("Attempting signup with:", data.email);
      
      // Register with supabase
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        console.error("Signup error:", error);
        setError(error.message || 'Failed to create account');
        return;
      }
      
      // On success show message
      const successMessage = 'Registration successful! Please check your email to confirm your account.';
      setSuccess(successMessage);
      toast({
        title: "Account created",
        description: successMessage,
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            placeholder="StockPredictorPro" 
            {...register('username')}
            className={errors.username ? 'border-red-500' : ''}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            {...register('terms')}
            className={errors.terms ? 'border-red-500' : ''}
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-tight">
            I agree to the{" "}
            <Link to="/terms" className="text-indigo-600 hover:underline">
              terms of service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-indigo-600 hover:underline">
              privacy policy
            </Link>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms.message}</p>
        )}
      </div>
      
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
        
        <Button 
          type="button"
          variant="outline" 
          className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-center"
          onClick={onDevLogin}
          disabled={devLoginLoading}
        >
          <span className="mr-2">🧪</span>
          {devLoginLoading ? 'Logging in...' : 'Development Login (Skip Auth)'}
        </Button>
        
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
