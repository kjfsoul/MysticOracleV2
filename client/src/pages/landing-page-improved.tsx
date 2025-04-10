import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Stars, BookOpen, ScrollText, ArrowRight, Calendar, Egg } from 'lucide-react';
import DailyCardImproved from '@/components/tarot/daily-card-improved';
import { useAuth } from '@/hooks/use-auth';

// Spring & Easter themed content
const springFeaturedContent = {
  title: "The Fool's Journey: Spring Renewal",
  description:
    "Embrace new beginnings and spiritual growth with the energy of The Fool tarot card and the renewal of Spring.",
  image: "/images/content/fools-journey.jpg",
  category: "Seasonal Wisdom",
  slug: "fools-journey-spring-renewal",
};

const easterRitualContent = {
  title: "Sacred Egg Ritual for Rebirth",
  description:
    "A mystical Easter ritual using decorated eggs to symbolize rebirth, transformation, and new possibilities.",
  image: "/images/content/egg-ritual.jpg",
  price: "Free Guide",
};

export default function LandingPageImproved() {
  const [activeTab, setActiveTab] = useState('about');
  const { user } = useAuth();
  
  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Testimonials data
  const testimonials = [
    {
      name: 'Sarah K.',
      text: 'Mystic Arcana has transformed my spiritual practice. The daily tarot readings are incredibly accurate and have guided me through some challenging times.',
      avatar: '/images/testimonials/avatar-1.jpg',
    },
    {
      name: 'Michael T.',
      text: 'As a skeptic, I was surprised by how insightful the birth chart analysis was. The level of detail and accuracy made me a believer in astrology.',
      avatar: '/images/testimonials/avatar-2.jpg',
    },
    {
      name: 'Elena R.',
      text: 'The journal feature has helped me track my spiritual growth and see patterns in my life I never noticed before. Highly recommend the premium version!',
      avatar: '/images/testimonials/avatar-3.jpg',
    },
  ];
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl -z-10"></div>
          <div className="absolute inset-0 overflow-hidden rounded-2xl -z-20">
            <div className="stars opacity-30"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 px-6 rounded-2xl">
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="mb-4 bg-primary/20 text-gold border-gold/50 px-3 py-1">
                  <Sparkles className="mr-1 h-3 w-3" />
                  <span>Discover Your Cosmic Destiny</span>
                </Badge>
                
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gold">
                  Mystic Arcana
                </h1>
                
                <p className="text-light/80 text-lg md:text-xl mb-8 max-w-xl">
                  Unlock the ancient wisdom of tarot and astrology with personalized readings, 
                  daily guidance, and spiritual insights tailored to your unique journey.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/tarot">
                    <Button className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50 px-6 py-6 text-lg">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Your Reading
                    </Button>
                  </Link>
                  
                  <Link href="/astrology">
                    <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 px-6 py-6 text-lg">
                      <Stars className="mr-2 h-5 w-5" />
                      Explore Astrology
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md"
              >
                <DailyCardImproved 
                  onViewFullReading={() => window.location.href = '/tarot'}
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gold">
              Mystical Features
            </h2>
            <p className="text-light/80 max-w-2xl mx-auto">
              Explore our comprehensive suite of spiritual tools designed to guide you on your journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Tarot Readings',
                description: 'Personalized tarot readings with detailed interpretations for guidance on your life path.',
                icon: <Sparkles className="h-10 w-10 text-gold" />,
                link: '/tarot',
              },
              {
                title: 'Astrology Charts',
                description: 'Detailed birth charts, compatibility analysis, and daily horoscopes based on your unique cosmic blueprint.',
                icon: <Stars className="h-10 w-10 text-gold" />,
                link: '/astrology',
              },
              {
                title: 'Spiritual Journal',
                description: 'Track your spiritual growth, record insights, and discover patterns in your personal journey.',
                icon: <ScrollText className="h-10 w-10 text-gold" />,
                link: '/journal',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-primary-10 border-gold/30 h-full">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-gold text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-light/80">{feature.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={feature.link} className="w-full">
                      <Button variant="outline" className="w-full border-gold/50 text-gold">
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Seasonal Content Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-primary/20 text-gold border-gold/50 px-3 py-1">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Seasonal Wisdom</span>
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gold">
              Spring & Renewal
            </h2>
            <p className="text-light/80 max-w-2xl mx-auto">
              Embrace the energy of spring with special content and rituals for growth and transformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-primary-10 border-gold/30 overflow-hidden h-full">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/80 z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge className="bg-gold/20 text-gold border-gold/50">
                      {springFeaturedContent.category}
                    </Badge>
                  </div>
                  <div className="w-full h-full bg-primary/30 flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-gold/50" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-gold">{springFeaturedContent.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-light/80">{springFeaturedContent.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/blog/${springFeaturedContent.slug}`} className="w-full">
                    <Button className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50">
                      Read Article
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-primary-10 border-gold/30 overflow-hidden h-full">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/80 z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge className="bg-gold/20 text-gold border-gold/50">
                      {easterRitualContent.price}
                    </Badge>
                  </div>
                  <div className="w-full h-full bg-primary/30 flex items-center justify-center">
                    <Egg className="h-16 w-16 text-gold/50" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-gold">{easterRitualContent.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-light/80">{easterRitualContent.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href="/rituals/easter-egg" className="w-full">
                    <Button className="w-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50">
                      Get Free Guide
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gold">
              What Our Users Say
            </h2>
            <p className="text-light/80 max-w-2xl mx-auto">
              Join thousands of spiritual seekers who have found guidance and insight through Mystic Arcana
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-primary-10 border-gold/30 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/30 border border-gold/50 flex items-center justify-center overflow-hidden">
                        <Sparkles className="h-6 w-6 text-gold/70" />
                      </div>
                      <div>
                        <CardTitle className="text-gold text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>Verified User</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-light/80 italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="mb-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20 -z-10"></div>
            <div className="absolute inset-0 overflow-hidden -z-20">
              <div className="stars opacity-30"></div>
            </div>
            
            <div className="py-16 px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gold">
                  Begin Your Mystical Journey Today
                </h2>
                <p className="text-light/80 max-w-2xl mx-auto mb-8">
                  Unlock the wisdom of the stars and cards with personalized readings tailored to your unique spiritual path.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={user ? "/tarot" : "/auth?tab=register"}>
                    <Button className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50 px-6 py-6 text-lg">
                      <Sparkles className="mr-2 h-5 w-5" />
                      {user ? "Get Your Reading" : "Sign Up Free"}
                    </Button>
                  </Link>
                  
                  <Link href="/upgrade">
                    <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 px-6 py-6 text-lg">
                      <Stars className="mr-2 h-5 w-5" />
                      Explore Premium
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
