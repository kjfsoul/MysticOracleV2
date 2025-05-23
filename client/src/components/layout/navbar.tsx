import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  BookText,
  CreditCard,
  History,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: "Tarot", path: "/tarot", icon: "🔮", public: true },
    { name: "Zodiac Spread", path: "/zodiac-spread", icon: "🌟", public: true },
    { name: "Astrology", path: "/astrology", icon: "✨", public: true },
    { name: "Blog", path: "/blog", icon: "📚", public: true },
    { name: "Journal", path: "/journal", icon: "📓", public: false },
    { name: "Readings", path: "/readings", icon: "📜", public: false },
  ];

  return (
    <header className="bg-background border-b border-accent/20 fixed top-0 w-full z-50 h-16 shadow-md header-improved">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary border border-gold flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-gold"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-gold">
            Mystic Arcana
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(
            (link) =>
              (link.public || user) && (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`nav-link-improved flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                    location === link.path
                      ? "text-gold font-medium bg-primary/30"
                      : "text-white hover:text-gold hover:bg-primary/20"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span> {link.name}
                </Link>
              )
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!user && !isLoading && (
            <div className="hidden md:flex gap-2">
              <Link
                href="/auth?tab=login"
                className="flex items-center px-4 py-2 text-white bg-primary/30 hover:bg-primary/50 rounded-md transition-colors duration-300 nav-link-improved"
              >
                <User className="mr-2 h-4 w-4 text-gold" />
                Sign In
              </Link>
              <Link
                href="/auth?tab=register"
                className="flex items-center px-4 py-2 text-white border border-gold/50 hover:bg-gold/10 rounded-md transition-colors duration-300 nav-link-improved"
              >
                <User className="mr-2 h-4 w-4 text-gold" />
                Sign Up
              </Link>
            </div>
          )}
          <Link
            href="/settings?tab=subscription"
            className="hidden md:block px-4 py-2 border border-gold rounded-full text-gold hover:bg-gold/10 transition-colors duration-300 font-medium button-improved text-white"
          >
            Upgrade to Premium
          </Link>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 h-9 w-9 rounded-full overflow-hidden"
                >
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
              <DropdownMenuContent
                align="end"
                className="w-56 bg-background border-gold/20 shadow-xl"
              >
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-foreground">
                      {user.username}
                    </p>
                    <p className="w-full truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {[
                  { label: "Profile", icon: <User />, href: "/profile" },
                  {
                    label: "Reading History",
                    icon: <History />,
                    href: "/readings",
                  },
                  { label: "Journal", icon: <BookOpen />, href: "/journal" },
                  {
                    label: "Blog & Rituals",
                    icon: <BookText />,
                    href: "/blog",
                  },
                  { label: "Settings", icon: <Settings />, href: "/settings" },
                  {
                    label: "Premium Upgrade",
                    icon: <CreditCard />,
                    href: "/upgrade",
                  },
                ].map(({ label, icon, href }) => (
                  <DropdownMenuItem asChild key={href}>
                    <Link
                      href={href}
                      className="cursor-pointer flex items-center"
                    >
                      {React.cloneElement(icon, { className: "mr-2 h-4 w-4" })}
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Sign In link moved to the top section */}

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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-gold/20 py-4 px-4 animate-in slide-in-from-top-5 duration-200 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navLinks.map(
              (link) =>
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
            )}
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
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-red-500 hover:bg-red-500/10 mt-2 w-full text-left"
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            )}
            {!user && !isLoading && (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/auth?tab=login"
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-white bg-primary/30 hover:bg-primary/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-gold" />
                  Sign In
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-gold hover:bg-gold/10 border border-gold/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
