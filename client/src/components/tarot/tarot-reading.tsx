import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { TarotReading as TarotReadingType } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bookmark, Download, Info, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import SimplePersonalizedInterpretation from "./simple-personalized-interpretation";
import TarotCard from "./tarot-card";

interface TarotReadingProps {
  reading: TarotReadingType;
  onNewReading: () => void;
}

export default function TarotReading({
  reading,
  onNewReading,
}: TarotReadingProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(reading.isSaved);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [spreadLayout, setSpreadLayout] = useState<
    "horizontal" | "grid" | "circle"
  >("horizontal");
  const [currentMood, setCurrentMood] = useState<string | undefined>(undefined);

  const cards = Array.isArray(reading.cards) ? reading.cards : [];
  const selectedCard = cards[selectedCardIndex] || cards[0] || {};

  useEffect(() => {
    // Determine best layout based on number of cards
    if (cards.length <= 3) {
      setSpreadLayout("horizontal");
    } else if (cards.length <= 7) {
      setSpreadLayout("grid");
    } else {
      setSpreadLayout("circle");
    }
  }, [cards.length]);

  const saveReadingMutation = useMutation({
    mutationFn: async (readingId: string) => {
      return apiRequest(`/api/tarot-readings/${readingId}/save`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarotReadings"] });
    },
  });

  const handleSaveReading = () => {
    if (reading && reading.id) {
      saveReadingMutation.mutate(reading.id);
    }
  };

  const handleShareReading = () => {
    // For now, just show a toast
    toast({
      title: "Share functionality",
      description: "This feature will be available in a future update.",
    });
  };

  // Get the position for cards in various layouts
  const getCardPosition = (index: number) => {
    if (spreadLayout === "horizontal") {
      // Horizontal fan layout
      const totalCards = cards.length;
      const angle = (index - Math.floor(totalCards / 2)) * 15; // angle between cards
      return {
        transform: `rotate(${angle}deg) translateY(${
          index === selectedCardIndex ? -30 : 0
        }px)`,
        transformOrigin: "bottom center",
        margin: "0 -20px", // overlap cards slightly
        zIndex: index === selectedCardIndex ? 10 : index,
        transition: "all 0.3s ease",
      };
    } else if (spreadLayout === "circle") {
      // Circle arrangement for Celtic Cross (10 cards)
      const radius = 130;
      const angle = (index / cards.length) * Math.PI * 2;
      const x =
        Math.cos(angle) * (index === selectedCardIndex ? radius * 1.1 : radius);
      const y =
        Math.sin(angle) * (index === selectedCardIndex ? radius * 1.1 : radius);
      return {
        transform: `translate(${x}px, ${y}px) ${
          index === selectedCardIndex ? "scale(1.1)" : "scale(1)"
        }`,
        position: "absolute" as const,
        zIndex: index === selectedCardIndex ? 10 : index,
        transition: "all 0.3s ease",
      };
    } else {
      // Grid layout
      return {
        transform: index === selectedCardIndex ? "translateY(-15px)" : "none",
        zIndex: index === selectedCardIndex ? 10 : 0,
        transition: "all 0.3s ease",
      };
    }
  };

  // Generate appropriate container class for each layout
  const getContainerClass = () => {
    switch (spreadLayout) {
      case "horizontal":
        return "flex justify-center items-end h-72 mb-8 mt-10";
      case "circle":
        return "relative flex justify-center items-center h-80 mb-16 mt-10";
      default:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center mb-16";
    }
  };

  // Get spread name based on card count
  const getSpreadName = () => {
    switch (cards.length) {
      case 1:
        return "Single Card";
      case 3:
        return "Past-Present-Future";
      case 10:
        return "Celtic Cross";
      default:
        return `${cards.length}-Card Spread`;
    }
  };

  // Get position labels based on spread type
  const getPositionLabel = (index: number) => {
    if (cards.length === 3) {
      return ["Past", "Present", "Future"][index];
    } else if (cards.length === 10) {
      return [
        "Present Situation",
        "Challenge",
        "Root of the Situation",
        "Recent Past",
        "Potential Outcome",
        "Immediate Future",
        "Your Influence",
        "External Influences",
        "Hopes or Fears",
        "Final Outcome",
      ][index];
    }
    return "";
  };

  return (
    <div className="animate-in fade-in duration-500">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        {/* Reading title and metadata */}
        <div className="text-center mb-8">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-accent/90 mb-2">
            {getSpreadName()} Reading
          </h3>
          {reading.question && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-light/80 mb-4 italic max-w-2xl mx-auto"
            >
              "{reading.question}"
            </motion.p>
          )}
          <div className="text-light/60 text-sm">
            {new Date(reading.createdAt).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Display all cards in appropriate layout */}
        <div className={getContainerClass()}>
          {cards.map((card: any, index: number) => (
            <motion.div
              key={index}
              style={getCardPosition(index)}
              whileHover={{
                y: spreadLayout !== "circle" ? -10 : 0,
                scale: 1.05,
              }}
              onClick={() => setSelectedCardIndex(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <TarotCard
                  isFlipped={true}
                  isSelectable={true}
                  imageUrl={(card as any).imageUrl}
                  cardName={(card as any).name}
                  size={index === selectedCardIndex ? "md" : "sm"}
                  isAnimated={index === selectedCardIndex}
                />
                {getPositionLabel(index) && (
                  <div className="text-center mt-2">
                    <span className="text-xs text-accent/80 bg-dark/70 px-2 py-1 rounded-full">
                      {getPositionLabel(index)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Selected card interpretation */}
      <motion.div
        key={selectedCardIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-background/60 backdrop-blur-sm rounded-xl border border-light/10 p-6 md:p-8 mb-12"
      >
        <Tabs defaultValue="interpretation" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="interpretation">
              Card Interpretation
            </TabsTrigger>
            <TabsTrigger value="reading">Reading Overview</TabsTrigger>
          </TabsList>

          {user && (
            <div className="mb-4 flex items-center gap-2">
              <label className="text-sm text-light/70">Current Mood:</label>
              <select
                className="bg-dark/60 border border-light/20 rounded px-2 py-1 text-sm text-light"
                value={currentMood || ""}
                onChange={(e) => setCurrentMood(e.target.value || undefined)}
              >
                <option value="">Select mood (optional)</option>
                <option value="reflective">Reflective</option>
                <option value="energetic">Energetic</option>
                <option value="anxious">Anxious</option>
                <option value="peaceful">Peaceful</option>
                <option value="curious">Curious</option>
                <option value="grateful">Grateful</option>
                <option value="inspired">Inspired</option>
                <option value="uncertain">Uncertain</option>
              </select>
            </div>
          )}

          <TabsContent value="interpretation">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/3 flex flex-col items-center">
                <TarotCard
                  isFlipped={true}
                  isSelectable={false}
                  imageUrl={(selectedCard as any).imageUrl}
                  cardName={(selectedCard as any).name}
                  cardNumber={(selectedCard as any).number}
                  size="md"
                  isAnimated={true}
                />

                {getPositionLabel(selectedCardIndex) && (
                  <div className="mt-3 text-sm text-light/70">
                    <span className="text-accent/80">Position:</span>{" "}
                    {getPositionLabel(selectedCardIndex)}
                  </div>
                )}

                <div className="text-center mt-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-accent/80 text-sm">
                      {(selectedCard as any).arcana === "major"
                        ? "Major Arcana"
                        : (selectedCard as any).suit || ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                {user ? (
                  <SimplePersonalizedInterpretation
                    cardId={
                      (selectedCard as any).id ||
                      `${
                        (selectedCard as any).arcana === "major"
                          ? "major"
                          : (selectedCard as any).suit
                      }-${(selectedCard as any).number}`
                    }
                    cardName={(selectedCard as any).name || "Card"}
                    isReversed={(selectedCard as any).reversal || false}
                    spreadPosition={getPositionLabel(selectedCardIndex)}
                    spreadType={reading.spread}
                    question={reading.question}
                    currentMood={currentMood}
                  />
                ) : (
                  <div className="prose prose-invert max-w-none text-light/90">
                    {(selectedCard as any).description && (
                      <div className="mb-4">
                        <h5 className="text-lg font-medium text-accent/90 mb-2">
                          Card Meaning
                        </h5>
                        <p>{(selectedCard as any).description}</p>
                      </div>
                    )}

                    <div>
                      <h5 className="text-lg font-medium text-accent/90 mb-2">
                        In Your Reading
                      </h5>
                      {reading.interpretation
                        .split("\n\n")
                        .slice(0, 2)
                        .map((paragraph: string, index: number) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                {/* AI Insight (first one free, then premium) */}
                <div className="mt-6 pt-6 border-t border-light/10">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-heading text-lg text-accent flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Personal Insight
                    </h5>
                    {reading.aiInsight ? (
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                        Available
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                        Premium
                      </span>
                    )}
                  </div>

                  {reading.aiInsight ? (
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      {reading.aiInsight
                        .split("\n\n")
                        .slice(0, 1)
                        .map((paragraph: string, index: number) => (
                          <p key={index} className="text-light/90 text-sm">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  ) : (
                    <div className="bg-dark/50 rounded-lg p-4 border border-light/5">
                      <p className="text-light/60 text-sm mb-4">
                        Your first reading includes a free Personal Insight.
                        Future readings with AI-powered personalized insights
                        require a premium subscription.
                      </p>
                      <Button
                        className="w-full py-2 bg-accent/20 border border-accent/50 rounded-lg text-accent hover:bg-accent/30"
                        onClick={() => {
                          window.location.href = "/#premium";
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reading">
            <div className="prose prose-invert max-w-none text-light/90">
              <p className="text-accent/80 italic mb-6">
                This is your complimentary reading overview. For deeper
                insights, consider upgrading to premium.
              </p>

              {reading.interpretation
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}

              {reading.aiInsight && (
                <div className="mt-6 pt-6 border-t border-light/10">
                  <h5 className="text-lg font-medium text-accent/90 mb-4">
                    AI Enhanced Insights
                  </h5>
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    {reading.aiInsight
                      .split("\n\n")
                      .map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
      >
        <Button
          variant="outline"
          className={`flex items-center justify-center gap-2 px-6 py-3 ${
            isSaved
              ? "bg-primary/50 border-primary/30"
              : "bg-primary/30 border-primary/20"
          } backdrop-blur-sm rounded-full text-light hover:bg-primary/70`}
          onClick={handleSaveReading}
          disabled={saveReadingMutation.isPending}
        >
          {isSaved ? (
            <Bookmark className="h-4 w-4 fill-current" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          <span>{isSaved ? "Saved" : "Save Reading"}</span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent/10 backdrop-blur-sm border border-accent/30 rounded-full text-accent hover:bg-accent/20"
          onClick={handleShareReading}
        >
          <Share2 className="h-4 w-4" />
          <span>Share Reading</span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent/10 backdrop-blur-sm border border-accent/30 rounded-full text-accent hover:bg-accent/20"
          onClick={() => {
            toast({
              title: "Download functionality",
              description: "This feature will be available in a future update.",
            });
          }}
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-dark/40 backdrop-blur-sm border border-light/20 rounded-full text-light/80 hover:bg-dark/60 hover:text-light"
          onClick={onNewReading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>New Reading</span>
        </Button>
      </motion.div>
    </div>
  );
}
