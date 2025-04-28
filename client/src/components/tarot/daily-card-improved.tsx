// client/src/components/tarot/daily-card-improved.tsx
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, RefreshCw, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming base Card component
import { useAuth } from "@client/hooks/use-auth"; // Assuming useAuth hook provides user object with id
import { saveFeedback } from "@client/utils/feedback-utils";
import {
  DailyCardData,
  fetchDailyCard,
  getSimpleTarotCardImagePath,
} from "@client/utils/tarot-utils";
import AnimatedTarotCard from "./animated-tarot-card"; // Assuming this component exists and works

interface DailyCardImprovedProps {
  onViewFullReading?: () => void; // Optional prop for linking to a detailed reading page
  className?: string;
}

const DailyCardImproved: React.FC<DailyCardImprovedProps> = ({
  onViewFullReading,
  className = "",
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // State for detailed view (optional)
  const { user } = useAuth(); // TODO: Ensure useAuth() provides { user: { id: string } | null }
  const userId = user?.id;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch daily card using react-query
  const {
    data: dailyCardData,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<DailyCardData, Error>({
    // Key ensures data is fetched per user per day and only refetched if these change
    queryKey: ["dailyCard", userId, today],
    queryFn: () => fetchDailyCard(userId),
    staleTime: 1000 * 60 * 60 * 12, // Keep data fresh for 12 hours
    gcTime: 1000 * 60 * 60 * 24, // Use gcTime instead of cacheTime in TanStack Query v5
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch if stale on mount
    retry: 1, // Retry failed requests once
  });

  // Reset reveal state if data changes (new day or user)
  useEffect(() => {
    setIsRevealed(false);
    setShowDetails(false);
  }, [dailyCardData]);

  const handleReveal = () => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
  };

  const handleFeedbackSubmit = async (choice: string) => {
    try {
      await saveFeedback(choice, userId);
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1500); // Sparkle duration
    } catch (err) {
      console.error("Failed to save feedback:", err);
      // TODO: Optionally show a user-facing error toast/message here
    }
  };

  const handleViewDetails = () => setShowDetails(true);
  const handleCloseDetails = () => setShowDetails(false);

  // --- Loading State ---
  if (isLoading) {
    return (
      <Card
        className={`w-full max-w-md mx-auto border border-gold/20 bg-primary-10/50 ${className}`}
      >
        <CardHeader>
          <CardTitle className="text-center text-gold/80 animate-pulse">
            Your Daily Tarot
          </CardTitle>
          {/* Replace CardDescription with div to avoid nesting issues */}
          <div className="text-sm text-muted-foreground text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 text-light/50">
              <Calendar className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-10">
          <div className="w-64 h-96 bg-gradient-to-br from-indigo-700/30 to-purple-900/30 rounded-lg animate-pulse flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-gold/30 animate-spin slow-spin" />
          </div>
          <p className="text-sm text-center mt-4 text-light/70 animate-pulse">
            The mystical energies are aligning...
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- Error State ---
  // This state is reached if the fetch fails OR if dailyCardData is missing after loading
  if (isError || !dailyCardData) {
    console.error("Error state triggered for Daily Card. Error:", error);
    return (
      <Card
        className={`w-full max-w-md mx-auto border border-destructive/30 bg-primary-10/50 ${className}`}
      >
        <CardHeader>
          <CardTitle className="text-center text-destructive">
            Unable to Reveal Your Card
          </CardTitle>
          <div className="text-sm text-muted-foreground text-center">
            <div className="flex items-center justify-center gap-2 text-light/70">
              <Calendar className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="w-64 h-96 bg-primary-20/50 rounded-lg flex items-center justify-center relative overflow-hidden border border-destructive/20">
            <div className="p-6 text-center flex flex-col items-center">
              <p className="text-light/80 mb-4">
                {error?.message ||
                  "The mystical energies are temporarily disrupted. Please try again later."}
              </p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Success State ---
  const { card, isReversed } = dailyCardData;

  // Log card data to help with debugging
  console.log("Card data received:", card);

  // Main component structure with AnimatePresence for detailed view toggle
  return (
    <AnimatePresence mode="wait">
      {showDetails ? (
        // --- Detailed Card View --- (Optional - kept structure from previous context)
        // TODO: Populate this section fully if detailed view is needed
        <motion.div
          key="details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          <Card className="w-full max-w-4xl mx-auto bg-primary-10 border-gold/30">
            <CardHeader>
              <CardTitle className="text-center mt-2 text-gold">
                {card.name}
              </CardTitle>
              {/* ... More header details ... */}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <AnimatedTarotCard
                    card={card}
                    isReversed={isReversed}
                    size="xl"
                    autoReveal={true}
                    imagePath={getSimpleTarotCardImagePath(card)}
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gold mb-2">
                    {isReversed ? "Reversed Meaning" : "Upright Meaning"}
                  </h3>
                  <p className="text-light/90">
                    {isReversed
                      ? card.reversed_meaning || card.meaningReversed
                      : card.upright_meaning || card.meaningUpright}
                  </p>

                  {/* Keywords */}
                  {card.keywords && card.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gold mb-2">
                        Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {card.keywords.map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="bg-primary-20 px-2 py-1 rounded text-sm text-light/90"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Element and Zodiac */}
                  <div className="grid grid-cols-2 gap-4">
                    {(card.element || card.elemental_association) && (
                      <div>
                        <h3 className="text-sm font-medium text-gold mb-1">
                          Element
                        </h3>
                        <p className="text-light/90">
                          {card.element || card.elemental_association}
                        </p>
                      </div>
                    )}

                    {(card.zodiacSign || card.astrological_association) && (
                      <div>
                        <h3 className="text-sm font-medium text-gold mb-1">
                          Zodiac
                        </h3>
                        <p className="text-light/90">
                          {card.zodiacSign || card.astrological_association}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleCloseDetails}
                className="border-gold/50 text-gold"
              >
                Back to Card
              </Button>
              {onViewFullReading && (
                <Button
                  onClick={onViewFullReading}
                  className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Full Reading
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        // --- Simple Daily Card View ---
        <motion.div
          key="simple"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {/* This section contains the Daily Card, Signup CTA, and Feedback */}
          <section className="relative text-center py-10 px-4 md:px-6">
            <h2 className="text-3xl md:text-5xl font-serif text-gold mb-8">
              Today's Cosmic Guidance
            </h2>

            {/* Clickable Tarot Card Area */}
            <div
              className="relative w-64 h-96 mx-auto mb-8 cursor-pointer perspective-1000"
              onClick={handleReveal}
            >
              {/* TODO: Ensure AnimatedTarotCard handles loading/error internally or pass props */}
              <AnimatedTarotCard
                card={card} // Pass the fetched card data
                isReversed={isReversed}
                size="lg"
                autoReveal={isRevealed} // Reveal only when state is true
                imagePath={getSimpleTarotCardImagePath(card)}
              />
            </div>

            {/* Instructional Text */}
            {!isRevealed && (
              <p className="text-sm text-center mb-12 text-light/80 animate-pulse">
                Tap the card to reveal your guidance...
              </p>
            )}

            {/* Signup CTA - Always visible after card */}
            <div className="mt-12 relative">
              {" "}
              {/* Added relative positioning for sparkle */}
              <h3 className="text-2xl text-white mb-4 font-serif">
                Unlock Your Mystical Journey — Sign Up Free!
              </h3>
              {/* TODO: Ensure Button component handles 'asChild' correctly or use standard link */}
              <Button
                asChild
                className="relative inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
              >
                <a href="/signup">
                  {" "}
                  {/* Ensure you have a /signup route */}
                  Create My Free Account
                  {/* Sparkle animation positioned relative to the button */}
                  {showSparkle && (
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full opacity-70 animate-sparkle pointer-events-none"
                      style={{ filter: "blur(4px)" }} // Soft sparkle
                    />
                  )}
                </a>
              </Button>
            </div>

            {/* Feedback Prompt - Shows only AFTER reveal */}
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-16 p-6 bg-gradient-to-r from-purple-800/70 via-indigo-800/70 to-black/70 rounded-lg shadow-lg max-w-md mx-auto backdrop-blur-sm"
              >
                <h3 className="text-xl font-serif text-white mb-4">
                  How aligned did today's card feel?
                </h3>
                {/* TODO: Consider accessibility for button group */}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button
                    onClick={() => handleFeedbackSubmit("deeply_resonated")}
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 flex-1"
                  >
                    Deeply Resonated 🌟
                  </Button>
                  <Button
                    onClick={() => handleFeedbackSubmit("somewhat_relevant")}
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-700/20 flex-1"
                  >
                    Somewhat Relevant 🌙
                  </Button>
                  <Button
                    onClick={() => handleFeedbackSubmit("not_really")}
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-800/30 flex-1"
                  >
                    Not Really 🔮
                  </Button>
                </div>
                <p className="mt-4 text-xs text-gray-400 italic">
                  Your insights shape a deeper connection for your next reading.
                  ✨
                </p>
              </motion.div>
            )}

            {/* Optional: Button to view full details if needed */}
            {isRevealed && onViewFullReading && (
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={handleViewDetails}
                  className="border-gold/50 text-gold"
                >
                  View Full Details
                </Button>
              </div>
            )}
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyCardImproved;
