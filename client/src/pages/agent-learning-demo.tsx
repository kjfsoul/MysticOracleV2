import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Brain, Sparkles, User, Settings, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import MobileNavigation from '@/components/layout/mobile-navigation';
import PersonalizedContentComponent from '@/components/personalization/personalized-content';
import { trackUserInteraction } from '@/lib/services/agent-learning-service';
import { supabase } from '@/lib/supabaseClient';

export default function AgentLearningDemo() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('demo');
  const [currentMood, setCurrentMood] = useState('reflective');
  const [journalContent, setJournalContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spiritualProfile, setSpiritualProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      loadSpiritualProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, [user]);

  const loadSpiritualProfile = async () => {
    if (!user) return;
    
    setIsLoadingProfile(true);
    
    try {
      const { data, error } = await supabase
        .from('spiritual_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setSpiritualProfile(data || {
        user_id: user.id,
        mood_trend: [],
        journal_themes: [],
        draw_history: [],
        preferred_spreads: []
      });
    } catch (error) {
      console.error('Error loading spiritual profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load spiritual profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to submit a journal entry.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!journalContent.trim()) {
      toast({
        title: 'Empty entry',
        description: 'Please write something in your journal before submitting.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Track the journal entry
      await trackUserInteraction({
        userId: user.id,
        interactionType: 'journal_entry',
        data: {
          content: journalContent,
          emotions: [currentMood],
          tags: extractTags(journalContent)
        },
        timestamp: new Date()
      });
      
      toast({
        title: 'Journal entry submitted',
        description: 'Your journal entry has been saved and analyzed.',
      });
      
      // Clear the form
      setJournalContent('');
      
      // Reload the spiritual profile
      await loadSpiritualProfile();
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit journal entry.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract tags from journal content
  const extractTags = (content: string): string[] => {
    const tags: string[] = [];
    const keywords = [
      'meditation', 'mindfulness', 'spiritual', 'energy', 'chakra', 'aura',
      'universe', 'cosmic', 'divine', 'sacred', 'ritual', 'practice',
      'intuition', 'guidance', 'vision', 'dream', 'manifestation', 'intention',
      'gratitude', 'blessing', 'prayer', 'healing', 'transformation', 'journey'
    ];
    
    const contentLower = content.toLowerCase();
    
    for (const keyword of keywords) {
      if (contentLower.includes(keyword) && !tags.includes(keyword)) {
        tags.push(keyword);
      }
    }
    
    return tags;
  };

  // If not authenticated, redirect to login
  if (!isLoading && !user) {
    return <Redirect to="/auth" />;
  }

  // Loading state
  if (isLoading || isLoadingProfile) {
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
            <span className="text-accent">Agent Learning</span> System
          </h1>
          <p className="text-light/80 max-w-2xl mx-auto">
            Experience the Mystic Arcana continuous learning and personalization system. Your interactions help the system learn and adapt to your spiritual journey.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-dark/40 border border-light/10">
              <TabsTrigger value="demo" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                <Sparkles className="h-4 w-4 mr-2" />
                Demo
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                <User className="h-4 w-4 mr-2" />
                Spiritual Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="demo" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="border-gold/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-gold" />
                      Agent Learning Demo
                    </CardTitle>
                    <CardDescription>
                      Interact with the system to see how it learns and adapts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleJournalSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-light">Current Mood</label>
                        <Select value={currentMood} onValueChange={setCurrentMood}>
                          <SelectTrigger className="bg-dark/60 border-light/20">
                            <SelectValue placeholder="Select your current mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reflective">Reflective</SelectItem>
                            <SelectItem value="energetic">Energetic</SelectItem>
                            <SelectItem value="anxious">Anxious</SelectItem>
                            <SelectItem value="peaceful">Peaceful</SelectItem>
                            <SelectItem value="curious">Curious</SelectItem>
                            <SelectItem value="grateful">Grateful</SelectItem>
                            <SelectItem value="inspired">Inspired</SelectItem>
                            <SelectItem value="uncertain">Uncertain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-light">Journal Entry</label>
                        <Textarea
                          placeholder="Write about your spiritual journey, thoughts, or feelings..."
                          className="min-h-[150px] bg-dark/60 border-light/20"
                          value={journalContent}
                          onChange={(e) => setJournalContent(e.target.value)}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-light/60">
                          Your entry will be analyzed to update your spiritual profile.
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/80 text-dark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Submit Journal Entry'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <PersonalizedContentComponent
                  contentType="tarot_reading"
                  currentPage="tarot"
                  currentTheme="spring"
                  currentMood={currentMood}
                />
                
                <PersonalizedContentComponent
                  contentType="journal_prompt"
                  currentPage="journal"
                  currentTheme="spring"
                  currentMood={currentMood}
                />
                
                <PersonalizedContentComponent
                  contentType="ritual_suggestion"
                  currentPage="rituals"
                  currentTheme="spring"
                  currentMood={currentMood}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            <Card className="border-gold/30">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gold" />
                    Your Spiritual Profile
                  </CardTitle>
                  <CardDescription>
                    Your personalized spiritual profile based on your interactions
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-light/30 text-light hover:bg-light/10"
                  onClick={loadSpiritualProfile}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-light mb-2">Mood Trends</h3>
                    <div className="flex flex-wrap gap-2">
                      {spiritualProfile?.mood_trend && spiritualProfile.mood_trend.length > 0 ? (
                        spiritualProfile.mood_trend.map((mood: string, index: number) => (
                          <Badge
                            key={index}
                            className={`
                              ${index === 0 ? 'bg-accent/30 text-accent' : 'bg-primary/20 text-light/80'}
                            `}
                          >
                            {mood}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-light/60">No mood data available yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-light mb-2">Journal Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {spiritualProfile?.journal_themes && spiritualProfile.journal_themes.length > 0 ? (
                        spiritualProfile.journal_themes.map((theme: any, index: number) => (
                          <Badge
                            key={index}
                            className={`
                              ${index < 3 ? 'bg-green-500/20 text-green-300' : 'bg-primary/20 text-light/80'}
                            `}
                          >
                            {theme.theme}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-light/60">No journal themes available yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-light mb-2">Tarot History</h3>
                    <div className="flex flex-wrap gap-2">
                      {spiritualProfile?.draw_history && spiritualProfile.draw_history.length > 0 ? (
                        spiritualProfile.draw_history.slice(0, 5).map((draw: any, index: number) => (
                          <Badge
                            key={index}
                            className="bg-primary/20 text-light/80"
                          >
                            {draw.cardId}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-light/60">No tarot history available yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-light mb-2">Preferred Spreads</h3>
                    <div className="flex flex-wrap gap-2">
                      {spiritualProfile?.preferred_spreads && spiritualProfile.preferred_spreads.length > 0 ? (
                        spiritualProfile.preferred_spreads.map((spread: string, index: number) => (
                          <Badge
                            key={index}
                            className="bg-primary/20 text-light/80"
                          >
                            {spread}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-light/60">No preferred spreads available yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Card className="border-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gold" />
                  Personalization Settings
                </CardTitle>
                <CardDescription>
                  Customize how the system learns and adapts to your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-light">Visual Theme</label>
                    <Select defaultValue={spiritualProfile?.visual_theme || 'cosmic'}>
                      <SelectTrigger className="bg-dark/60 border-light/20">
                        <SelectValue placeholder="Select visual theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cosmic">Cosmic</SelectItem>
                        <SelectItem value="earthy">Earthy</SelectItem>
                        <SelectItem value="fiery">Fiery</SelectItem>
                        <SelectItem value="watery">Watery</SelectItem>
                        <SelectItem value="airy">Airy</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-light">Reading Tone</label>
                    <Select defaultValue={spiritualProfile?.reading_tone || 'supportive'}>
                      <SelectTrigger className="bg-dark/60 border-light/20">
                        <SelectValue placeholder="Select reading tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supportive">Supportive</SelectItem>
                        <SelectItem value="direct">Direct</SelectItem>
                        <SelectItem value="mystical">Mystical</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                        <SelectItem value="philosophical">Philosophical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-light">Data Collection</label>
                    <div className="flex items-center justify-between">
                      <span className="text-light/80">Journal Analysis</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-light/80">Tarot History</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-light/80">Usage Patterns</span>
                      <input type="checkbox" defaultChecked className="toggle toggle-accent" />
                    </div>
                    <p className="text-xs text-light/60">
                      These settings control what data is used to personalize your experience.
                    </p>
                  </div>
                  
                  <Button className="w-full bg-accent hover:bg-accent/80 text-dark">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
