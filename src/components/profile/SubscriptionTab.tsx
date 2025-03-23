
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight, CheckCircle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionTabProps {
  isLoading: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

interface UserSubscription {
  id: string;
  plan: string;
  status: string;
  started_at: string;
  expires_at: string | null;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ isLoading }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  
  // Fetch user's subscription
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching subscription:", error);
          return;
        }
        
        setActiveSubscription(data);
      } catch (error) {
        console.error("Unexpected error fetching subscription:", error);
      } finally {
        setLoadingSubscription(false);
      }
    };
    
    fetchSubscription();
  }, [user]);

  // Sample subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "Basic features for casual traders",
      price: "$0",
      features: [
        "3 AI duels per month",
        "Basic stock predictions",
        "Daily market updates"
      ],
      buttonText: "Current Plan",
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced features for serious traders",
      price: "$9.99/month",
      features: [
        "Unlimited AI duels",
        "Advanced prediction patterns",
        "Priority data updates",
        "Custom AI opponents"
      ],
      buttonText: "Upgrade",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Full suite for professional traders",
      price: "$49.99/month",
      features: [
        "Everything in Pro",
        "API access",
        "Team accounts",
        "Custom integrations",
        "Premium support"
      ],
      buttonText: "Contact Sales"
    }
  ];

  const handleSubscribe = (planId: string) => {
    // This would normally redirect to a payment page or subscription service
    toast({
      title: "Subscription Feature",
      description: `The ability to subscribe to the ${planId} plan will be implemented soon!`,
    });
  };

  // Check if user is on a specific plan
  const isCurrentPlan = (planId: string) => {
    if (!activeSubscription) return planId === "free";
    return activeSubscription.plan === planId;
  };

  if (isLoading || loadingSubscription) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Your Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>
      
      {activeSubscription && activeSubscription.plan !== "free" && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Details of your active subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{activeSubscription.plan.charAt(0).toUpperCase() + activeSubscription.plan.slice(1)} Plan</p>
                  <p className="text-sm text-muted-foreground">Started on {new Date(activeSubscription.started_at).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
              </div>
              
              {activeSubscription.expires_at && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Renews on {new Date(activeSubscription.expires_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Subscription
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative overflow-hidden ${plan.popular ? 'border-primary shadow-md' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-2xl font-bold">{plan.price}</span>
                {plan.id !== "free" && <span className="text-muted-foreground ml-1">/month</span>}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={isCurrentPlan(plan.id) ? "outline" : "default"}
                className="w-full"
                disabled={isCurrentPlan(plan.id)}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isCurrentPlan(plan.id) ? (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    {plan.buttonText}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Need help with your subscription?</h4>
        <p className="text-sm text-muted-foreground">
          Contact our support team at support@stockduel.com
        </p>
      </div>
    </div>
  );
};

export default SubscriptionTab;
