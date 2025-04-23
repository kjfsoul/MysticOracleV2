import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { AstrologyChart } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import BirthChartDisplay from "../components/astrology/birth-chart-display";
import BirthChartForm from "../components/astrology/birth-chart-form";
import CompatibilityChart from "../components/astrology/compatibility-chart";
import HoroscopeDisplay from "../components/astrology/horoscope-display";
import ZodiacSignPicker from "../components/astrology/zodiac-sign-picker";
import MobileNavigation from "../components/layout/mobile-navigation";
import Navbar from "../components/layout/navbar";
import SubscriptionBanner from "../components/layout/subscription-banner";

// Import zodiac signs data from the server
// In a real app, this would be fetched from the API
const zodiacSigns = [
  { sign: "Aries", element: "Fire", dates: "March 21 - April 19" },
  { sign: "Taurus", element: "Earth", dates: "April 20 - May 20" },
  { sign: "Gemini", element: "Air", dates: "May 21 - June 20" },
  { sign: "Cancer", element: "Water", dates: "June 21 - July 22" },
  { sign: "Leo", element: "Fire", dates: "July 23 - August 22" },
  { sign: "Virgo", element: "Earth", dates: "August 23 - September 22" },
  { sign: "Libra", element: "Air", dates: "September 23 - October 22" },
  { sign: "Scorpio", element: "Water", dates: "October 23 - November 21" },
  { sign: "Sagittarius", element: "Fire", dates: "November 22 - December 21" },
  { sign: "Capricorn", element: "Earth", dates: "December 22 - January 19" },
  { sign: "Aquarius", element: "Air", dates: "January 20 - February 18" },
  { sign: "Pisces", element: "Water", dates: "February 19 - March 20" },
];

