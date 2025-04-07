import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw, BookOpen, Brain, Heart, Lightbulb, AlertTriangle, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPersonalizedCardInterpretation, rateInterpretation } from '@/lib/services/tarot-interpretation-service';
import { PersonalizedInterpretation } from '@/lib/models/tarot-interpretation';
import TarotCard from './tarot-card';

interface PersonalizedCardInterpretationProps {
  cardId: string;
  isReversed?: boolean;
  spreadPosition?: string;
  spreadType?: string;
  question?: string;
  focusArea?: string;
  otherCards?: string[];
  currentMood?: string;
  className?: string;
}

export default function PersonalizedCardInterpretation({
  cardId,
  isReversed = false,
  spreadPosition,
  spreadType,
  question,
  focusArea,
  otherCards,
  currentMood,
  className = ''
}: PersonalizedCardInterpretationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [interpretation, setInterpretation] = useState<PersonalizedInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadPersonalizedInterpretation();
    } else {
      setIsLoading(false);
    }
  }, [user, cardId, isReversed, spreadPosition, spreadType, question, focusArea, currentMood]);

  const loadPersonalizedInterpretation = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const personalizedInterpretation = await getPersonalizedCardInterpretation(
        cardId,
        {
          isReversed,
          spreadPosition,
          spreadType,
          question,
          focusArea,
          otherCards,
          currentMood,
          timeOfDay: getTimeOfDay(),
          date: new Date()
        },
        user.id
      );
      
      setInterpretation(personalizedInterpretation);
    } catch (error) {
      console.error('Error loading personalized interpretation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load personalized interpretation.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (!user || !interpretation) return;
    
    setFeedback(type);
    
    try {
      // Rate the interpretation
      await rateInterpretation(
        user.id,
        interpretation.cardId, // Using cardId as a proxy for interpretationId
        type === 'positive' ? 5 : 1,
        type === 'positive' ? 'Helpful interpretation' : 'Not helpful'
      );
      
      toast({
        title: 'Thank you!',
        description: 'Your feedback helps us personalize your experience.',
      });
    } catch (error) {
      console.error('Error rating interpretation:', error);
    }
  };

  const handleRefresh = () => {
    setFeedback(null);
    loadPersonalizedInterpretation();
  };

  // Helper function to get the current time of day
  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };

  // If not authenticated, show a sign-in prompt
  if (!user) {
    return (
      <Card className={`border-accent/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Personalized Card Reading
          </CardTitle>
          <CardDescription>
            Sign in to receive personalized tarot interpretations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-light/80 text-sm">
            Create an account to unlock personalized tarot readings tailored to your unique spiritual journey.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-accent hover:bg-accent/80 text-dark"
            onClick={() => window.location.href = '/auth'}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className={`border-accent/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Personalizing Your Reading...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-accent/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-accent/20 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-accent/20 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No interpretation found
  if (!interpretation) {
    return (
      <Card className={`border-accent/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Card Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-light/80 text-center py-4">
            We couldn't find an interpretation for this card. Please try again later.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-accent hover:bg-accent/80 text-dark"
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Content loaded
  return (
    <Card className={`border-accent/30 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            {interpretation.title}
          </CardTitle>
          {currentMood && (
            <Badge variant="outline" className="bg-accent/10 text-accent text-xs">
              {currentMood}
            </Badge>
          )}
        </div>
        <CardDescription>
          {interpretation.cardName} {interpretation.isReversed ? '(Reversed)' : ''}
          {spreadPosition && ` • ${spreadPosition} Position`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Card Display */}
          <div className="flex justify-center md:w-1/3">
            <TarotCard
              cardName={interpretation.cardName}
              imageUrl={interpretation.suggestedImageUrl || `/images/tarot/${cardId}.jpg`}
              isFlipped={true}
              isAnimated={false}
              size="lg"
              isReversed={interpretation.isReversed}
            />
          </div>
          
          {/* Interpretation Content */}
          <div className="md:w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-dark/40 border border-light/10 mb-4">
                <TabsTrigger value="overview" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="personal" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                  <Heart className="h-4 w-4 mr-1" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="guidance" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                  <Compass className="h-4 w-4 mr-1" />
                  Guidance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-4">
                  <p className="text-light/90 text-lg">
                    {interpretation.summary}
                  </p>
                  
                  <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-4">
                    <h3 className="text-md font-medium text-light mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-accent" />
                      Interpretation
                    </h3>
                    <p className="text-light/80">
                      {interpretation.detailedInterpretation}
                    </p>
                  </div>
                  
                  {interpretation.relationToQuestion && (
                    <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-4">
                      <h3 className="text-md font-medium text-light mb-2">
                        Regarding Your Question
                      </h3>
                      <p className="text-light/80">
                        {interpretation.relationToQuestion}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="personal" className="mt-0">
                <div className="space-y-4">
                  <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-4">
                    <h3 className="text-md font-medium text-light mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-accent" />
                      Personal Insight
                    </h3>
                    <p className="text-light/80">
                      {interpretation.personalInsight}
                    </p>
                  </div>
                  
                  {interpretation.relationToOtherCards && (
                    <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-4">
                      <h3 className="text-md font-medium text-light mb-2">
                        Connection to Your Journey
                      </h3>
                      <p className="text-light/80">
                        {interpretation.relationToOtherCards}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="guidance" className="mt-0">
                <div className="space-y-4">
                  <div className="bg-primary/20 border border-primary/30 rounded-lg p-4">
                    <h3 className="text-md font-medium text-light mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      Advice
                    </h3>
                    <p className="text-light/90">
                      {interpretation.advice}
                    </p>
                  </div>
                  
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h3 className="text-md font-medium text-light mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      Challenge
                    </h3>
                    <p className="text-light/80">
                      {interpretation.challenge}
                    </p>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h3 className="text-md font-medium text-light mb-2 flex items-center gap-2">
                      <Compass className="h-4 w-4 text-green-400" />
                      Opportunity
                    </h3>
                    <p className="text-light/80">
                      {interpretation.opportunity}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-light/10 mt-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${feedback === 'positive' ? 'bg-green-500/20 text-green-300' : 'text-light/60 hover:text-light/80'}`}
              onClick={() => handleFeedback('positive')}
              disabled={feedback !== null}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${feedback === 'negative' ? 'bg-red-500/20 text-red-300' : 'text-light/60 hover:text-light/80'}`}
              onClick={() => handleFeedback('negative')}
              disabled={feedback !== null}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Not Helpful
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-light/60 hover:text-light/80"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
