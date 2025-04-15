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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body relative overflow-hidden">
      {/* Cosmic Background */}
      <EnhancedCosmicBackground density="medium" colorScheme="purple" />
      
      {/* Hero Section */}
      <motion.div
        className="relative z-10 container mx-auto max-w-5xl px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Badge variant="outline" className="mb-4 bg-primary/20 text-gold">
          <Sparkles className="mr-1 h-3 w-3" />
          <span>Discover Your Cosmic Destiny</span>
        </Badge>

        <h1 className="font-heading text-5xl lg:text-6xl font-bold mb-6 text-gold">
          Mystic Arcana
        </h1>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            title="Tarot Readings"
            icon={<TarotIcon />}
            description="Interactive personalized readings"
          />
          <FeatureCard
            title="Astrology Charts"
            icon={<AstrologyIcon />}
            description="Detailed birth chart analysis"
          />
          <FeatureCard
            title="Daily Guidance"
            icon={<GuidanceIcon />}
            description="Personalized daily insights"
          />
        </div>

        {/* Daily Card Preview */}
        <DailyCardImproved className="mt-16" />
      </motion.div>
    </div>
  );
}
