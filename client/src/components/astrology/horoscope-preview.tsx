import React, { useState, useEffect } from "react";
import { zodiacSigns } from "@/data/zodiac-data";
import { Clock, Stars } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ZodiacSignSelector from "./zodiac-sign-selector";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface HoroscopePreviewProps {
  sign?: string;
  showSignSelector?: boolean;
}

interface HoroscopePreviewResponse {
  sign: string;
  date: string;
  content: string;
  message: string;
}

export function HoroscopePreview({ sign, showSignSelector = true }: HoroscopePreviewProps) {
  const [selectedSign, setSelectedSign] = useState<string>(sign?.toLowerCase() || "aries");
  const [activeTab, setActiveTab] = useState<string>("sign");
  const [birthdate, setBirthdate] = useState<string>("");

  // Fetch horoscope preview data for the selected sign
  const { data: horoscope, isLoading, error, refetch } = useQuery<HoroscopePreviewResponse>({
    queryKey: ["horoscope-preview", selectedSign],
    queryFn: async () => {
      try {
        return await apiRequest(`/api/horoscopes/preview/${selectedSign}`);
      } catch (error) {
        if (error instanceof Error && error.message.includes("401")) {
          // Handle 401 Unauthorized error gracefully
          return { sign: "", date: "", content: "Please log in to view your horoscope.", message: "" };
        }
        throw error;
      }
    },
    enabled: !!selectedSign,
  });

  const handleSignChange = (sign: string) => {
    setSelectedSign(sign.toLowerCase());
  };

  const handleBirthdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (birthdate) {
      // Calculate zodiac sign from birthdate
      const date = new Date(birthdate);
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const day = date.getDate();

      // Simple zodiac sign determination logic
      let calculatedSign = "";
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) calculatedSign = "aries";
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) calculatedSign = "taurus";
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) calculatedSign = "gemini";
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) calculatedSign = "cancer";
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) calculatedSign = "leo";
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) calculatedSign = "virgo";
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) calculatedSign = "libra";
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) calculatedSign = "scorpio";
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) calculatedSign = "sagittarius";
      else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) calculatedSign = "capricorn";
      else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) calculatedSign = "aquarius";
      else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) calculatedSign = "pisces";

      setSelectedSign(calculatedSign);
    }
  };

  const getSignInfo = (sign: string) => {
    return zodiacSigns.find((s) => s.sign.toLowerCase() === sign) || zodiacSigns[0];
  };

  const getElementColorClass = (element: string) => {
    switch (element) {
      case "fire":
        return "text-amber-500";
      case "earth":
        return "text-emerald-500";
      case "air":
        return "text-sky-500";
      case "water":
        return "text-indigo-500";
      default:
        return "text-accent";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 bg-primary/20 rounded w-40 mb-4"></div>
          <div className="h-4 bg-primary/20 rounded w-52 mb-2"></div>
          <div className="h-4 bg-primary/20 rounded w-full mb-2"></div>
          <div className="h-4 bg-primary/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6 text-center">
        <h3 className="text-xl font-medium text-light mb-3">Unable to fetch horoscope: {error.message}</h3>
        <p className="text-light/70 mb-4">Please try again later.</p>
        <Button variant="outline" onClick={() => refetch()} className="border-accent/50 text-accent hover:bg-accent/20">
          Try Again
        </Button>
      </div>
    );
  }

  if (!horoscope) {
    return <div>No horoscope data</div>; // Handle case where horoscope is null
  }

  const signInfo = getSignInfo(selectedSign);
  const elementColorClass = getElementColorClass(signInfo.element);

  return (
    <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2 text-xl font-medium text-accent">
          <Stars className="h-5 w-5" />
          Daily Horoscope Preview
        </h3>
        <div className="flex items-center text-light/60 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          {horoscope.date}
        </div>
      </div>

      {showSignSelector && (
        <div className="mb-5">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-dark/60">
              <TabsTrigger value="sign">Select Your Sign</TabsTrigger>
              <TabsTrigger value="birthdate">Enter Birthdate</TabsTrigger>
            </TabsList>
            <TabsContent value="sign" className="mt-4">
              <ZodiacSignSelector onSelectSign={handleSignChange} selectedSign={selectedSign} />
            </TabsContent>
            <TabsContent value="birthdate" className="mt-4">
              <form onSubmit={handleBirthdateSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-light/80 mb-1">
                    Your Birthdate
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="w-full p-2 rounded bg-dark border border-light/20 text-light/90 focus:border-accent"
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                  Find My Sign
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h4 className={`text-lg font-medium capitalize ${elementColorClass}`}>
            {selectedSign}
          </h4>
          <span className="text-light/60 text-sm">
            ({signInfo.dates} • {signInfo.element.charAt(0).toUpperCase() + signInfo.element.slice(1)})
          </span>
        </div>

        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} key={selectedSign}>
          <p className="text-light/80 mb-4">{horoscope.content}</p>

          <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 mb-4">
            <p className="text-light/90 text-sm">{horoscope.message}</p>
          </div>
        </motion.div>

        <div className="flex space-x-4">
          <Link to="/auth">
            <Button className="bg-accent hover:bg-accent/80 text-dark">Sign Up</Button>
          </Link>
          <Link to="/astrology">
            <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/20">
              Full Horoscope
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}