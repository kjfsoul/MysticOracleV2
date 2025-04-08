import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/navbar';
import MobileNavigation from '@/components/layout/mobile-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TAROT_DECKS, getActiveDeck, setActiveDeck } from '@/config/tarot-deck-config';
import { validateDeck, getAllDeckInfo } from '@/utils/deck-manager';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Download, Upload } from 'lucide-react';

interface DeckStatus {
  deckId: string;
  isValid: boolean;
  missingCards: string[];
  totalCards: number;
  availableCards: number;
}

export default function DeckManagementPage() {
  const [activeTab, setActiveTab] = useState('decks');
  const [deckStatuses, setDeckStatuses] = useState<DeckStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDeckId, setActiveDeckId] = useState(getActiveDeck().id);

  useEffect(() => {
    async function loadDeckInfo() {
      try {
        const info = await getAllDeckInfo();
        setDeckStatuses(info);
      } catch (error) {
        console.error('Error loading deck info:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDeckInfo();
  }, []);

  const handleSetActiveDeck = (deckId: string) => {
    setActiveDeck(deckId);
    setActiveDeckId(deckId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-light">
            Tarot Deck Management
          </h1>
          <p className="text-light/80 max-w-2xl mx-auto">
            Manage your tarot decks, check for missing cards, and set your preferred deck.
          </p>
        </div>
        
        <Tabs defaultValue="decks" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="decks">Available Decks</TabsTrigger>
            <TabsTrigger value="upload">Upload New Deck</TabsTrigger>
          </TabsList>
          
          <TabsContent value="decks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <Card className="col-span-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                      <p className="text-light/80">Loading deck information...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                TAROT_DECKS.map((deck) => {
                  const status = deckStatuses.find(s => s.deckId === deck.id);
                  const completionPercentage = status 
                    ? Math.round((status.availableCards / status.totalCards) * 100) 
                    : 0;
                  
                  return (
                    <Card key={deck.id} className={activeDeckId === deck.id ? 'border-accent' : ''}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {deck.name}
                          {activeDeckId === deck.id && (
                            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>{deck.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-light/80">Completion</span>
                            <span className="text-sm text-light/80">
                              {status?.availableCards || 0}/{status?.totalCards || 78}
                            </span>
                          </div>
                          <Progress value={completionPercentage} className="h-2" />
                        </div>
                        
                        {status && status.missingCards.length > 0 && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Missing Cards</AlertTitle>
                            <AlertDescription>
                              {status.missingCards.length} cards are missing from this deck.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {status && status.missingCards.length === 0 && (
                          <Alert className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Complete Deck</AlertTitle>
                            <AlertDescription>
                              All cards are available for this deck.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/images/tarot/decks/${deck.id}`, '_blank')}
                        >
                          View Files
                        </Button>
                        
                        <Button 
                          variant={activeDeckId === deck.id ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleSetActiveDeck(deck.id)}
                          disabled={activeDeckId === deck.id}
                        >
                          {activeDeckId === deck.id ? 'Current Deck' : 'Set as Active'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Download Rider-Waite Deck</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-light/80">
                    You can download the Rider-Waite deck (public domain) using the script provided in the project.
                    Run the following command in your terminal:
                  </p>
                  
                  <div className="bg-dark/40 p-3 rounded-md font-mono text-sm mb-4">
                    npm run tarot:download-rider-waite
                  </div>
                  
                  <p className="text-light/80 text-sm">
                    This will download and optimize the Rider-Waite deck images to the correct directories.
                    Note that you may need to have ImageMagick installed for image resizing.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" leftIcon={<Download className="mr-2 h-4 w-4" />}>
                    Download Instructions
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Deck</CardTitle>
                <CardDescription>
                  Upload your own tarot deck images to use in the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-light/20 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-light/40" />
                  <h3 className="text-lg font-medium mb-2">Drag & Drop Deck Images</h3>
                  <p className="text-light/60 mb-4">
                    Upload a ZIP file containing your tarot deck images following the required directory structure.
                  </p>
                  <Button variant="outline" className="mx-auto">
                    Select ZIP File
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Required Structure</h3>
                  <p className="text-light/80 mb-2">
                    Your ZIP file should contain the following structure:
                  </p>
                  <div className="bg-dark/40 p-3 rounded-md font-mono text-sm mb-4">
                    <pre>{`your-deck-name/
├── major/
│   ├── 00-fool.jpg
│   ├── 01-magician.jpg
│   └── ...
└── minor/
    ├── cups/
    │   ├── ace-cups.jpg
    │   └── ...
    ├── wands/
    │   ├── ace-wands.jpg
    │   └── ...
    ├── swords/
    │   ├── ace-swords.jpg
    │   └── ...
    └── pentacles/
        ├── ace-pentacles.jpg
        └── ...`}</pre>
                  </div>
                  <p className="text-light/60 text-sm">
                    Note: This feature is not yet implemented. For now, please manually add your deck images to the appropriate directories.
                  </p>
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
