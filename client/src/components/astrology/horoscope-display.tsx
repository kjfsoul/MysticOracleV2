import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import React from "react";

export interface HoroscopeDisplayProps {
  sign: string;
  content?: string;
  premiumContent?: string;
  date?: string;
  isPremiumUser?: boolean;
  onSubscribe?: () => void;
  onBack?: () => void;
}

const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({
  sign,
  content,
  premiumContent,
  date,
  isPremiumUser = false,
  onSubscribe,
  onBack,
}) => {
  // Default content if none provided
  const defaultContent =
    "The cosmic energies are aligning to bring you clarity and purpose today. Pay attention to subtle signs and trust your intuition as you navigate through challenges. Your ruling planet is providing extra support in matters of personal growth.";

  // Get the zodiac sign emoji
  const getSignEmoji = (sign: string) => {
    const emojis: { [key: string]: string } = {
      aries: "♈",
      taurus: "♉",
      gemini: "♊",
      cancer: "♋",
      leo: "♌",
      virgo: "♍",
      libra: "♎",
      scorpio: "♏",
      sagittarius: "♐",
      capricorn: "♑",
      aquarius: "♒",
      pisces: "♓",
    };
    return emojis[sign.toLowerCase()] || "✨";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-primary-10 border-gold/30 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getSignEmoji(sign)}</span>
              <div>
                <CardTitle className="text-2xl md:text-3xl text-gold gold-sparkle">
                  {sign.charAt(0).toUpperCase() + sign.slice(1)} Horoscope
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-gold/70" />
                  <span>{date || new Date().toLocaleDateString()}</span>
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/20 text-gold border-gold/50"
            >
              Daily
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-light/90 leading-relaxed">
              {content || defaultContent}
            </p>
          </div>

          {premiumContent && !isPremiumUser && (
            <div className="mt-6 bg-primary/30 border border-gold/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <h3 className="font-medium text-gold">
                  Premium Insights Available
                </h3>
              </div>
              <p className="text-light/70 text-sm mb-3">
                Unlock detailed planetary influences, love forecasts, and career
                guidance with a premium subscription.
              </p>
              {onSubscribe && (
                <Button
                  onClick={onSubscribe}
                  size="sm"
                  className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          )}

          {premiumContent && isPremiumUser && (
            <div className="mt-6 bg-primary/30 border border-gold/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <h3 className="font-medium text-gold">Premium Insights</h3>
              </div>
              <p className="text-light/90 leading-relaxed">{premiumContent}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-6">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gold/50 text-gold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Choose Another Sign
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default HoroscopeDisplay;
