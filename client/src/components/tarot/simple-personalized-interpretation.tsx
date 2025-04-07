import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw, BookOpen, Brain, Heart, Lightbulb, AlertTriangle, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface SimplePersonalizedInterpretationProps {
  cardId: string;
  cardName: string;
  isReversed?: boolean;
  spreadPosition?: string;
  spreadType?: string;
  question?: string;
  currentMood?: string;
  className?: string;
}

export default function SimplePersonalizedInterpretation({
  cardId,
  cardName,
  isReversed = false,
  spreadPosition,
  spreadType,
  question,
  currentMood,
  className = ''
}: SimplePersonalizedInterpretationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [interpretation, setInterpretation] = useState<any>(null);
  const [journalThemes, setJournalThemes] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadPersonalizedInterpretation();
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user, cardId, isReversed, currentMood]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('spiritual_profiles')
        .select('journal_themes')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.journal_themes) {
        const themes = data.journal_themes.map((theme: any) => theme.theme || '').filter(Boolean);
        setJournalThemes(themes.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadPersonalizedInterpretation = async () => {
    setIsLoading(true);
    
    try {
      // Get basic card data from the database or use defaults
      const { data: cardData } = await supabase
        .from('tarot_card_interpretations')
        .select('*')
        .eq('card_id', cardId)
        .single();
      
      // Generate a personalized interpretation
      const personalizedInterpretation = generateInterpretation(
        cardName,
        isReversed,
        cardData,
        currentMood
      );
      
      setInterpretation(personalizedInterpretation);
      
      // Store the interaction for future personalization
      if (user) {
        await supabase
          .from('user_interactions')
          .insert([{
            user_id: user.id,
            interaction_type: 'card_draw',
            data: {
              card_id: cardId,
              is_reversed: isReversed,
              spread_position: spreadPosition,
              spread_type: spreadType,
              question: question,
              current_mood: currentMood
            },
            created_at: new Date()
          }]);
      }
    } catch (error) {
      console.error('Error generating personalized interpretation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInterpretation = (
    cardName: string,
    isReversed: boolean,
    cardData: any,
    mood?: string
  ) => {
    // Default meanings if no card data is available
    const defaultUpright = "This card represents new beginnings, opportunities, and potential.";
    const defaultReversed = "This card suggests challenges, blockages, or a need to reassess your approach.";
    
    // Get the basic meaning from card data or use defaults
    const basicMeaning = isReversed 
      ? (cardData?.reversed_meaning || defaultReversed)
      : (cardData?.upright_meaning || defaultUpright);
    
    // Personalize based on mood
    let moodInsight = "";
    if (mood) {
      switch (mood) {
        case "reflective":
          moodInsight = `In your reflective state, this card invites you to contemplate how its energy connects to your inner journey.`;
          break;
        case "energetic":
          moodInsight = `Your energetic mood amplifies this card's message, suggesting action and forward momentum.`;
          break;
        case "anxious":
          moodInsight = `This card appears during your anxiety to remind you that challenges are temporary and growth is possible.`;
          break;
        case "peaceful":
          moodInsight = `Your peaceful state enhances your receptivity to this card's wisdom and subtle guidance.`;
          break;
        case "curious":
          moodInsight = `Your curiosity opens you to the deeper mysteries this card offers, inviting exploration.`;
          break;
        case "grateful":
          moodInsight = `From your place of gratitude, this card highlights the abundance and blessings in your situation.`;
          break;
        case "inspired":
          moodInsight = `Your inspired state resonates with this card's creative potential, amplifying possibilities.`;
          break;
        case "uncertain":
          moodInsight = `This card appears during your uncertainty to offer clarity and direction for your path forward.`;
          break;
        default:
          moodInsight = `This card's energy interacts with your current emotional state in meaningful ways.`;
      }
    }
    
    // Generate advice based on card and position
    let advice = "";
    if (spreadPosition) {
      switch (spreadPosition.toLowerCase()) {
        case "past":
          advice = `Reflect on how past experiences related to ${cardName} have shaped your current situation.`;
          break;
        case "present":
          advice = `Pay attention to how the energy of ${cardName} is manifesting in your life right now.`;
          break;
        case "future":
          advice = `Prepare for the upcoming influence of ${cardName} by aligning your actions with its energy.`;
          break;
        case "challenge":
          advice = `Address the challenges represented by ${cardName} by acknowledging their presence in your life.`;
          break;
        case "outcome":
          advice = `Work toward the potential outcome shown in ${cardName} by making conscious choices.`;
          break;
        default:
          advice = `Consider how the energy of ${cardName} relates to your question or situation.`;
      }
    } else {
      advice = `Take time to reflect on how the energy of ${cardName} is showing up in your life currently.`;
    }
    
    // Generate personal insight based on journal themes
    let personalInsight = "";
    if (journalThemes.length > 0) {
      personalInsight = `Your journaling about ${journalThemes.join(', ')} connects with ${cardName}'s energy, suggesting a deeper pattern in your spiritual journey.`;
    } else {
      personalInsight = `This card invites you to explore its themes through journaling to deepen your understanding.`;
    }
    
    // Generate challenge and opportunity
    const challenge = isReversed
      ? `You may find it challenging to fully embrace the reversed energy of ${cardName}. Be mindful of resistance or denial.`
      : `The energy of ${cardName} may challenge you to step outside your comfort zone and embrace new perspectives.`;
    
    const opportunity = isReversed
      ? `The reversed ${cardName} offers an opportunity to address blockages and transform limitations into growth.`
      : `${cardName} presents an opportunity to align with its positive energy and manifest its highest potential in your life.`;
    
    return {
      title: `${cardName} ${isReversed ? '(Reversed)' : ''} - Personal Reading`,
      summary: `${cardName} appears in your reading today${mood ? ` while you're feeling ${mood}` : ''}.`,
      detailedInterpretation: basicMeaning,
      personalInsight,
      advice,
      challenge,
      opportunity,
      moodInsight
    };
  };

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (!user) return;
    
    setFeedback(type);
    
    try {
      // Store the feedback
      await supabase
        .from('user_interactions')
        .insert([{
          user_id: user.id,
          interaction_type: 'interpretation_feedback',
          data: {
            card_id: cardId,
            is_reversed: isReversed,
            rating: type === 'positive' ? 5 : 1
          },
          created_at: new Date()
        }]);
      
      toast({
        title: 'Thank you!',
        description: 'Your feedback helps us personalize your experience.',
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const handleRefresh = () => {
    setFeedback(null);
    loadPersonalizedInterpretation();
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
          {interpretation.summary}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
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
              <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-4">
                <h3 className="text-md font-medium text-light mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  Interpretation
                </h3>
                <p className="text-light/80">
                  {interpretation.detailedInterpretation}
                </p>
              </div>
              
              {interpretation.moodInsight && (
                <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-4">
                  <h3 className="text-md font-medium text-light mb-2">
                    Emotional Context
                  </h3>
                  <p className="text-light/80">
                    {interpretation.moodInsight}
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
              
              {question && (
                <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-4">
                  <h3 className="text-md font-medium text-light mb-2">
                    Regarding Your Question
                  </h3>
                  <p className="text-light/80">
                    {`In relation to your question about ${question}, ${cardName} suggests focusing on its core energy and message.`}
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
