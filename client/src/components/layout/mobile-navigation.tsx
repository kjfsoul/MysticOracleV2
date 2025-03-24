import { Link, useLocation } from "wouter";
import { Home, Sparkles, MoonStar, History, User, BookOpen, BookMarked, Star } from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Tarot", path: "/tarot", icon: MoonStar },
    { name: "Zodiac Spread", path: "/zodiac-spread", icon: Star },
    { name: "Astrology", path: "/astrology", icon: Sparkles },
    { name: "Blog", path: "/blog", icon: BookMarked },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t border-gold/20 md:hidden z-40 h-16 print:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center justify-center ${
                location === item.path 
                  ? "text-gold" 
                  : "text-foreground hover:text-gold transition-colors"
              }`}
            >
              <Icon className={`h-5 w-5 ${location === item.path ? "text-gold" : ""}`} />
              <span className={`text-xs mt-1 ${location === item.path ? "font-medium" : ""}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
