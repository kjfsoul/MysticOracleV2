import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar-fixed";
import MobileNavigation from "@/components/layout/mobile-navigation";
import SubscriptionBanner from "@/components/layout/subscription-banner";
import TarotDeck from "@/components/tarot/tarot-deck";
import TarotReading from "@/components/tarot/tarot-reading";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TarotReading as TarotReadingType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowRight, Sparkles, BookOpen } from "lucide-react";

type SpreadType = "single" | "past-present-future" | "celtic-cross";

export default function TarotPage() {
  const [showSelectionArea, setShowSelectionArea] = useState(true);
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>("single");
  const [currentReading, setCurrentReading] = useState<TarotReadingType | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [showSpreadInfo, setShowSpreadInfo] = useState(false);
  const { toast } = useToast();

  // References for scroll positions
  const readingTopRef = useRef<HTMLDivElement>(null);
  const selectionAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to the top when switching modes
  useEffect(() => {
    if (!showSelectionArea && readingTopRef.current) {
      readingTopRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (showSelectionArea && selectionAreaRef.current) {
      selectionAreaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showSelectionArea]);

  const createReadingMutation = useMutation({
    mutationFn: async (cards: any) => {
      try {
        console.log("Generating tarot reading with spread:", selectedSpread);
        
        // Use apiRequest to generate a reading
        const readingData = await apiRequest('/api/public/tarot-readings', {
          method: 'POST',
          body: JSON.stringify({
            spread: selectedSpread,
            question: userQuestion || null
          })
        });
        return readingData;
      } catch (error) {
        console.error("Error in tarot reading generation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setCurrentReading(data);
      // No need to invalidate queries since we're not using authentication
    },
    onError: (error) => {
      console.error("Tarot reading error:", error);
      toast({
        title: "Reading Generation Error",
        description: "Unable to generate your tarot reading. Please try again.",
        variant: "destructive"
      });

      // Reset to selection mode
      setShowSelectionArea(true);
    }
  });

  const getCardCount = (spread: SpreadType): number => {
    switch (spread) {
      case "single": return 1;
      case "past-present-future": return 3;
      case "celtic-cross": return 10;
      default: return 1;
    }
  };

  const getSpreadDescription = (spread: SpreadType): string => {
    switch (spread) {
      case "single":
        return "A single card provides quick insight for a specific question or daily guidance. Perfect for beginners or when you need a straightforward answer.";
      case "past-present-future":
        return "This three-card spread reveals the influences of your past, your current situation, and potential outcomes. Ideal for understanding your journey through time.";
      case "celtic-cross":
        return "The most comprehensive spread with ten cards, exploring your current situation, challenges, past and future influences, hopes, fears, and potential outcomes. Best for complex questions.";
      default:
        return "";
    }
  };

  const handleSelectSpread = (spread: SpreadType) => {
    setSelectedSpread(spread);
  };

  const handleCardSelection = (cards: any) => {
    // Hide the deck
    setShowSelectionArea(false);

    // Toast notification for loading
    toast({
      title: "Generating your reading...",
      description: "This may take a moment as the cards reveal their secrets.",
    });

    // Create reading
    createReadingMutation.mutate(cards);
  };

  const handleStartNew = () => {
    setShowSelectionArea(true);
    setCurrentReading(null);
    setUserQuestion("");
  };

  const toggleSpreadInfo = () => {
    setShowSpreadInfo(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-dark bg-[radial-gradient(circle_at_10%_20%,rgba(74,33,116,0.2)_0%,rgba(26,26,74,0.1)_80%)]"
         style={{
           backgroundImage: `
             radial-gradient(circle at 10% 20%, rgba(74, 33, 116, 0.2) 0%, rgba(26, 26, 74, 0.1) 80%),
             url('https://images.unsplash.com/photo-1518818608552-195ed130cda4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')
           `,
           backgroundBlendMode: 'overlay',
           backgroundAttachment: 'fixed',
           backgroundSize: 'cover'
         }}>
      <Navbar />

      <main className="container mx-auto px-4 pt-20 pb-24 md:pb-16 md:pt-24">
        <div ref={readingTopRef} className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-6 md:mb-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 arcane-text">
              {showSelectionArea ? "Tarot Reading" : "Your Tarot Reading"}
            </h2>
            <AnimatePresence mode="wait">
              {showSelectionArea ? (
                <motion.div
                  key="selection-description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <p className="text-light/80 max-w-2xl mx-auto">
                      Ask a specific question or focus on a situation as you select your cards. The tarot will provide personalized insight.
                    </p>
                    <div className="flex justify-center items-center mt-4">
                      <Link to="/tarot-cards" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 rounded-full border border-purple-500/30 transition-all duration-300 mystic-glow">
                        <BookOpen className="h-4 w-4" />
                        <span>View All 78 Tarot Cards</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reading-subtitle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-light/80 max-w-2xl mx-auto">
                    {currentReading?.question ? (
                      <>Your question: <span className="italic">"{currentReading.question}"</span></>
                    ) : (
                      "The cards have revealed their wisdom for you"
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {showSelectionArea ? (
              <motion.div 
                key="selection-area"
                ref={selectionAreaRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-16"
              >
                <div className="text-center mb-8">
                  <div className="flex justify-center items-center gap-2 mb-2">
                    <h3 className="font-heading text-2xl font-semibold text-accent/90">Choose Your Spread</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-6 w-6 text-light/60 hover:text-light hover:bg-dark/30"
                      onClick={toggleSpreadInfo}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showSpreadInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-dark/40 border border-light/10 rounded-lg p-4 max-w-2xl mx-auto mb-4">
                          <p className="text-light/80 text-sm mb-2">
                            Different spreads provide different levels of insight:
                          </p>
                          <ul className="text-sm text-left">
                            <li className="mb-2 flex gap-2">
                              <div className="text-accent min-w-5">•</div>
                              <div className="text-light/70"><span className="text-accent/90">Single Card:</span> Quick insight for a specific question</div>
                            </li>
                            <li className="mb-2 flex gap-2">
                              <div className="text-accent min-w-5">•</div>
                              <div className="text-light/70"><span className="text-accent/90">Past-Present-Future:</span> Understand your journey through time</div>
                            </li>
                            <li className="flex gap-2">
                              <div className="text-accent min-w-5">•</div>
                              <div className="text-light/70"><span className="text-accent/90">Celtic Cross:</span> Comprehensive reading for complex situations</div>
                            </li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto">
                    <button 
                      className={`px-4 py-2 rounded-full border transition ${
                        selectedSpread === "single" 
                        ? "border-accent bg-accent/20 text-accent" 
                        : "border-light/30 text-light/70 hover:bg-light/5 hover:border-light/50"
                      }`}
                      onClick={() => handleSelectSpread("single")}>
                      Single Card
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-full border transition ${
                        selectedSpread === "past-present-future" 
                        ? "border-accent bg-accent/20 text-accent" 
                        : "border-light/30 text-light/70 hover:bg-light/5 hover:border-light/50"
                      }`}
                      onClick={() => handleSelectSpread("past-present-future")}>
                      Past-Present-Future
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-full border transition ${
                        selectedSpread === "celtic-cross"
                        ? "border-accent bg-accent/20 text-accent" 
                        : "border-light/30 text-light/70 hover:bg-light/5 hover:border-light/50"
                      }`}
                      onClick={() => handleSelectSpread("celtic-cross")}>
                      Celtic Cross
                    </button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="max-w-xl mx-auto mb-4"
                >
                  <div className="bg-dark/40 backdrop-blur-sm rounded-lg p-5 border border-light/10">
                    <h4 className="flex items-center gap-2 font-medium text-accent mb-3">
                      <Sparkles className="h-4 w-4" />
                      About {selectedSpread === "celtic-cross" ? "the" : ""} {selectedSpread} Spread
                    </h4>
                    <p className="text-light/80 text-sm mb-4">
                      {getSpreadDescription(selectedSpread)}
                    </p>
                    <p className="text-accent/70 text-xs">
                      {selectedSpread === "single" ? "Draws 1 card" : selectedSpread === "past-present-future" ? "Draws 3 cards" : "Draws 10 cards"}
                    </p>
                  </div>
                </motion.div>

                {/* Question input */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="max-w-xl mx-auto my-8"
                >
                  <div className="bg-dark/40 backdrop-blur-sm rounded-lg p-5 border border-light/10">
                    <label htmlFor="question" className="block text-light mb-2 text-base font-medium">
                      Ask Your Question
                    </label>
                    <p className="text-light/70 text-sm mb-3">
                      For the most accurate reading, be clear and specific about what you want to know. Your question will provide context to your reading.
                    </p>
                    <textarea
                      id="question"
                      className="w-full bg-dark/60 border border-light/20 rounded-lg px-4 py-3 text-light focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none"
                      placeholder="E.g., What should I focus on in my career right now?"
                      rows={3}
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                    />
                    <div className="flex justify-between mt-2">
                      <p className="text-light/50 text-xs italic">Your question will be private and only visible to you</p>
                      <p className="text-light/50 text-xs">{userQuestion.length}/200</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      className="bg-primary/30 text-light hover:bg-primary/50 border border-primary/20 rounded-full px-6 py-5 text-base"
                      onClick={() => {
                        // Only submit the question, don't start reading yet
                        if (userQuestion.trim()) {
                          toast({
                            title: "Question submitted",
                            description: "Now select a card from the deck below to reveal your reading",
                            variant: "default",
                          });
                        }
                      }}
                      disabled={createReadingMutation.isPending}
                    >
                      {createReadingMutation.isPending ? (
                        <span className="flex items-center">
                          <span className="w-5 h-5 border-2 border-t-transparent border-light rounded-full animate-spin mr-2"></span>
                          Preparing your reading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Submit Question
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>

                {/* Card deck */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <TarotDeck 
                    spread={selectedSpread}
                    onCardSelection={handleCardSelection}
                    isLoading={createReadingMutation.isPending}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="reading-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentReading && (
                  <TarotReading 
                    reading={currentReading} 
                    onNewReading={handleStartNew} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <MobileNavigation />
      <SubscriptionBanner />
    </div>
  );
}