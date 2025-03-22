
import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface FormContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, description, children, footer }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col space-y-2">
        {footer}
      </CardFooter>
    </Card>
  );
};

export default FormContainer;
