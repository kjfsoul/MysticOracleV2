
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, BookOpen, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-fixed";
import MobileNavigation from "@/components/layout/mobile-navigation";
import SubscriptionBanner from "@/components/layout/subscription-banner";

export default function JournalPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState("");
  
  // Placeholder data
  React.useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      // Replace with actual API call
      setTimeout(() => {
        setEntries([
          {
            id: '1',
            content: 'Today I drew The Fool in my reading. I feel inspired to start my new project without fear. The cards reminded me to trust the journey.',
            date: new Date().toISOString()
          },
          {
            id: '2',
            content: 'My dreams have been vivid lately. Last night I saw a tower crumbling, which reminded me of my reading from last week. Perhaps it\'s a sign that I need to let go of old structures in my life.',
            date: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            content: 'I meditated with the High Priestess card today. I felt a deep connection to my intuition and received clarity on a decision I\'ve been struggling with.',
            date: new Date(Date.now() - 172800000).toISOString()
          },
        ]);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchEntries();
  }, []);

  const handleSave = () => {
    if (!newEntry.trim()) return;
    
    const entry = {
      id: Date.now().toString(),
      content: newEntry,
      date: new Date().toISOString()
    };
    
    setEntries([entry, ...entries]);
    setNewEntry("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-gradient-to-b from-background to-background/95">
      <PageHeader title="Mystical Journal" subtitle="Document your spiritual journey and insights" />
      
      <main className="container mx-auto px-4 pt-20 pb-24 md:pb-16 md:pt-24">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="write" className="data-[state=active]:bg-accent/20">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </TabsTrigger>
              <TabsTrigger value="read" className="data-[state=active]:bg-accent/20">
                <BookOpen className="h-4 w-4 mr-2" />
                Past Entries
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="write" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="bg-dark/40 backdrop-blur-sm rounded-lg border border-light/10 p-6">
                <h2 className="text-xl font-semibold text-accent mb-4">Create New Journal Entry</h2>
                <Textarea 
                  placeholder="Record your thoughts, dreams, and mystical experiences..." 
                  className="min-h-[200px] bg-dark/60 border-light/10 mb-4"
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                />
                <Button 
                  className="bg-accent hover:bg-accent/80 text-dark"
                  onClick={handleSave}
                  disabled={!newEntry.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="read" className="focus-visible:outline-none focus-visible:ring-0">
              {isLoading ? (
                <div className="flex justify-center my-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="bg-dark/40 backdrop-blur-sm border-light/10 hover:border-accent/30 transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-light/70">
                          {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-light/90">{entry.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-dark/40 backdrop-blur-sm rounded-lg border border-light/10">
                  <h3 className="font-heading text-xl font-semibold mb-2 text-accent">No Journal Entries</h3>
                  <p className="text-light/70 mb-6">Start documenting your mystical journey by creating your first entry.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNavigation />
      <SubscriptionBanner />
    </div>
  );
}
