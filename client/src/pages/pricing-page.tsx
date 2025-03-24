import { useState } from "react";
import { useAuth } from "@/hooks/use-auth-fixed";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { PageHeader } from "../components/ui/page-header"; // Corrected import path
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    id: "price_basic",
    name: "Basic",
    price: 4.99,
    features: [
      "Unlimited tarot readings",
      "Basic AI interpretations",
      "Daily horoscopes",
      "Birth chart basics",
    ],
  },
  {
    id: "price_pro",
    name: "Pro",
    price: 9.99,
    features: [
      "Everything in Basic",
      "Advanced AI tarot insights",
      "Premium daily horoscopes",
      "Full birth chart analysis",
      "Compatibility readings",
      "Personalized lunar event notifications",
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(planId);
    try {
      const data = await apiRequest("/api/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ planId })
      });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Subscription error",
        description: "There was a problem processing your subscription request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <PageHeader
        title="Subscription Plans"
        subtitle="Choose the perfect plan for your mystical journey"
      />

      <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <Card key={plan.id} className="border border-gold/30 flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <Badge className="bg-gold text-background">${plan.price}/month</Badge>
              </div>
              <CardDescription>
                Unlock your mystical potential
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-gold mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gold hover:bg-gold/80 text-background"
                onClick={() => handleSubscribe(plan.id)}
                disabled={!!isLoading}
              >
                {isLoading === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}