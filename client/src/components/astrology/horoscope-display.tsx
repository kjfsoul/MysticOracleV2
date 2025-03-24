import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Lock } from "lucide-react";

interface HoroscopeDisplayProps {
  sign: string;
  content: string;
  premiumContent?: string | null;
  date: string;
  isPremiumUser?: boolean;
  onSubscribe?: () => void;
}

export default function HoroscopeDisplay({
  sign,
  content,
  premiumContent,
  date,
  isPremiumUser = false,
  onSubscribe
}: HoroscopeDisplayProps) {
  const getSignIcon = (sign: string) => {
    // Simple switch to return the appropriate zodiac symbol
    switch (sign.toLowerCase()) {
      case "aries": return "♈";
      case "taurus": return "♉";
      case "gemini": return "♊";
      case "cancer": return "♋";
      case "leo": return "♌";
      case "virgo": return "♍";
      case "libra": return "♎";
      case "scorpio": return "♏";
      case "sagittarius": return "♐";
      case "capricorn": return "♑";
      case "aquarius": return "♒";
      case "pisces": return "♓";
      default: return "★";
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in-50 duration-500">
      <Card className="bg-dark/40 backdrop-blur-md border border-light/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl text-accent">{getSignIcon(sign)}</span>
            <CardTitle className="text-2xl md:text-3xl font-heading text-light">
              {sign.charAt(0).toUpperCase() + sign.slice(1)}
            </CardTitle>
          </div>
          <CardDescription className="text-light/70">
            Daily Horoscope for {date}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="prose prose-invert max-w-none">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-light/90">{paragraph}</p>
            ))}
          </div>
          
          {/* Premium Content Section */}
          {premiumContent && (
            <div className="mt-8 pt-6 border-t border-light/10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-heading text-lg text-accent flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Premium Cosmic Insights
                </h4>
                {!isPremiumUser && (
                  <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">Premium</span>
                )}
              </div>
              
              {isPremiumUser ? (
                <div className="prose prose-invert max-w-none">
                  {premiumContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-light/90">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="bg-dark/70 rounded-lg p-4 border border-light/5">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent/20 p-2 rounded-full">
                      <Lock className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h5 className="font-medium text-light mb-1">Unlock Premium Insights</h5>
                      <p className="text-light/60 text-sm mb-4">
                        Upgrade to premium for in-depth cosmic guidance, personalized predictions, and detailed celestial insights.
                      </p>
                      <Button 
                        onClick={onSubscribe}
                        className="bg-accent/20 border border-accent/50 rounded-lg text-accent hover:bg-accent/30"
                      >
                        Upgrade to Premium
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="relative z-10 border-t border-light/5 bg-dark/20 flex justify-between">
          <div className="text-sm text-light/60">
            Updated daily at midnight
          </div>
          <div className="text-sm text-accent">
            Mystic Arcana
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}