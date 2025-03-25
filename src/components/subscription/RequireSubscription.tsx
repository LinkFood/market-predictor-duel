
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/lib/subscription/subscription-context";
import { PlanFeatures } from "@/lib/subscription/plan-features";

interface RequireSubscriptionProps {
  feature?: string;
  redirectTo?: string;
  children?: React.ReactNode;
}

const RequireSubscription: React.FC<RequireSubscriptionProps> = ({
  feature = "premium",
  redirectTo = "/app/settings/billing",
  children
}) => {
  const { hasAccess, isLoading } = useSubscription();
  const location = useLocation();
  
  // If loading subscription data, show nothing
  if (isLoading) {
    return null;
  }
  
  // Check if user has access to the feature
  // We need to cast the feature string to any to avoid TypeScript errors
  if (!hasAccess(feature as any)) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location, requiredFeature: feature }}
        replace
      />
    );
  }
  
  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default RequireSubscription;
