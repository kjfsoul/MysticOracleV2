import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TarotCard from "./tarot-card";
import { CardDefinition, getCardsByArcana, getCardsBySuit } from "@/data/tarot-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Sparkles, 
  Flame, 
  Droplet, 
  Wind, 
  Sprout, 
  Search, 
  ChevronRight, 
  X, 
  Info,
  MoveHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TarotGalleryProps {
  onSelectCard?: (card: CardDefinition) => void;
  className?: string;
}

export default function TarotGallery({ onSelectCard, className }: TarotGalleryProps) {
  // State
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCards, setFilteredCards] = useState<CardDefinition[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardDefinition | null>(null);
  const [cardDetailsOpen, setCardDetailsOpen] = useState<boolean>(false);

  // Get cards based on the selected tab
  useEffect(() => {
    let cards: CardDefinition[] = [];
    
    switch(selectedTab) {
      case "major":
        cards = getCardsByArcana("major");
        break;
      case "wands":
        cards = getCardsBySuit("wands");
        break;
      case "cups":
        cards = getCardsBySuit("cups");
        break;
      case "swords":
        cards = getCardsBySuit("swords");
        break;
      case "pentacles":
        cards = getCardsBySuit("pentacles");
        break;
      default:
        cards = [
          ...getCardsByArcana("major"),
          ...getCardsBySuit("wands"),
          ...getCardsBySuit("cups"),
          ...getCardsBySuit("swords"),
          ...getCardsBySuit("pentacles")
        ];
        break;
    }

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(card => 
        card.name.toLowerCase().includes(query) || 
        (card.meaning && card.meaning.toLowerCase().includes(query))
      );
    }

    setFilteredCards(cards);
  }, [selectedTab, searchQuery]);

  // Handle card click
  const handleCardClick = (card: CardDefinition) => {
    setSelectedCard(card);
    setCardDetailsOpen(true);
    
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  // Get appropriate icon for tab
  const getTabIcon = (tab: string) => {
    switch(tab) {
      case "major": return <Star className="h-4 w-4" />;
      case "wands": return <Flame className="h-4 w-4" />;
      case "cups": return <Droplet className="h-4 w-4" />;
      case "swords": return <Wind className="h-4 w-4" />;
      case "pentacles": return <Sprout className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto px-4 py-6", className)}>
      {/* Search & Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cards by name or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-purple-300/30 bg-slate-800/50 focus:outline-none focus:border-purple-500/60 text-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-300/70" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 rounded-full p-0.5 hover:bg-purple-500/20"
              >
                <X className="h-4 w-4 text-purple-300/70" />
              </button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-slate-900/70 border border-purple-300/20 backdrop-blur-sm w-full">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-900/40 data-[state=active]:backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                {getTabIcon("all")}
                <span className="hidden sm:inline">All Cards</span>
                <span className="sm:hidden">All</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="major" className="data-[state=active]:bg-purple-900/40 data-[state=active]:backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                {getTabIcon("major")}
                <span className="hidden sm:inline">Major</span>
                <span className="sm:hidden">Major</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="wands" className="data-[state=active]:bg-amber-900/40 data-[state=active]:backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                {getTabIcon("wands")}
                <span className="hidden sm:inline">Wands</span>
                <span className="sm:hidden">Wands</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="cups" className="data-[state=active]:bg-blue-900/40 data-[state=active]:backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                {getTabIcon("cups")}
                <span className="hidden sm:inline">Cups</span>
                <span className="sm:hidden">Cups</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="swords" className="data-[state=active]:bg-sky-900/40 data-[state=active]:backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                {getTabIcon("swords")}
                <span className="hidden sm:inline">Swords</span>
                <span className="sm:hidden">Swords</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="pentacles" className="data-[state=active]:bg-emerald-900/40 data-[state=active]:backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                {getTabIcon("pentacles")}
                <span className="hidden sm:inline">Pentacles</span>
                <span className="sm:hidden">Pent.</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Gallery section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab + searchQuery}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 gap-y-10">
              {filteredCards.map((card) => (
                <motion.div
                  key={card.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.random() * 0.3,
                    ease: "easeOut"
                  }}
                >
                  <TarotCard
                    card={card}
                    isSelectable
                    size="xs"
                    arcana={card.arcana}
                    suit={card.suit}
                    number={card.number}
                    onClick={() => handleCardClick(card)}
                    isFlipped={true}
                  />
                  <div className="mt-2 text-center">
                    <p className="text-white text-xs font-medium truncate w-full">{card.name}</p>
                    <p className="text-purple-300/70 text-[10px]">
                      {card.arcana === "major" ? "Major Arcana" : card.suit?.charAt(0).toUpperCase() + card.suit?.slice(1)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
              <div className="h-20 w-20 rounded-full bg-purple-900/20 flex items-center justify-center">
                <Search className="h-10 w-10 text-purple-300/50" />
              </div>
              <h3 className="text-lg font-medium text-white">No cards found</h3>
              <p className="text-purple-300/70 max-w-md">
                No cards matching "{searchQuery}" were found. Try a different search term or clear the search.
              </p>
              <Button
                variant="outline"
                className="mt-2 border-purple-500/30 text-purple-300 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Card Details Dialog */}
      <Dialog open={cardDetailsOpen} onOpenChange={setCardDetailsOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-purple-500/30 p-0 overflow-hidden">
          {selectedCard && (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[200px] py-6 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
                <TarotCard
                  card={selectedCard}
                  size="md"
                  isFlipped={true}
                  arcana={selectedCard.arcana}
                  suit={selectedCard.suit}
                  number={selectedCard.number}
                  isAnimated
                />
              </div>
              <div className="flex-1 p-6 max-h-[calc(80vh-240px)] md:max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1 arcane-text">
                      {selectedCard.name}
                    </h2>
                    <p className="text-purple-300/70 text-sm">
                      {selectedCard.arcana === "major" 
                        ? `Major Arcana • ${selectedCard.number}` 
                        : `${selectedCard.suit?.charAt(0).toUpperCase() + selectedCard.suit?.slice(1)} • ${selectedCard.number}`}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Info className="h-4 w-4 text-purple-400" />
                      Meaning
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {selectedCard.meaning}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-900/30 hover:text-white"
                      onClick={() => setCardDetailsOpen(false)}
                    >
                      <MoveHorizontal className="mr-2 h-4 w-4" />
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}