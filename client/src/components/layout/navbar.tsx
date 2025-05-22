import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  BookText,
  History,
  LogOut,
  Menu as MenuIcon,
  Settings,
  User
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "wouter";

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
    { name: "Astrology", path: "/astrology", icon: "✨", public: true },
    { name: "Blog", path: "/blog", icon: "📚", public: true },
    { name: "Journal", path: "/journal", icon: "📓", public: false },
    { name: "Readings", path: "/readings", icon: "📜", public: false },
  ];

  return (
    <header className="fixed top-0 w-full bg-background border-b border-accent/20 z-50 h-16 shadow-md">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
{/* Logo removed */}
          <span className="font-heading text-2xl text-gold">
            Mystic Arcana
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(
            (link) =>
              (link.public || user) && (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                    location === link.path
                      ? "text-gold font-medium bg-primary/30"
                      : "text-white hover:text-gold hover:bg-primary/20"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              )
          )}
        </nav>

        {/* Social Icons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Social icons removed */}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {!user && !isLoading && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/auth?tab=login"
                className="flex items-center gap-2 px-4 py-2 text-white bg-primary/30 hover:bg-primary/50 rounded-md transition-colors"
              >
                <User className="h-4 w-4 text-gold" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth?tab=register"
                className="flex items-center gap-2 px-4 py-2 text-white border border-gold/50 hover:bg-gold/10 rounded-md transition-colors"
              >
                <User className="h-4 w-4 text-gold" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gold" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={4}
                className="w-48 bg-background border border-gold/20 shadow-xl space-y-2 py-2"
              >
                <div className="px-4 py-2">
                  <p className="font-medium text-foreground">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {[
                  { label: "Profile", icon: <User />, href: "/profile" },
                  { label: "History", icon: <History />, href: "/readings" },
                  { label: "Journal", icon: <BookOpen />, href: "/journal" },
                  { label: "Blog", icon: <BookText />, href: "/blog" },
                  { label: "Settings", icon: <Settings />, href: "/settings" },
                ].map(({ label, icon, href }) => (
                  <DropdownMenuItem asChild key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10"
                    >
                      {React.cloneElement(icon, { className: "h-4 w-4" })}
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-gold/20 py-4 px-4 animate-in slide-in-from-top duration-200 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navLinks.map(
              (link) =>
                (link.public || user) && (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      location === link.path
                        ? "bg-primary/30 text-gold"
                        : "text-foreground hover:text-gold hover:bg-primary/10"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                )
            )}
            {!user && !isLoading && (
              <>
                <Link
                  href="/auth?tab=login"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/30 text-white hover:bg-primary/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-gold" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-gold text-gold hover:bg-gold/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
