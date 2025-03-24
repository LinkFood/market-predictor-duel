
import React from "react";

interface LayoutContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`container max-w-7xl px-4 py-8 mx-auto sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};
