import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import MobileNavigation from '@/components/layout/mobile-navigation';
import PersonalizedCardInterpretation from '@/components/tarot/personalized-card-interpretation';

// List of tarot cards for the demo
const tarotCards = [
  { id: 'ace-of-cups', name: 'Ace of Cups', arcana: 'minor', suit: 'cups' },
  { id: 'two-of-cups', name: 'Two of Cups', arcana: 'minor', suit: 'cups' },
  { id: 'three-of-cups', name: 'Three of Cups', arcana: 'minor', suit: 'cups' },
  { id: 'four-of-cups', name: 'Four of Cups', arcana: 'minor', suit: 'cups' },
  { id: 'five-of-cups', name: 'Five of Cups', arcana: 'minor', suit: 'cups' },
  { id: 'the-fool', name: 'The Fool', arcana: 'major' },
  { id: 'the-magician', name: 'The Magician', arcana: 'major' },
  { id: 'the-high-priestess', name: 'The High Priestess', arcana: 'major' },
  { id: 'the-empress', name: 'The Empress', arcana: 'major' },
  { id: 'the-emperor', name: 'The Emperor', arcana: 'major' }
];

// List of moods for the demo
const moods = [
  'reflective', 'energetic', 'anxious', 'peaceful', 'curious', 
  'grateful', 'inspired', 'uncertain', 'hopeful', 'determined'
];

// List of spread types for the demo
const spreadTypes = [
  'Single Card', 'Three Card', 'Celtic Cross', 'Relationship', 'Career Path', 'Spiritual Growth'
];

// List of spread positions for the demo
const spreadPositions = [
  'Present', 'Past', 'Future', 'Challenge', 'Outcome', 'Advice'
];

export default function TarotInterpretationDemo() {
  const { user, isLoading } = useAuth();
  
  // Form state
  const [selectedCard, setSelectedCard] = useState('ace-of-cups');
  const [isReversed, setIsReversed] = useState(false);
  const [currentMood, setCurrentMood] = useState('reflective');
  const [spreadType, setSpreadType] = useState('Single Card');
  const [spreadPosition, setSpreadPosition] = useState('Present');
  const [question, setQuestion] = useState('');
  const [focusArea, setFocusArea] = useState('');
  
  // Display state
  const [showInterpretation, setShowInterpretation] = useState(false);
  
  const handleGenerateInterpretation = () => {
    setShowInterpretation(true);
  };
  
  const handleReset = () => {
    setShowInterpretation(false);
  };
  
  // If not authenticated, redirect to login
  if (!isLoading && !user) {
    return <Redirect to="/auth" />;
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-light">
            <span className="text-accent">Personalized</span> Tarot Interpretations
          </h1>
          <p className="text-light/80 max-w-2xl mx-auto">
            Experience deeply personalized tarot card interpretations tailored to your unique spiritual journey, current mood, and specific questions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                Interpretation Settings
              </CardTitle>
              <CardDescription>
                Customize your tarot reading experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="card-select">Select a Card</Label>
                  <Select value={selectedCard} onValueChange={setSelectedCard}>
                    <SelectTrigger className="bg-dark/60 border-light/20">
                      <SelectValue placeholder="Select a tarot card" />
                    </SelectTrigger>
                    <SelectContent>
                      {tarotCards.map(card => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reversed-switch">Reversed Card</Label>
                  <Switch
                    id="reversed-switch"
                    checked={isReversed}
                    onCheckedChange={setIsReversed}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mood-select">Current Mood</Label>
                  <Select value={currentMood} onValueChange={setCurrentMood}>
                    <SelectTrigger className="bg-dark/60 border-light/20">
                      <SelectValue placeholder="Select your current mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map(mood => (
                        <SelectItem key={mood} value={mood}>
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spread-type-select">Spread Type</Label>
                  <Select value={spreadType} onValueChange={setSpreadType}>
                    <SelectTrigger className="bg-dark/60 border-light/20">
                      <SelectValue placeholder="Select spread type" />
                    </SelectTrigger>
                    <SelectContent>
                      {spreadTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position-select">Card Position</Label>
                  <Select value={spreadPosition} onValueChange={setSpreadPosition}>
                    <SelectTrigger className="bg-dark/60 border-light/20">
                      <SelectValue placeholder="Select card position" />
                    </SelectTrigger>
                    <SelectContent>
                      {spreadPositions.map(position => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question-input">Your Question (Optional)</Label>
                  <Input
                    id="question-input"
                    placeholder="What would you like guidance on?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="bg-dark/60 border-light/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="focus-area-input">Focus Area (Optional)</Label>
                  <Input
                    id="focus-area-input"
                    placeholder="e.g., Relationships, Career, Spirituality"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="bg-dark/60 border-light/20"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-light/30 text-light hover:bg-light/10"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                className="bg-accent hover:bg-accent/80 text-dark"
                onClick={handleGenerateInterpretation}
              >
                Generate Interpretation
              </Button>
            </CardFooter>
          </Card>
          
          {/* Interpretation Display */}
          <div>
            {showInterpretation ? (
              <PersonalizedCardInterpretation
                cardId={selectedCard}
                isReversed={isReversed}
                spreadPosition={spreadPosition}
                spreadType={spreadType}
                question={question || undefined}
                focusArea={focusArea || undefined}
                currentMood={currentMood}
              />
            ) : (
              <Card className="border-gold/30 h-full flex flex-col justify-center items-center">
                <CardContent className="text-center py-12">
                  <Sparkles className="h-16 w-16 text-light/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-light mb-2">Your Personalized Reading</h3>
                  <p className="text-light/70 mb-6 max-w-md">
                    Configure your reading settings and click "Generate Interpretation" to receive a personalized tarot card interpretation.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
