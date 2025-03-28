import { motion } from "framer-motion";
import { LuckRitual } from "@/data/luck-rituals";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

interface RitualCardProps {
  ritual: LuckRitual;
  featured?: boolean;
}

export default function RitualCard({ ritual, featured = false }: RitualCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card className={`overflow-hidden h-full border-gold/30 hover:border-gold/50 transition-all ${featured ? 'shadow-lg shadow-gold/10' : ''}`}>
        {/* Card Image */}
        <div className="relative">
          <img 
            src={ritual.imageUrl} 
            alt={ritual.title} 
            className="h-48 w-full object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={getCategoryColor(ritual.category)}>
              {ritual.category.charAt(0).toUpperCase() + ritual.category.slice(1)}
            </Badge>
          </div>
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gold/20 text-gold border-gold/40">
                Featured
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="pt-5">
          <h3 className="text-xl font-bold text-gold mb-1">{ritual.title}</h3>
          <p className="text-light/60 text-sm mb-3 line-clamp-2">{ritual.subtitle}</p>
          
          <div className="flex justify-between items-center text-xs text-light/70 mb-3">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{ritual.duration}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(ritual.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
          
          <p className="text-light/80 text-sm line-clamp-3">{ritual.description}</p>
        </CardContent>
        
        <CardFooter className="pt-0 pb-5">
          <Button 
            variant="outline" 
            className="w-full border-gold/50 text-gold hover:bg-gold/10 mt-2"
            asChild
          >
            <Link to={`/blog/rituals/${ritual.slug}`}>
              <span>Read More</span>
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}