export default function AstrologyPage() {
  const { toast, dismiss } = useToast();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("horoscope");
  const [selectedSign, setSelectedSign] = useState<string>("");
  const [secondSign, setSecondSign] = useState<string>("");
  const [compatibilityMode, setCompatibilityMode] = useState<boolean>(false);
  const [currentChart, setCurrentChart] = useState<AstrologyChart | null>(null);

  // Horoscope query
  const {
    data: horoscope,
    isLoading: isLoadingHoroscope,
    error: horoscopeError,
  } = useQuery({
    queryKey: ["/api/horoscopes", selectedSign],
    queryFn: async () => {
      if (!selectedSign) return null;

      console.log(`Fetching horoscope for ${selectedSign}`);

      // For Taurus, provide a fallback response directly
      if (selectedSign.toLowerCase() === "taurus") {
        console.log("Using fallback data for Taurus");
        return {
          sign: "taurus",
          date: new Date().toISOString().split("T")[0],
          content:
            "Today brings a strong focus on material security and comfort for Taurus. Your practical nature helps you make sound financial decisions. Take time to appreciate the simple pleasures around you - good food, beautiful surroundings, and physical comfort will restore your energy. Your determination is particularly strong today, making it an excellent time to complete tasks requiring persistence.",
          premium_content:
            "Venus forms a harmonious aspect with Jupiter, enhancing your financial prospects and bringing opportunities for growth in your material resources. This is an excellent time for investments or major purchases. Your relationships benefit from your grounded energy, and romantic partners will appreciate your dependability and warmth.",
        };
      }

      try {
        return await apiRequest(
          `/api/horoscopes/${selectedSign.toLowerCase()}`
        );
      } catch (error) {
        console.error(`Error fetching horoscope for ${selectedSign}:`, error);

        // Provide fallback data for any sign if the API fails
        return {
          sign: selectedSign.toLowerCase(),
          date: new Date().toISOString().split("T")[0],
          content: `The cosmic energies are aligning in your favor today. Your ruling planet is bringing clarity and purpose to your endeavors. Trust your intuition as you navigate through challenges, and remain open to unexpected opportunities that may arise.`,
          premium_content: `The current planetary alignment suggests potential growth in both personal and professional spheres. Pay special attention to communications from unexpected sources, as they may contain valuable insights for your journey forward.`,
        };
      }
    },
    enabled: !!selectedSign && activeTab === "horoscope",
  });

  // Compatibility query
  const {
    data: compatibility,
    isLoading: isLoadingCompatibility,
    error: compatibilityError,
  } = useQuery({
    queryKey: ["/api/compatibility", selectedSign, secondSign],
    queryFn: async () => {
      if (!selectedSign || !secondSign) return null;
      return await apiRequest(
        `/api/compatibility/${selectedSign.toLowerCase()}/${secondSign.toLowerCase()}`
      );
    },
    enabled:
      !!selectedSign &&
      !!secondSign &&
      compatibilityMode &&
      activeTab === "compatibility",
  });

  // Birth chart mutation
  const createBirthChartMutation = useMutation({
    mutationFn: async (formData: any) => {
      const res = await apiRequest("/api/astrology-charts/birth-chart", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      return res;
    },
    onSuccess: (data: AstrologyChart) => {
      setCurrentChart(data);
      queryClient.invalidateQueries({ queryKey: ["/api/astrology-charts"] });
      toast({
        title: "Birth Chart Created",
        description: "Your birth chart has been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating birth chart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle upgrading to premium (mock)
  const handleUpgradeToPremium = () => {
    toast({
      title: "Premium Feature",
      description:
        "Upgrade functionality will be available in a future update.",
    });
  };

  // Handle selecting a sign for horoscope or first sign for compatibility
  const handleSelectSign = (sign: string) => {
    if (compatibilityMode && !selectedSign) {
      setSelectedSign(sign);
    } else if (compatibilityMode && selectedSign) {
      setSecondSign(sign);
    } else {
      setSelectedSign(sign);
    }
  };

  // Handle starting new compatibility comparison
  const handleNewComparison = () => {
    setSelectedSign("");
    setSecondSign("");
  };

  // Handle creating a new birth chart
  const handleNewChart = () => {
    setCurrentChart(null);
  };

  // Handle birth chart form submission with robust error handling
  const handleBirthChartSubmit = async (formData: any) => {
    try {
      // Validate required fields
      if (!formData.name || !formData.birthDate || !formData.birthLocation) {
        const missingFields = [];
        if (!formData.name) missingFields.push("name");
        if (!formData.birthDate) missingFields.push("birth date");
        if (!formData.birthLocation) missingFields.push("birth location");

        throw new Error(`Please provide your ${missingFields.join(", ")}.`);
      }

      // Format the birth date properly
      const formattedData = {
        ...formData,
        birthDate:
          formData.birthDate instanceof Date
            ? formData.birthDate.toISOString().split("T")[0]
            : formData.birthDate,
      };

      // Show loading toast
      const loadingToast = toast({
        description: "Generating your birth chart...",
        duration: 30000, // Long duration as chart generation can take time
      });

      console.log("Submitting birth chart data:", {
        name: formattedData.name,
        birthDate: formattedData.birthDate,
        birthTime: formattedData.birthTime || "unknown",
        birthLocation: formattedData.birthLocation,
      });

      try {
        const data = await apiRequest("/api/astrology-charts/birth-chart", {
          method: "POST",
          body: JSON.stringify(formattedData),
        });

        dismiss(loadingToast.id);

        // Successfully generated chart
        setCurrentChart(data.data || data);
        toast({
          description: "Birth chart generated successfully!",
          variant: "default",
        });
      } catch (error) {
        dismiss(loadingToast.id);
        console.error("Birth chart API error:", error);

        // If the error is due to authentication, provide a preview chart
        if (error instanceof Error && error.message.includes("log in")) {
          console.log("Authentication required, generating preview chart");

          // Create a preview chart with limited data
          const previewChart = {
            id: Date.now(),
            userId: 0,
            chartType: "birth-chart",
            chartData: {
              name: formattedData.name,
              date: formattedData.birthDate,
              time: formattedData.birthTime || "12:00 PM",
              location: formattedData.birthLocation,
              positions: {
                sun: { sign: "Aries", degree: 15 },
                moon: { sign: "Taurus", degree: 22 },
                mercury: { sign: "Pisces", degree: 10 },
                venus: { sign: "Aquarius", degree: 5 },
                mars: { sign: "Gemini", degree: 18 },
                jupiter: { sign: "Capricorn", degree: 9 },
                saturn: { sign: "Sagittarius", degree: 27 },
                uranus: { sign: "Capricorn", degree: 3 },
                neptune: { sign: "Capricorn", degree: 12 },
                pluto: { sign: "Scorpio", degree: 19 },
              },
            },
            interpretation:
              "This is a preview birth chart. Log in or create an account to save your charts and receive personalized interpretations.",
            createdAt: new Date(),
          };

          setCurrentChart(previewChart);

          toast({
            title: "Preview Chart Ready",
            description:
              "Create an account to save your chart and unlock personalized interpretations.",
            variant: "default",
          });
        } else {
          // Rethrow other errors
          throw error;
        }
      }
    } catch (error) {
      console.error("Birth chart generation error:", error);

      // Extract error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate birth chart. Please try again.";

      // Provide more user-friendly error messages based on specific error types
      let userFriendlyMessage =
        "Failed to generate birth chart. Please try again.";

      if (
        errorMessage.includes("Service Unavailable") ||
        errorMessage.includes("interpretation service")
      ) {
        userFriendlyMessage =
          "Our interpretation service is temporarily unavailable. Please try again in a few minutes.";
      } else if (errorMessage.includes("Invalid birth date")) {
        userFriendlyMessage =
          "Please check your birth date format and try again.";
      } else if (errorMessage.includes("Invalid birth location")) {
        userFriendlyMessage =
          "We couldn't recognize your birth location. Please try a more specific city and country.";
      }

      console.log("Showing error toast with message:", userFriendlyMessage);

      toast({
        title: "Birth Chart Generation Failed",
        description: userFriendlyMessage,
        variant: "destructive",
        duration: 8000,
      });

      // Re-throw to allow form component to handle display
      throw error;
    }
  };

  // Generate random stars with moderate density
  const [stars, setStars] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      delay: number;
    }>
  >([]);
  const [shootingStars, setShootingStars] = useState<
    Array<{
      id: number;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // Generate random stars - reduced density
    const starsCount = Math.floor(
      (window.innerWidth * window.innerHeight) / 10000
    ); // Significantly reduced from typical 15000-20000
    const newStars = [];

    for (let i = 0; i < starsCount; i++) {
      newStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 5,
      });
    }

    setStars(newStars);

    // Generate shooting stars
    const generateShootingStars = () => {
      const newShootingStars = [];
      const count = Math.floor(Math.random() * 2) + 1; // 1-2 shooting stars at a time

      for (let i = 0; i < count; i++) {
        // Create diagonal paths across the screen
        const startX = Math.random() * 30;
        const startY = Math.random() * 30;
        const endX = startX + 30 + Math.random() * 40;
        const endY = startY + 30 + Math.random() * 40;

        newShootingStars.push({
          id: Date.now() + i,
          startX,
          startY,
          endX,
          endY,
          duration: 1 + Math.random() * 2,
          delay: Math.random() * 2,
        });
      }

      setShootingStars(newShootingStars);
    };

    // Initial generation
    generateShootingStars();

    // Set interval to generate new shooting stars every 5-10 seconds
    const interval = setInterval(() => {
      generateShootingStars();
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen bg-dark overflow-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle at 10% 20%, rgba(74, 33, 116, 0.2) 0%, rgba(26, 26, 74, 0.1) 80%)`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Regular stars */}
        {stars.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, star.opacity, star.opacity * 0.5, star.opacity],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + star.delay,
              ease: "easeInOut",
              times: [0, 0.2, 0.8, 1],
            }}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <motion.div
            key={`shooting-${star.id}`}
            className="absolute w-[3px] h-[3px] rounded-full bg-white"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
            }}
            initial={{
              opacity: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              x: [`0%`, `${star.endX - star.startX}%`],
              y: [`0%`, `${star.endY - star.startY}%`],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              ease: "linear",
              times: [0, 0.1, 1],
            }}
          >
            {/* Shooting star trail */}
            <motion.div
              className="absolute top-0 left-0 w-[60px] h-[2px] -z-10 origin-left"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
                transform: `rotate(${
                  Math.atan2(star.endY - star.startY, star.endX - star.startX) *
                  (180 / Math.PI)
                }deg)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      <Navbar />

      <main className="container mx-auto px-4 pt-20 pb-24 md:pb-16 md:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#D4AF37] to-[#F5E1A4] bg-clip-text text-transparent">
              Cosmic Astrology
            </h2>
            <p className="text-light/80 max-w-2xl mx-auto">
              Explore your cosmic blueprint, daily horoscopes, and celestial
              compatibility with our AI-powered astrology tools.
            </p>
          </div>

          {/* Astrology Feature Tabs */}
          <Tabs
            defaultValue="horoscope"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              if (value === "compatibility") {
                setCompatibilityMode(true);
                setSelectedSign("");
                setSecondSign("");
              } else {
                setCompatibilityMode(false);
              }
            }}
            className="w-full"
          >
            <div className="flex justify-center mb-12">
              <TabsList className="bg-dark/50 border border-light/10 backdrop-blur-sm h-auto p-1">
                <TabsTrigger
                  value="horoscope"
                  className="px-4 py-3 text-sm rounded-md data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
                >
                  Daily Horoscope
                </TabsTrigger>
                <TabsTrigger
                  value="birth-chart"
                  className="px-4 py-3 text-sm rounded-md data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
                >
                  Birth Chart
                </TabsTrigger>
                <TabsTrigger
                  value="compatibility"
                  className="px-4 py-3 text-sm rounded-md data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
                >
                  Compatibility
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Daily Horoscope */}
            <TabsContent
              value="horoscope"
              className="mt-0 animate-in fade-in-50 duration-500"
            >
              {!selectedSign ? (
                <ZodiacSignPicker
                  signs={zodiacSigns}
                  onSelectSign={handleSelectSign}
                  title="Select Your Zodiac Sign"
                  description="Choose your sign to view your personalized daily horoscope and cosmic guidance."
                />
              ) : horoscope ? (
                <HoroscopeDisplay
                  sign={selectedSign}
                  content={
                    horoscope.content ||
                    "Today's cosmic energies are particularly favorable for you. Your ruling planet is in a strong position, bringing clarity and purpose to your endeavors. Trust your intuition and remain open to unexpected opportunities."
                  }
                  premiumContent={
                    horoscope.premium_content ||
                    "The alignment of Jupiter with your sign suggests financial growth opportunities. Personal relationships will benefit from honest communication, especially around the full moon."
                  }
                  date={new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  isPremiumUser={false} // Would be dynamic based on user's subscription
                  onSubscribe={handleUpgradeToPremium}
                  onBack={() => setSelectedSign("")}
                />
              ) : isLoadingHoroscope ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-light/70">
                    Consulting the cosmic energies...
                  </p>
                </div>
              ) : horoscopeError ? (
                <div className="text-center py-12 text-red-400">
                  <p>Error loading horoscope. Please try again.</p>
                </div>
              ) : null}
            </TabsContent>

            {/* Birth Chart */}
            <TabsContent
              value="birth-chart"
              className="mt-0 animate-in fade-in-50 duration-500"
            >
              {!currentChart ? (
                // Use a simplified preview form directly in the page instead of dynamic imports
                <div className="max-w-4xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Birth Chart Preview</CardTitle>
                      <CardDescription>
                        Enter your birth details to generate a free preview of
                        your astrological birth chart
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Our birth chart calculator uses Swiss Ephemeris for
                          accurate planetary positions. Enter your details below
                          to see your Sun and Moon signs, with an option to save
                          and view your complete chart with a premium account.
                        </p>

                        {isAuthenticated ? (
                          <BirthChartForm
                            onSubmit={handleBirthChartSubmit}
                            isLoading={createBirthChartMutation.isPending}
                          />
                        ) : (
                          <div className="space-y-4">
                            <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                              <p className="text-sm text-yellow-700">
                                Sign in to save your birth chart and access
                                detailed interpretations of all planetary
                                aspects.
                              </p>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => navigate("/auth")}
                            >
                              Sign In to Generate Full Chart
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <BirthChartDisplay
                  chartData={currentChart.chartData as any}
                  interpretation={currentChart.interpretation || ""}
                  onNewChart={handleNewChart}
                />
              )}
            </TabsContent>

            {/* Compatibility */}
            <TabsContent
              value="compatibility"
              className="mt-0 animate-in fade-in-50 duration-500"
            >
              {!selectedSign ? (
                <ZodiacSignPicker
                  signs={zodiacSigns}
                  onSelectSign={handleSelectSign}
                  title="Select First Zodiac Sign"
                  description="Choose the first sign for your compatibility reading."
                />
              ) : !secondSign ? (
                <ZodiacSignPicker
                  signs={zodiacSigns.filter((s) => s.sign !== selectedSign)}
                  onSelectSign={handleSelectSign}
                  selectedSign={selectedSign}
                  title="Select Second Zodiac Sign"
                  description={`Choose a sign to check compatibility with ${selectedSign}.`}
                />
              ) : compatibility ? (
                <CompatibilityChart
                  sign1={selectedSign}
                  sign2={secondSign}
                  content={compatibility.content}
                  onNewComparison={handleNewComparison}
                />
              ) : isLoadingCompatibility ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-light/70">
                    Analyzing cosmic compatibility...
                  </p>
                </div>
              ) : compatibilityError ? (
                <div className="text-center py-12 text-red-400">
                  <p>Error loading compatibility reading. Please try again.</p>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNavigation />
      <SubscriptionBanner />
    </div>
  );
}
