import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import CardOfTheDay from "@/components/tarot/card-of-the-day";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Stars, Wand2, ScrollText } from "lucide-react";
import { Link } from "wouter";

// Mock featured content until the real shop and blog components are ready
const featuredRitual = {
  title: "New Moon Manifestation Ritual",
  description: "Harness the power of the new moon to set intentions and manifest your dreams.",
  image: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  category: "Rituals",
  slug: "new-moon-manifestation-ritual"
};

const featuredProduct = {
  title: "Crystal Intention Setting Kit",
  description: "A collection of premium crystals to amplify your intentions and spiritual practice.",
  image: "https://images.unsplash.com/photo-1523293915678-d126868e96c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  price: "$29.99"
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("about");

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
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#D4AF37] to-[#F5E1A4] bg-clip-text text-transparent"
            >
              Mystic Arcana
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-light/80 text-xl max-w-2xl mx-auto mb-8"
            >
              Unlock the mysteries of the universe through tarot, astrology, and cosmic wisdom
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/auth">
                <Button size="lg" className="bg-accent hover:bg-accent/80 text-dark">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/tarot">
                <Button size="lg" variant="outline" className="border-light/30 text-light hover:bg-light/10">
                  Try Free Reading
                </Button>
              </Link>
              <Link href="/astrology">
                <Button size="lg" variant="outline" className="border-light/30 text-light hover:bg-light/10">
                  Daily Horoscope
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Card of the Day Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-semibold mb-6 text-center text-light">
            Today's <span className="text-accent">Mystical Insight</span>
          </h2>
          <CardOfTheDay />
        </section>
        
        {/* Features Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-semibold mb-8 text-center text-light">
            Explore Our <span className="text-accent">Mystical Services</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-accent">Tarot Readings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light/80">Gain insights through personalized tarot readings with different spreads for various life situations.</p>
              </CardContent>
              <CardFooter>
                <Link href="/tarot">
                  <Button variant="link" className="text-accent p-0">Try Free Reading →</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Stars className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-accent">Astrology Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light/80">Discover your cosmic blueprint with birth charts, compatibility insights, and daily horoscopes.</p>
              </CardContent>
              <CardFooter>
                <Link href="/astrology">
                  <Button variant="link" className="text-accent p-0">View Daily Horoscope →</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-accent">Mystical Shop</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light/80">Browse our collection of crystals, tarot decks, and spiritual tools to enhance your practice.</p>
              </CardContent>
              <CardFooter>
                <Link href="/shop">
                  <Button variant="link" className="text-accent p-0">Visit Shop →</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        {/* Featured Content Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-semibold mb-8 text-center text-light">
            Featured <span className="text-accent">Content</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Featured Blog Post */}
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src={featuredRitual.image} 
                  alt={featuredRitual.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 bg-accent/80 text-dark px-2 py-1 rounded text-sm font-medium">
                  {featuredRitual.category}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-accent" />
                  <CardDescription className="text-light/70">Featured Blog Post</CardDescription>
                </div>
                <CardTitle className="text-xl text-light">{featuredRitual.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light/80 line-clamp-2">{featuredRitual.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/rituals/${featuredRitual.slug}`}>
                  <Button variant="outline" className="border-light/30 text-light hover:bg-light/10">
                    Read Article
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Featured Shop Item */}
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src={featuredProduct.image} 
                  alt={featuredProduct.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-primary/80 text-dark px-2 py-1 rounded text-sm font-medium">
                  {featuredProduct.price}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <CardDescription className="text-light/70">Featured Product</CardDescription>
                </div>
                <CardTitle className="text-xl text-light">{featuredProduct.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-light/80 line-clamp-2">{featuredProduct.description}</p>
              </CardContent>
              <CardFooter>
                <Link href="/shop">
                  <Button variant="outline" className="border-light/30 text-light hover:bg-light/10">
                    Shop Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-semibold mb-8 text-center text-light">
            What Our <span className="text-accent">Community Says</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                    JD
                  </div>
                  <div>
                    <h4 className="font-medium text-light">Jane Doe</h4>
                    <p className="text-xs text-light/60">Mystic Explorer</p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-light/80 text-sm italic">
                "The tarot readings have been incredibly accurate and insightful. I've gained clarity on several life decisions thanks to Mystic Arcana."
              </p>
            </div>
            
            <div className="bg-dark/40 backdrop-blur-sm border border-light/10 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
                    MS
                  </div>
                  <div>
                    <h4 className="font-medium text-light">Michael Smith</h4>
                    <p className="text-xs text-light/60">Astrology Enthusiast</p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-light/80 text-sm italic">
                "The birth chart analysis was spot on! It helped me understand patterns in my life that I've struggled with for years. Highly recommended!"
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/30 to-secondary/30 backdrop-blur-sm rounded-xl border border-accent/20 p-8">
            <h2 className="font-heading text-3xl font-bold mb-4 text-light">
              Begin Your Mystical Journey Today
            </h2>
            <p className="text-light/80 mb-6 max-w-xl mx-auto">
              Sign up now to unlock premium features, save your readings, and receive personalized cosmic guidance tailored just for you.
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-accent hover:bg-accent/80 text-dark">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <MobileNavigation />
    </div>
  );
}