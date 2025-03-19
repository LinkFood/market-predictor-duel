
import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormRegister, Controller, Control, FieldErrors } from "react-hook-form";
import { RegisterFormData } from "./register-validation";

interface RegisterFormFieldsProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  control: Control<RegisterFormData>;
}

const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({ 
  register, 
  errors, 
  control 
}) => {
  return (
    <>
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
        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <Checkbox 
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
              className={errors.terms ? 'border-red-500' : ''}
            />
          )}
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
    </>
  );
};

export default RegisterFormFields;
