import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { analyzeJournalEntry, storeJournalEntry } from '@/lib/services/embedding-service';
import { Loader2, Save, Sparkles, Tag } from 'lucide-react';

interface JournalEntryProps {
  onSave?: (entryId: string) => void;
}

export default function JournalEntry({ onSave }: JournalEntryProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsAnalyzed(false);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: 'Empty entry',
        description: 'Please write something in your journal before analyzing.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeJournalEntry(content);
      setEmotions(analysis.emotions);
      setTags(analysis.tags);
      setIsAnalyzed(true);

      toast({
        title: 'Analysis complete',
        description: 'Your journal entry has been analyzed.',
      });
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Failed to analyze your journal entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to save your journal entry.',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: 'Empty entry',
        description: 'Please write something in your journal before saving.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      // If not analyzed yet, analyze first
      let currentEmotions = emotions;
      let currentTags = tags;

      if (!isAnalyzed) {
        const analysis = await analyzeJournalEntry(content);
        currentEmotions = analysis.emotions;
        currentTags = analysis.tags;
        setEmotions(currentEmotions);
        setTags(currentTags);
      }

      // Store the journal entry
      const entryId = await storeJournalEntry(
        user.id,
        title,
        content,
        currentEmotions,
        currentTags
      );

      if (!entryId) {
        throw new Error('Failed to save journal entry');
      }

      toast({
        title: 'Entry saved',
        description: 'Your journal entry has been saved successfully.',
      });

      // Clear the form
      setTitle('');
      setContent('');
      setEmotions([]);
      setTags([]);
      setIsAnalyzed(false);

      // Call the onSave callback if provided
      if (onSave) {
        onSave(entryId);
      }
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save your journal entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddEmotion = (emotion: string) => {
    if (!emotions.includes(emotion)) {
      setEmotions([...emotions, emotion]);
    }
  };

  const handleRemoveEmotion = (emotion: string) => {
    setEmotions(emotions.filter(e => e !== emotion));
  };

  return (
    <Card className="border-gold/30">
      <CardHeader>
        <CardTitle>Journal Entry</CardTitle>
        <CardDescription>
          Record your thoughts, feelings, and spiritual insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Entry Title (optional)"
              className="w-full p-2 rounded-md bg-dark/60 border border-light/20 text-light"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isAnalyzing || isSaving}
            />
          </div>
          <Textarea
            placeholder="Write your journal entry here..."
            className="min-h-[200px] bg-dark/60 border-light/20"
            value={content}
            onChange={handleContentChange}
            disabled={isAnalyzing || isSaving}
          />

          {isAnalyzed && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-gold" />
                  Emotions Detected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {emotions.length > 0 ? (
                    emotions.map(emotion => (
                      <Badge
                        key={emotion}
                        className="bg-primary/20 hover:bg-primary/30 text-light"
                        onClick={() => handleRemoveEmotion(emotion)}
                      >
                        {emotion} ×
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-light/60">No emotions detected. Try adding some manually.</p>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs text-light/60 mb-1">Add emotion:</p>
                  <div className="flex flex-wrap gap-1">
                    {['joy', 'sadness', 'anger', 'fear', 'surprise', 'trust', 'anticipation'].map(emotion => (
                      !emotions.includes(emotion) && (
                        <Badge
                          key={emotion}
                          variant="outline"
                          className="cursor-pointer border-light/20 hover:border-light/40"
                          onClick={() => handleAddEmotion(emotion)}
                        >
                          + {emotion}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-gold" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map(tag => (
                      <Badge
                        key={tag}
                        className="bg-accent/20 hover:bg-accent/30 text-light"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-light/60">No tags detected. Try adding some manually.</p>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs text-light/60 mb-1">Add tag:</p>
                  <div className="flex flex-wrap gap-1">
                    {['meditation', 'dream', 'intuition', 'spiritual', 'ritual', 'healing'].map(tag => (
                      !tags.includes(tag) && (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer border-light/20 hover:border-light/40"
                          onClick={() => handleAddTag(tag)}
                        >
                          + {tag}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="border-gold/50 text-gold"
          onClick={handleAnalyze}
          disabled={!content.trim() || isAnalyzing || isSaving}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
        <Button
          className="bg-gold hover:bg-gold/80 text-background"
          onClick={handleSave}
          disabled={!content.trim() || isAnalyzing || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Entry
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
