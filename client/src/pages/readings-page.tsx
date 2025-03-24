
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, History, Filter, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth-fixed";
import MobileNavigation from "@/components/layout/mobile-navigation";
import SubscriptionBanner from "@/components/layout/subscription-banner";

function ReadingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [readings, setReadings] = useState<any[]>([]);
  
  // Placeholder data
  React.useEffect(() => {
    const fetchReadings = async () => {
      setIsLoading(true);
      // Replace with actual API call
      setTimeout(() => {
        setReadings([
          {
            id: '1',
            cards: [{ name: 'The Fool', imageUrl: '/cards/fool.jpg' }],
            interpretation: 'New beginnings await you. The Fool represents the start of a journey and taking a leap of faith. Trust your instincts and embrace the unknown with an open heart.',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            cards: [{ name: 'The Empress', imageUrl: '/cards/empress.jpg' }],
            interpretation: 'A time of nurturing and abundance is upon you. The Empress represents fertility, growth, and creative energy. Connect with nature and your own creative potential.',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            cards: [{ name: 'The Tower', imageUrl: '/cards/tower.jpg' }],
            interpretation: 'Unexpected change and revelation are coming. The Tower represents sudden upheaval that clears the way for new growth. Though challenging, this change is necessary for your evolution.',
            createdAt: new Date(Date.now() - 172800000).toISOString()
          },
        ]);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchReadings();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground bg-gradient-to-b from-background to-background/95">
      <PageHeader title="Your Tarot Readings" subtitle="Explore your past readings and revisit the cards' wisdom" />
      
      <main className="container mx-auto px-4 pt-20 pb-24 md:pb-16 md:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light/50" />
              <Input 
                placeholder="Search readings..." 
                className="pl-10 bg-dark/60 border-light/10"
              />
            </div>
            <Button variant="outline" className="bg-dark/60 border-light/10">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          {/* Readings list */}
          {isLoading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : readings && readings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {readings.map((reading) => (
                <Card key={reading.id} className="bg-dark/60 backdrop-blur-sm border-light/10 overflow-hidden hover:border-accent/30 transition-all cursor-pointer">
                  <div className="h-36 overflow-hidden">
                    {reading.cards[0]?.imageUrl && (
                      <img 
                        src={reading.cards[0].imageUrl} 
                        alt={reading.cards[0].name} 
                        className="w-full h-full object-cover opacity-70" 
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-accent">{reading.cards[0]?.name || "Tarot Reading"}</CardTitle>
                    <CardDescription className="text-light/70">
                      {new Date(reading.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-light/80 text-sm line-clamp-3">
                      {reading.interpretation.substring(0, 100)}...
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="text-accent p-0">
                      View Full Reading
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-dark/40 backdrop-blur-sm rounded-lg border border-light/10">
              <h3 className="font-heading text-xl font-semibold mb-2 text-accent">No Readings Found</h3>
              <p className="text-light/70 mb-6">You haven't performed any tarot readings yet.</p>
              <Button className="bg-accent hover:bg-accent/80 text-dark">Get Your First Reading</Button>
            </div>
          )}
        </div>
      </main>

      <MobileNavigation />
      <SubscriptionBanner />
    </div>
  );
}

export default ReadingsPage;
