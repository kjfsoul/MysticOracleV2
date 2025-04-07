import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import { getPersonalizedContent, trackUserInteraction, PersonalizedContent } from '@/lib/services/agent-learning-service';
import { useToast } from '@/hooks/use-toast';

interface PersonalizedContentProps {
  contentType?: 'tarot_reading' | 'journal_prompt' | 'astrology_insight' | 'ritual_suggestion';
  currentPage: string;
  currentTheme?: string;
  currentMood?: string;
  className?: string;
}

export default function PersonalizedContentComponent({
  contentType = 'tarot_reading',
  currentPage,
  currentTheme = 'spring',
  currentMood,
  className = ''
}: PersonalizedContentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<PersonalizedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  useEffect(() => {
    if (user) {
      loadPersonalizedContent();
    } else {
      setIsLoading(false);
    }
  }, [user, contentType, currentPage, currentMood]);

  const loadPersonalizedContent = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Track the page view
      await trackUserInteraction({
        userId: user.id,
        interactionType: 'page_view',
        data: {
          page: currentPage,
          theme: currentTheme,
          mood: currentMood
        },
        timestamp: new Date()
      });
      
      // Get personalized content
      const personalizedContent = await getPersonalizedContent({
        userId: user.id,
        currentPage,
        currentTheme,
        currentMood,
        seasonalContext: getSeason(),
        lunarPhase: getLunarPhase()
      });
      
      setContent(personalizedContent);
    } catch (error) {
      console.error('Error loading personalized content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load personalized content.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (!user || !content) return;
    
    setFeedback(type);
    
    try {
      // Track the feedback
      await trackUserInteraction({
        userId: user.id,
        interactionType: 'reading_feedback',
        data: {
          contentType: content.contentType,
          rating: type === 'positive' ? 5 : 1,
          content: content.content
        },
        timestamp: new Date()
      });
      
      toast({
        title: 'Thank you!',
        description: 'Your feedback helps us personalize your experience.',
      });
    } catch (error) {
      console.error('Error tracking feedback:', error);
    }
  };

  const handleRefresh = () => {
    setFeedback(null);
    loadPersonalizedContent();
  };

  // Helper function to get the current season
  const getSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  // Helper function to get the lunar phase (simplified)
  const getLunarPhase = (): string => {
    const date = new Date();
    const day = date.getDate();
    
    // Very simplified lunar phase calculation
    if (day < 7) return 'New Moon';
    if (day < 14) return 'Waxing';
    if (day < 21) return 'Full Moon';
    return 'Waning';
  };

  // If not authenticated, show a sign-in prompt
  if (!user) {
    return (
      <Card className={`border-accent/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Personalized Insights
          </CardTitle>
          <CardDescription>
            Sign in to receive personalized mystical guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-light/80 text-sm">
            Create an account to unlock personalized readings, journal prompts, and spiritual insights tailored to your unique journey.
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
            Personalizing...
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

  // Content loaded
  return (
    <Card className={`border-accent/30 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            {content?.contentType === 'tarot_reading' && 'Personalized Reading'}
            {content?.contentType === 'journal_prompt' && 'Journal Prompt'}
            {content?.contentType === 'astrology_insight' && 'Astrology Insight'}
            {content?.contentType === 'ritual_suggestion' && 'Ritual Suggestion'}
          </CardTitle>
          <Badge variant="outline" className="bg-accent/10 text-accent text-xs">
            {currentMood || 'Personalized'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <p className="text-light/90">
          {content?.content || 'Your personalized content will appear here.'}
        </p>
        
        {content?.relatedThemes && content.relatedThemes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {content.relatedThemes.map((theme, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {theme}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1">
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
