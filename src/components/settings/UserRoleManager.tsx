
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, UserPlus } from "lucide-react";

interface UserRoleManagerProps {
  adminEmail: string;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ adminEmail }) => {
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [operationResult, setOperationResult] = useState<null | "success" | "error">(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const { toast } = useToast();

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
      const { data, error } = await supabase.functions.invoke("assign-admin-role", {
        body: { userId, adminEmail }
      });

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
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Manage User Roles</CardTitle>
          <CardDescription>
            Assign the admin role to users by their user ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {isLoading ? "Assigning..." : "Assign Admin Role"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleManager;
