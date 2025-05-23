import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth-fixed";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Settings, CreditCard, BookOpen, History, BookText } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinks = [
    { name: "Tarot", path: "/tarot", icon: "🔮", public: true },
    { name: "Zodiac Spread", path: "/zodiac-spread", icon: "⭐", public: true },
    { name: "Astrology", path: "/astrology", icon: "✨", public: true },
    { name: "Blog", path: "/blog", icon: "📚", public: true },
    { name: "Journal", path: "/journal", icon: "📓", public: false },
    { name: "Readings", path: "/readings", icon: "📜", public: false },
  ];

  return (
    <header className="bg-background border-b border-accent/20 fixed top-0 w-full z-50 h-16 shadow-md">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary border border-gold flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gold">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-gold">Mystic Arcana</h1>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            // Only show public links or links when user is authenticated
            (link.public || user) && (
              <Link
                key={link.path}
                href={link.path}
                className={`text-foreground hover:text-gold transition-colors duration-300 flex items-center gap-1 ${
                  location === link.path ? "text-gold font-medium" : ""
                }`}
              >
                <span className="text-xl">{link.icon}</span> {link.name}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/settings?tab=subscription" className="hidden md:block px-4 py-2 border border-gold rounded-full text-gold hover:bg-gold/10 transition-colors duration-300 font-medium">
            Upgrade to Premium
          </Link>

          {/* User avatar */}
          {user && (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-9 w-9 rounded-full overflow-hidden">
                    <div className="w-9 h-9 rounded-full bg-primary border border-gold/50 flex items-center justify-center overflow-hidden">
                      {user.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user.username} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <User className="h-5 w-5 text-gold" />
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border-gold/20 shadow-xl">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-foreground">{user.username}</p>
                      <p className="w-full truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/readings" className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>Reading History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/journal" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Journal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/blog" className="cursor-pointer">
                      <BookText className="mr-2 h-4 w-4" />
                      <span>Blog & Rituals</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/upgrade" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Premium Upgrade</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile menu button */}
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden text-gold" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-gold/20 py-4 px-4 animate-in slide-in-from-top-5 duration-200 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              // Only show public links or links when user is authenticated
              (link.public || user) && (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                    location === link.path
                      ? "text-gold bg-gold/10 font-medium"
                      : "text-foreground hover:text-gold hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{link.icon}</span>
                  {link.name}
                </Link>
              )
            ))}

            {/* Only show these links if user is authenticated */}
            {user && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-foreground hover:text-gold hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-foreground hover:text-gold hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/upgrade"
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-gold hover:bg-gold/10 border border-gold/50 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CreditCard className="h-4 w-4" />
                  Upgrade to Premium
                </Link>
              </>
            )}

            {/* Show login button if user is not authenticated */}
            {!user && (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-2 py-2 rounded-md text-gold hover:bg-gold/10 border border-gold/50 mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Sign In / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}