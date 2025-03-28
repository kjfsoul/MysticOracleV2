import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart } from "lucide-react";

interface CompatibilityChartProps {
  sign1: string;
  sign2: string;
  content: string;
  onNewComparison?: () => void;
}

export default function CompatibilityChart({
  sign1,
  sign2,
  content,
  onNewComparison
}: CompatibilityChartProps) {
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
  
  const getElementColor = (sign: string): string => {
    // This is simplified - would need a proper mapping in a real app
    switch (sign.toLowerCase()) {
      case "aries":
      case "leo":
      case "sagittarius":
        return "from-red-500/40 to-orange-500/40"; // Fire signs
      case "taurus":
      case "virgo":
      case "capricorn":
        return "from-green-500/40 to-emerald-500/40"; // Earth signs
      case "gemini":
      case "libra":
      case "aquarius":
        return "from-blue-500/40 to-indigo-500/40"; // Air signs
      case "cancer":
      case "scorpio":
      case "pisces":
        return "from-cyan-500/40 to-blue-500/40"; // Water signs
      default:
        return "from-gray-500/40 to-slate-500/40";
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in-50 duration-500">
      <Card className="bg-dark/40 backdrop-blur-md border border-light/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-dark/40 via-transparent to-dark/40 z-0"></div>
        
        {/* Compatibility Header */}
        <div className="relative z-10 py-8 px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 mb-8">
            {/* First Sign */}
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getElementColor(sign1)} flex items-center justify-center mb-3 mx-auto`}>
                <span className="text-5xl text-light">{getSignIcon(sign1)}</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-light">
                {sign1.charAt(0).toUpperCase() + sign1.slice(1)}
              </h3>
            </div>
            
            {/* Connecting Hearts */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                <Heart className="h-6 w-6 text-accent" />
              </div>
            </div>
            
            {/* Second Sign */}
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getElementColor(sign2)} flex items-center justify-center mb-3 mx-auto`}>
                <span className="text-5xl text-light">{getSignIcon(sign2)}</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-light">
                {sign2.charAt(0).toUpperCase() + sign2.slice(1)}
              </h3>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-accent mb-3">
              Cosmic Compatibility
            </h2>
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Sparkles key={i} className="h-5 w-5 text-accent/70" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Compatibility Content */}
        <CardContent className="pt-0 pb-8 px-6 md:px-8 relative z-10">
          <div className="prose prose-invert max-w-none text-light/90 mb-8">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          {/* Action Buttons */}
          {onNewComparison && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-full text-accent hover:bg-accent/30"
                onClick={onNewComparison}
              >
                <span>Try Another Comparison</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}