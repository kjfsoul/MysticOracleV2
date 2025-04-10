import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, BookOpen, HelpCircle, ArrowRight, Calendar } from 'lucide-react';
import DailyCardImproved from '@/components/tarot/daily-card-improved';
import TarotSpread from '@/components/tarot/tarot-spread';
import { TarotCard, allTarotCards } from '@/data/tarot-cards';
import { getDailyCard } from '@/utils/tarot-utils';

// Define spread types
type SpreadType = 'daily' | 'three-card' | 'celtic-cross' | 'horseshoe';

export default function TarotPageImproved() {
  const [activeTab, setActiveTab] = useState<string>('daily');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('three-card');
  const [userQuestion, setUserQuestion] = useState('');
  const [isGeneratingReading, setIsGeneratingReading] = useState(false);
  const [showReadingResult, setShowReadingResult] = useState(false);
  const [spreadCards, setSpreadCards] = useState<(TarotCard & { isReversed?: boolean })[]>([]);
  
  const { toast } = useToast();
  const readingResultRef = useRef<HTMLDivElement>(null);
  
  // Get spread information
  const getSpreadInfo = (spread: SpreadType) => {
    switch (spread) {
      case 'daily':
        return {
          title: 'Daily Card',
          description: 'A single card drawn each day to provide guidance and insight for the day ahead.',
          cardCount: 1,
        };
      case 'three-card':
        return {
          title: 'Past-Present-Future',
          description: 'A three-card spread that reveals influences from your past, your current situation, and potential future outcomes.',
          cardCount: 3,
        };
      case 'celtic-cross':
        return {
          title: 'Celtic Cross',
          description: 'A comprehensive ten-card spread that explores your situation in depth, including challenges, influences, hopes, fears, and potential outcomes.',
          cardCount: 10,
        };
      case 'horseshoe':
        return {
          title: 'Horseshoe Spread',
          description: 'A seven-card spread in the shape of a horseshoe that provides insight into your past, present, and future, as well as obstacles and advice.',
          cardCount: 7,
        };
      default:
        return {
          title: '',
          description: '',
          cardCount: 0,
        };
    }
  };
  
  // Generate a tarot reading
  const generateReading = async () => {
    setIsGeneratingReading(true);
    
    try {
      // Show loading toast
      toast({
        title: 'Generating your reading...',
        description: 'The cards are aligning to reveal their wisdom.',
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random cards for the spread
      const cardCount = getSpreadInfo(selectedSpread).cardCount;
      const selectedCards: (TarotCard & { isReversed?: boolean })[] = [];
      
      // Create a copy of all cards to draw from
      const availableCards = [...allTarotCards];
      
      for (let i = 0; i < cardCount; i++) {
        // Get a random index
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        
        // Get the card and remove it from available cards
        const card = availableCards.splice(randomIndex, 1)[0];
        
        // Determine if card is reversed (25% chance)
        const isReversed = Math.random() < 0.25;
        
        // Add to selected cards
        selectedCards.push({
          ...card,
          isReversed,
        });
      }
      
      // Set the cards for the spread
      setSpreadCards(selectedCards);
      
      // Show success toast
      toast({
        title: 'Reading generated',
        description: 'Your tarot reading is ready to be revealed.',
      });
      
      // Show the reading result
      setShowReadingResult(true);
      
      // Scroll to the reading result
      setTimeout(() => {
        if (readingResultRef.current) {
          readingResultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating reading:', error);
      
      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to generate your reading. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingReading(false);
    }
  };
  
  // Handle new reading
  const handleNewReading = () => {
    setShowReadingResult(false);
    setUserQuestion('');
    setSpreadCards([]);
  };
  
  // Get today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-gold">
              Mystic Tarot
            </h1>
            <p className="text-light/80 max-w-2xl mx-auto">
              Discover insights and guidance through the ancient wisdom of tarot cards.
              Each spread offers a unique perspective on your past, present, and future.
            </p>
          </div>
          
          {/* Tarot tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-8"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="daily" className="text-sm md:text-base">
                Daily Card
              </TabsTrigger>
              <TabsTrigger value="readings" className="text-sm md:text-base">
                Tarot Readings
              </TabsTrigger>
              <TabsTrigger value="learn" className="text-sm md:text-base">
                Learn Tarot
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm md:text-base">
                Reading History
              </TabsTrigger>
            </TabsList>
            
            {/* Daily Card Tab */}
            <TabsContent value="daily" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Card className="bg-primary-10 border-gold/30 h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gold">Your Daily Tarot</CardTitle>
                        <Badge variant="outline" className="bg-primary/20 text-gold border-gold/50">
                          <Calendar className="mr-2 h-4 w-4" />
                          {today}
                        </Badge>
                      </div>
                      <CardDescription>
                        A single card drawn each day to provide guidance and insight
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <DailyCardImproved />
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="bg-primary-10 border-gold/30 h-full">
                    <CardHeader>
                      <CardTitle className="text-gold">Daily Tarot Wisdom</CardTitle>
                      <CardDescription>
                        Understanding the energy of today's card
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gold mb-2">Reflection Questions</h3>
                        <ul className="space-y-2 text-light/80">
                          <li className="flex gap-2">
                            <span className="text-gold">•</span>
                            <span>How does today's card reflect your current situation?</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-gold">•</span>
                            <span>What aspects of this card's energy can you embrace today?</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-gold">•</span>
                            <span>What message might the universe be sending you through this card?</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gold mb-2">Journal Prompt</h3>
                        <p className="text-light/80">
                          Take a few minutes to write about how the energy of today's card might 
                          influence your actions, decisions, and interactions throughout the day.
                        </p>
                      </div>
                      
                      <div className="bg-primary/20 p-4 rounded-lg border border-gold/20">
                        <h3 className="text-sm font-medium text-gold mb-2">Did You Know?</h3>
                        <p className="text-xs text-light/70">
                          The practice of drawing a daily tarot card dates back centuries and is 
                          known as the "Card of the Day" practice. It's a simple yet powerful way 
                          to develop your intuition and create a mindful moment of reflection each day.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                        onClick={() => setActiveTab('readings')}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get a Full Reading
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Tarot Readings Tab */}
            <TabsContent value="readings" className="space-y-8">
              <AnimatePresence mode="wait">
                {!showReadingResult ? (
                  <motion.div
                    key="reading-selection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-primary-10 border-gold/30">
                      <CardHeader>
                        <CardTitle className="text-gold">Choose Your Tarot Spread</CardTitle>
                        <CardDescription>
                          Select a spread type that best suits your question or situation
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Spread selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(['three-card', 'celtic-cross', 'horseshoe'] as SpreadType[]).map((spread) => {
                            const { title, description, cardCount } = getSpreadInfo(spread);
                            return (
                              <Card 
                                key={spread}
                                className={`cursor-pointer transition-all hover:border-gold/50 ${
                                  selectedSpread === spread 
                                    ? 'bg-primary/30 border-gold/50' 
                                    : 'bg-primary/10 border-primary/20'
                                }`}
                                onClick={() => setSelectedSpread(spread)}
                              >
                                <CardHeader className="pb-2">
                                  <CardTitle className={`text-lg ${selectedSpread === spread ? 'text-gold' : 'text-light'}`}>
                                    {title}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-xs text-light/70 mb-2">{description}</p>
                                  <Badge variant="outline" className="bg-primary/20 text-light/80">
                                    {cardCount} cards
                                  </Badge>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        
                        {/* Question input */}
                        <div className="space-y-2">
                          <label htmlFor="question" className="block text-gold font-medium">
                            Your Question <span className="text-light/50 text-sm">(optional)</span>
                          </label>
                          <textarea
                            id="question"
                            className="w-full bg-primary/20 border border-primary/30 rounded-lg p-3 text-light focus:border-gold/50 focus:ring-1 focus:ring-gold/30 focus:outline-none resize-none"
                            placeholder="What would you like guidance on today?"
                            rows={3}
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                          />
                          <p className="text-xs text-light/50">
                            For the most accurate reading, be clear and specific about what you want to know.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                          onClick={generateReading}
                          disabled={isGeneratingReading}
                        >
                          {isGeneratingReading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2"></div>
                              Generating Reading...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate Reading
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reading-result"
                    ref={readingResultRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Card className="bg-primary-10 border-gold/30">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-gold">
                            {getSpreadInfo(selectedSpread).title} Reading
                          </CardTitle>
                          <Badge variant="outline" className="bg-primary/20 text-gold border-gold/50">
                            {today}
                          </Badge>
                        </div>
                        {userQuestion && (
                          <CardDescription>
                            Your question: <span className="italic">"{userQuestion}"</span>
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <TarotSpread
                          cards={spreadCards}
                          spreadType={selectedSpread === 'three-card' ? 'three-card' : selectedSpread === 'celtic-cross' ? 'celtic-cross' : 'horseshoe'}
                          title={getSpreadInfo(selectedSpread).title}
                          description={userQuestion ? `Based on your question: "${userQuestion}"` : 'Tap on any card to view its detailed meaning'}
                        />
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-4">
                        <Button
                          variant="outline"
                          className="border-gold/50 text-gold sm:flex-1"
                          onClick={handleNewReading}
                        >
                          New Reading
                        </Button>
                        <Button
                          className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50 sm:flex-1"
                        >
                          Save Reading
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
            
            {/* Learn Tarot Tab */}
            <TabsContent value="learn" className="space-y-8">
              <Card className="bg-primary-10 border-gold/30">
                <CardHeader>
                  <CardTitle className="text-gold">Learn Tarot</CardTitle>
                  <CardDescription>
                    Explore the rich symbolism and meanings of the tarot cards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-primary/20 border-primary/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gold">Major Arcana</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-light/80 text-sm mb-4">
                          The 22 Major Arcana cards represent significant life events and spiritual lessons.
                        </p>
                        <Link href="/tarot-cards?filter=major">
                          <Button variant="outline" className="w-full border-gold/50 text-gold">
                            Explore Major Arcana
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-primary/20 border-primary/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gold">Minor Arcana</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-light/80 text-sm mb-4">
                          The 56 Minor Arcana cards reflect everyday situations and challenges.
                        </p>
                        <Link href="/tarot-cards?filter=minor">
                          <Button variant="outline" className="w-full border-gold/50 text-gold">
                            Explore Minor Arcana
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-primary/30 rounded-lg p-6 border border-gold/20">
                    <h3 className="text-xl font-heading text-gold mb-4">Tarot Reading Basics</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium text-gold mb-1">Card Orientation</h4>
                        <p className="text-light/80 text-sm">
                          Cards can appear upright or reversed, each with different meanings.
                          Reversed cards often indicate blocked or internalized energy.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-gold mb-1">Card Combinations</h4>
                        <p className="text-light/80 text-sm">
                          The meaning of a card is influenced by the cards around it.
                          Look for patterns and relationships between cards in a spread.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-gold mb-1">Intuition</h4>
                        <p className="text-light/80 text-sm">
                          Trust your intuition when interpreting cards. Your personal
                          connection to the imagery is just as important as traditional meanings.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/tarot-cards" className="w-full">
                    <Button className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View All 78 Tarot Cards
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Reading History Tab */}
            <TabsContent value="history" className="space-y-8">
              <Card className="bg-primary-10 border-gold/30">
                <CardHeader>
                  <CardTitle className="text-gold">Your Reading History</CardTitle>
                  <CardDescription>
                    View and revisit your past tarot readings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 text-gold/70" />
                    </div>
                    <h3 className="text-xl font-medium text-gold mb-2">No Readings Yet</h3>
                    <p className="text-light/70 max-w-md mb-6">
                      Your reading history will appear here once you've completed your first reading.
                      Readings are saved automatically for registered users.
                    </p>
                    <Button 
                      className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                      onClick={() => setActiveTab('readings')}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Your First Reading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
