import { useState, useEffect } from 'react';
import { Button } from '@client/components/ui/button';
import { toast } from '@client/components/ui/toast';
import { X, Settings, Check } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Cookie preference states
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: true,
    marketing: false,
    personalization: true
  });
  
  // Show the banner if cookies haven't been accepted yet
  useEffect(() => {
    // Check if cookie preferences were already set
    const cookiePreferences = localStorage.getItem('cookie_preferences');
    
    if (!cookiePreferences) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // 1.5 seconds delay
      
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookiePreferences);
        setPreferences(prev => ({
          ...prev,
          ...savedPreferences
        }));
      } catch (e) {
        console.error('Error parsing cookie preferences', e);
      }
    }
  }, []);
  
  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    // Save preferences to localStorage
    localStorage.setItem('cookie_preferences', JSON.stringify(allAccepted));
    localStorage.setItem('cookie_banner_last_shown', Date.now().toString());
    
    setPreferences(allAccepted);
    setIsDismissed(true);
    setIsVisible(false);
    
    toast({
      title: "Cookies accepted",
      description: "Your cookie preferences have been saved.",
    });
  };
  
  const handleSavePreferences = () => {
    // Save current preferences to localStorage
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    localStorage.setItem('cookie_banner_last_shown', Date.now().toString());
    
    setIsDismissed(true);
    setIsVisible(false);
    
    toast({
      title: "Preferences saved",
      description: "Your cookie preferences have been saved.",
    });
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };
  
  const handlePreferenceChange = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Cannot change necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  if (isDismissed || !isVisible) return null;
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-start justify-between">
          <div className={`flex-1 ${isMinimized ? 'hidden' : ''}`}>
            <h3 className="text-lg font-semibold mb-2">Cookie Preferences</h3>
            
            {!showPreferences ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                  Read our <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a> to learn more.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" onClick={handleAcceptAll}>
                    <Check className="h-4 w-4 mr-2" />
                    Accept All
                  </Button>
                  <Button variant="outline" onClick={togglePreferences}>
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Select which cookies you want to accept. Necessary cookies help make the website usable and cannot be disabled.
                </p>
                
                <div className="space-y-3 mb-4">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cookie-${key}`}
                        checked={value}
                        onChange={() => handlePreferenceChange(key as keyof typeof preferences)}
                        disabled={key === 'necessary'}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor={`cookie-${key}`} className="text-sm capitalize">
                        {key} {key === 'necessary' && '(Required)'}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" onClick={handleSavePreferences}>
                    Save Preferences
                  </Button>
                  <Button variant="outline" onClick={togglePreferences}>
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMinimize}
              aria-label={isMinimized ? "Expand cookie banner" : "Minimize cookie banner"}
            >
              {isMinimized ? (
                <Settings className="h-4 w-4" />
              ) : (
                <span className="h-4 w-4">—</span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsDismissed(true);
                setIsVisible(false);
              }}
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isMinimized && (
          <div className="flex items-center justify-between">
            <p className="text-sm">Cookie settings for Mystic Arcana</p>
            <Button variant="default" size="sm" onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}