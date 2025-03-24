import { useAuth } from "@/hooks/use-auth-fixed";
import Navbar from "@/components/layout/navbar-fixed";
import MobileNavigation from "@/components/layout/mobile-navigation";
import SubscriptionBanner from "@/components/layout/subscription-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, History, BookOpen, Share2 } from "lucide-react";
import { TarotReading } from "@shared/schema";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: readings, isLoading } = useQuery<TarotReading[]>({
    queryKey: ["/api/tarot-readings"],
    onError: (error) => {
      toast({
        title: "Error loading readings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-dark bg-[radial-gradient(circle_at_10%_20%,rgba(74,33,116,0.2)_0%,rgba(26,26,74,0.1)_80%)]" 
         style={{
           backgroundImage: `
             radial-gradient(circle at 10% 20%, rgba(74, 33, 116, 0.2) 0%, rgba(26, 26, 74, 0.1) 80%),
             url('https://images.unsplash.com/photo-1518818608552-195ed130cda4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')
           `,
           backgroundBlendMode: 'overlay',
           backgroundAttachment: 'fixed',
           backgroundSize: 'cover'
         }}>
      <Navbar />

      <main className="container mx-auto px-4 pt-20 pb-24 md:pb-16 md:pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2 text-accent bg-gradient-to-r from-[#D4AF37] to-[#F5E1A4] bg-clip-text text-transparent">
              Welcome, {user?.username}
            </h1>
            <p className="text-light/80 max-w-2xl mx-auto">
              Your mystical journey continues. Explore your cosmic connections through tarot and astrology.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/tarot">
              <Card className="bg-primary/30 backdrop-blur-sm border-primary/50 hover:border-accent/50 hover:bg-primary/40 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-accent">Tarot Reading</CardTitle>
                  <CardDescription className="text-light/70">
                    Connect with your spiritual guides
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-16 h-16 bg-dark/40 rounded-full flex items-center justify-center border border-accent/50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-accent">
                      <path d="M12 22v-9" />
                      <path d="m15.4 10.7 1.1-11.3 1.3 3.2 2.7-2.1-.7 4.7 2.9 1.8-2.1 2 2.2 3-4.6-.3-.6 4-2.6-2-2.6 2-.6-4-4.6.3 2.2-3-2.1-2 2.9-1.8-.7-4.7 2.7 2.1 1.3-3.2 1.1 11.3" />
                    </svg>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <span className="text-sm text-light/80">Start a new reading</span>
                </CardFooter>
              </Card>
            </Link>

            <Link href="/astrology">
              <Card className="bg-primary/30 backdrop-blur-sm border-primary/50 hover:border-accent/50 hover:bg-primary/40 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-accent">Astrology Chart</CardTitle>
                  <CardDescription className="text-light/70">
                    Discover your celestial blueprint
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-16 h-16 bg-dark/40 rounded-full flex items-center justify-center border border-accent/50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-accent">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <span className="text-sm text-light/80">Explore cosmic insights</span>
                </CardFooter>
              </Card>
            </Link>

            <Card className="bg-primary/30 backdrop-blur-sm border-primary/50 hover:border-accent/50 hover:bg-primary/40 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-accent">Journal</CardTitle>
                <CardDescription className="text-light/70">
                  Record your mystical journey
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-16 h-16 bg-dark/40 rounded-full flex items-center justify-center border border-accent/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-accent">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                    <path d="M12 11v6" />
                    <path d="M9 14h6" />
                  </svg>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <span className="text-sm text-light/80">Record your mystical journey</span>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Readings */}
          <div className="mb-10">
            <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Your Recent Readings</h2>

            {isLoading ? (
              <div className="flex justify-center my-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : readings && readings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {readings.slice(0, 3).map((reading) => (
                  <Card key={reading.id} className="bg-dark/60 backdrop-blur-sm border-light/10 overflow-hidden">
                    <div className="h-36 overflow-hidden">
                      {(reading.cards as any)[0]?.imageUrl && (
                        <img 
                          src={(reading.cards as any)[0].imageUrl} 
                          alt={(reading.cards as any)[0].name} 
                          className="w-full h-full object-cover opacity-70" 
                        />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-accent">{(reading.cards as any)[0]?.name || "Tarot Reading"}</CardTitle>
                      <CardDescription className="text-light/70">
                        {new Date(reading.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-light/80 text-sm line-clamp-3">
                        {reading.interpretation.substring(0, 100)}...
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" className="border-light/20 text-light/70 hover:text-accent hover:border-accent">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="border-light/20 text-light/70 hover:text-accent hover:border-accent">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-dark/40 backdrop-blur-sm border-light/10 p-8 text-center">
                <CardContent>
                  <p className="text-light/70 mb-4">You haven't done any readings yet</p>
                  <Link href="/tarot">
                    <Button className="bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30">
                      Get Your First Reading
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {readings && readings.length > 3 && (
              <div className="flex justify-center mt-6">
                <Button variant="link" className="text-accent">
                  <History className="h-4 w-4 mr-2" />
                  View All Readings
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNavigation />
      <SubscriptionBanner />
    </div>
  );
}