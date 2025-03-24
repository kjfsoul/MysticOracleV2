import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, XIcon, ArrowUpIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  
  // Show the banner after a delay for better UX
  useEffect(() => {
    // Check if banner was shown recently
    const lastShown = localStorage.getItem('subscription_banner_last_shown');
    const now = Date.now();
    let shouldShow = true;
    
    if (lastShown) {
      const timeSinceLastShown = now - parseInt(lastShown);
      const hourInMs = 60 * 60 * 1000;
      
      // Only show once every hour
      if (timeSinceLastShown < hourInMs) {
        shouldShow = false;
      }
    }
    
    // Show the banner after a longer delay for better user experience
    const timer = setTimeout(() => {
      // Only show if user hasn't dismissed it already and it wasn't shown recently
      const hasSeenBanner = localStorage.getItem('subscription_banner_seen');
      if (!hasSeenBanner && shouldShow) {
        setIsVisible(true);
      }
    }, 20000); // 20 seconds delay
    
    return () => clearTimeout(timer);
  }, []);
  
  // Save dismissal state to localStorage
  const handleDismiss = () => {
    // Store both seen status and last shown timestamp
    localStorage.setItem('subscription_banner_seen', 'true');
    localStorage.setItem('subscription_banner_last_shown', Date.now().toString());
    setIsDismissed(true);
    setIsVisible(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleUpgrade = () => {
    // Navigate to the settings page with subscription tab active
    window.location.href = '/settings?tab=subscription';
    
    // Show a toast notification
    toast({
      title: "Redirecting to Subscription",
      description: "You're being redirected to the subscription page.",
    });
  };
  
  if (isDismissed) return null;
  
  return (
    <div 
      className={`fixed md:bottom-6 left-4 right-4 bg-dark/90 backdrop-blur-md rounded-xl border border-accent/20 z-30 max-w-lg mx-auto shadow-lg shadow-dark/50 md:left-auto md:right-6 transition-all duration-300 ${
        isVisible 
          ? isMinimized 
            ? 'bottom-0 md:translate-y-[calc(100%-42px)]' 
            : 'bottom-16 md:bottom-6' 
          : 'translate-y-full'
      }`}
    >
      {/* Minimized header (always visible when minimized) */}
      {isMinimized && (
        <div 
          className="p-3 bg-dark/60 rounded-t-xl border-b border-accent/10 flex items-center justify-between cursor-pointer"
          onClick={toggleMinimize}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-accent" />
            <h4 className="font-heading text-sm font-medium text-accent">Premium Features Available</h4>
          </div>
          <ArrowUpIcon className="h-4 w-4 text-light/70" />
        </div>
      )}
      
      {/* Full banner content */}
      <div className={`p-4 ${isMinimized ? 'hidden' : 'block'}`}>
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-10 h-10 bg-dark/40 rounded-full flex items-center justify-center border border-accent/30">
            <SparklesIcon className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-medium text-accent">Unlock Premium Features</h4>
            <p className="text-light/80 text-sm">Get unlimited readings, AI insights, and personalized tarot and astrology interpretations</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="shrink-0 px-4 py-2 bg-accent/20 border border-accent/50 text-accent font-medium rounded-lg hover:bg-accent/30 transition-colors"
              onClick={handleUpgrade}
            >
              Upgrade
            </Button>
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="shrink-0 h-6 w-6 text-light/70 hover:text-light hover:bg-dark/40"
                onClick={toggleMinimize}
              >
                <ArrowUpIcon className="h-3 w-3" style={{ transform: 'rotate(180deg)' }} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="shrink-0 h-6 w-6 text-light/70 hover:text-light hover:bg-dark/40"
                onClick={handleDismiss}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
