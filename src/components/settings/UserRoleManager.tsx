
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface UserRoleManagerProps {
  adminEmail: string;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ adminEmail }) => {
  const { user, refreshSession } = useAuth();
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [operationResult, setOperationResult] = useState<null | "success" | "error">(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const { toast } = useToast();

  // Ensure user ID is set when user is available
  useEffect(() => {
    if (user?.id) {
      console.log("Setting user ID from user object:", user.id);
      setUserId(user.id);
    } else {
      console.log("No user ID available in user object");
    }
  }, [user]);

  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const assignAdminRole = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!userId) {
      toast({
        title: "User ID Required",
        description: "Please enter a user ID.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Invoking assign-admin-role function with:", { userId, adminEmail });
      
      // Make sure we're passing the correct body format and using await properly
      const { data, error } = await supabase.functions.invoke("assign-admin-role", {
        body: { userId, adminEmail }
      });

      console.log("Function response:", data, error);

      if (error) {
        console.error("Error assigning admin role:", error);
        setOperationResult("error");
        setResultMessage(error.message || "Failed to assign admin role.");
        toast({
          title: "Error",
          description: error.message || "Failed to assign admin role.",
          variant: "destructive",
        });
      } else if (data && data.success) {
        setOperationResult("success");
        setResultMessage(data.message || "Admin role assigned successfully.");
        toast({
          title: "Success",
          description: data.message || "Admin role assigned successfully.",
          variant: "default",
        });
        
        // Refresh session to reflect new role
        await refreshSession();
      } else {
        setOperationResult("error");
        setResultMessage(data?.error || "Failed to assign admin role.");
        toast({
          title: "Error",
          description: data?.error || "Failed to assign admin role.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      setOperationResult("error");
      setResultMessage(error.message || "An unexpected error occurred.");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {operationResult === "success" && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{resultMessage}</AlertDescription>
        </Alert>
      )}
      
      {operationResult === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{resultMessage}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={assignAdminRole} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-id">User ID</Label>
          <Input
            id="user-id"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="Enter user ID to assign admin role"
            className="bg-white border-gray-300 hover:border-gray-400 focus:border-primary"
            aria-label="User ID"
          />
          <p className="text-sm text-gray-500">
            {userId ? "We've pre-filled your user ID. Click the button below to assign yourself admin privileges." : "Enter your user ID to assign admin privileges."}
          </p>
        </div>
        <Button
          type="submit"
          className="flex items-center gap-2 w-full md:w-auto bg-primary hover:bg-primary/90 text-white !cursor-pointer"
          disabled={isLoading || !userId}
        >
          <UserPlus className="h-4 w-4" />
          {isLoading ? "Assigning..." : "Assign Admin Role"}
        </Button>
      </form>
    </div>
  );
};

export default UserRoleManager;
