import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LuckRitual } from "@/data/luck-rituals";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Link as LinkIcon, Share2 } from "lucide-react";
import { Link } from "wouter";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RitualVideoSpotlightProps {
  ritual: LuckRitual;
  autoplay?: boolean;
}

export default function RitualVideoSpotlight({ ritual, autoplay = false }: RitualVideoSpotlightProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    const url = `${window.location.origin}/blog/rituals/${ritual.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Demo function to simulate progress - in a real implementation, this would use the YouTube iframe API
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Get YouTube ID from URL for thumbnail (simplified demo version)
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\\&\\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = ritual.videoUrl ? getYouTubeId(ritual.videoUrl) : null;
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : ritual.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl overflow-hidden bg-background/70 backdrop-blur-md relative h-[400px] md:h-[500px] lg:h-[600px]"
    >
      {/* Video Container */}
      <div className="w-full h-full relative">
        {ritual.videoUrl ? (
          <iframe
            ref={videoRef}
            src={`${ritual.videoUrl}?autoplay=${autoplay ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <img src={ritual.imageUrl} alt={ritual.title} className="max-h-full max-w-full object-contain" />
          </div>
        )}
        
        {/* Overlay for title and actions */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-center pointer-events-auto">
            <div>
              <Badge className="bg-gold/10 text-gold border-gold/30 mb-1">Featured Ritual</Badge>
              <h2 className="text-lg md:text-xl font-bold text-white">{ritual.title}</h2>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white/90 hover:text-white hover:bg-white/10 h-8 w-8" onClick={handleCopyLink}>
                      {copied ? <LinkIcon className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {copied ? "Link copied!" : "Copy link"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white/90 hover:text-white hover:bg-white/10 h-8 w-8"
                      asChild
                    >
                      <Link to={`/blog/rituals/${ritual.slug}`}>
                        <LinkIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    View full article
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Video controls */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end pointer-events-auto">
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
              <div 
                className="h-full bg-gold rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/90 hover:text-white hover:bg-white/10"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/90 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white/90 hover:text-white hover:bg-white/10"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Caption */}
      <Card className="mt-4 border-gold/30">
        <CardContent className="p-4">
          <p className="text-light/80 text-sm">{ritual.description}</p>
          <div className="flex justify-end mt-2">
            <Button 
              variant="outline" 
              className="border-gold/50 text-gold hover:bg-gold/10"
              size="sm"
              asChild
            >
              <Link to={`/blog/rituals/${ritual.slug}`}>
                Read Full Article
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}