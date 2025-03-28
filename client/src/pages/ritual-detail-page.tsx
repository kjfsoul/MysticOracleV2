import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { getRitualBySlug, getRitualsByCategory, LuckRitual } from "@/data/luck-rituals";
import RitualCard from "@/components/blog/ritual-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Flame,
  MoonIcon,
  Droplet,
  Wind,
  Leaf,
  ChevronLeft,
  Share2,
  Bookmark,
  Printer,
  ArrowUpRight,
  Plus,
  ListChecks
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RitualDetailPage() {
  const [, params] = useRoute("/blog/rituals/:slug");
  const [ritual, setRitual] = useState<LuckRitual | null>(null);
  const [relatedRituals, setRelatedRituals] = useState<LuckRitual[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (params?.slug) {
      const foundRitual = getRitualBySlug(params.slug);
      setRitual(foundRitual || null);
      
      // If we found a ritual, get related rituals from the same category
      if (foundRitual) {
        const related = getRitualsByCategory(foundRitual.category)
          .filter(r => r.id !== foundRitual.id)
          .slice(0, 3);
        setRelatedRituals(related);
      }
    }
  }, [params]);
  
  if (!ritual) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gold mb-4">Ritual Not Found</h1>
        <p className="text-light/70 mb-8">The ritual you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link to="/blog">Return to Blog</Link>
        </Button>
      </div>
    );
  }
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "prosperity": return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "love": return "bg-rose-500/10 text-rose-500 border-rose-500/30";
      case "protection": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/30";
      case "health": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "creativity": return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      default: return "bg-gold/10 text-gold border-gold/30";
    }
  };
  
  // Get element icon
  const getElementIcon = (element?: string) => {
    switch (element) {
      case "fire": return <Flame className="h-4 w-4" />;
      case "water": return <Droplet className="h-4 w-4" />;
      case "air": return <Wind className="h-4 w-4" />;
      case "earth": return <Leaf className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };
  
  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  // Handle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would save to user preferences in a real app
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/blog">
        <Button 
          variant="ghost" 
          className="text-light/70 hover:text-light mb-6 -ml-3 print:hidden"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Blog
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background/30 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-72 md:h-96 overflow-hidden">
              <img 
                src={ritual.imageUrl} 
                alt={ritual.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-background/90"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <Badge className={`${getCategoryColor(ritual.category)} mb-3`}>
                  {ritual.category.charAt(0).toUpperCase() + ritual.category.slice(1)}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{ritual.title}</h1>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Metadata */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1 text-gold/80">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{ritual.duration}</span>
                </div>
                
                <div className="flex items-center gap-1 text-light/70">
                  <ListChecks className="h-4 w-4" />
                  <span className="text-sm">{ritual.difficulty}</span>
                </div>
                
                {ritual.moonPhase && (
                  <div className="flex items-center gap-1 text-purple-400/90">
                    <MoonIcon className="h-4 w-4" />
                    <span className="text-sm">{ritual.moonPhase} moon</span>
                  </div>
                )}
                
                {ritual.element && (
                  <div className="flex items-center gap-1 text-light/70">
                    {getElementIcon(ritual.element)}
                    <span className="text-sm">{ritual.element}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-light/70">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{new Date(ritual.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              
              {/* Subtitle */}
              <h2 className="text-xl text-gold mb-6">{ritual.subtitle}</h2>
              
              {/* Description */}
              <div className="prose prose-invert max-w-none mb-8">
                {ritual.fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-light/80 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Materials */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gold mb-4">Materials Needed</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {ritual.materials.map((material, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gold mr-2">✦</span>
                      <span className="text-light/80">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Steps */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gold mb-4">Ritual Instructions</h3>
                <ol className="space-y-4">
                  {ritual.steps.map((step, index) => (
                    <li key={index} className="flex">
                      <span className="bg-gold/20 text-gold rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-light/80">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              
              {/* Video Section (if available) */}
              {ritual.videoUrl && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gold mb-4">Watch the Ritual</h3>
                  <div className="rounded-lg overflow-hidden aspect-video">
                    <iframe
                      src={ritual.videoUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 print:hidden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gold/30 text-gold hover:bg-gold/10"
                        onClick={toggleBookmark}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-gold' : ''}`} />
                        {isBookmarked ? 'Saved' : 'Save for Later'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {isBookmarked ? 'Remove from saved' : 'Save this ritual'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gold/30 text-gold hover:bg-gold/10"
                        onClick={handleCopyLink}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {copied ? 'Copied!' : 'Share'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Copy link to clipboard
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gold/30 text-gold hover:bg-gold/10"
                        onClick={handlePrint}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Print this ritual
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.article>
        </div>
        
        <div className="lg:col-span-1 print:hidden">
          {/* Sidebar */}
          <div className="space-y-8 sticky top-8">
            {/* Related Rituals */}
            <Card className="border-gold/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gold mb-4">Related Rituals</h3>
                <div className="space-y-4">
                  {relatedRituals.length > 0 ? (
                    relatedRituals.map(relatedRitual => (
                      <Link key={relatedRitual.id} to={`/blog/rituals/${relatedRitual.slug}`}>
                        <div className="flex gap-3 hover:bg-gold/5 p-2 rounded-lg transition-colors">
                          <img 
                            src={relatedRitual.imageUrl} 
                            alt={relatedRitual.title} 
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-medium text-gold">{relatedRitual.title}</h4>
                            <p className="text-xs text-light/70 truncate">{relatedRitual.subtitle}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-light/50 text-sm">No related rituals found</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Premium Upgrade */}
            <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-purple-900/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gold mb-2">Unlock Premium Rituals</h3>
                <p className="text-light/70 text-sm mb-4">
                  Gain access to exclusive rituals, video guides, and personalized magical insights with Mystic Arcana Premium.
                </p>
                <Button 
                  className="w-full bg-gold hover:bg-gold/80 text-background"
                  asChild
                >
                  <Link to="/settings?tab=subscription">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}