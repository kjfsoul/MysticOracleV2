import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Stars } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { FeatureCard } from '../components/ui/feature-card';

// Icon components
const TarotIcon = () => <BookOpen className="h-8 w-8 text-purple-300" />;
const AstrologyIcon = () => <Stars className="h-8 w-8 text-blue-300" />;
const GuidanceIcon = () => <Sparkles className="h-8 w-8 text-gold" />;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900" />
      
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
      </motion.div>
    </div>
  );
}
