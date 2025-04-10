import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
  History,
  BookOpen,
  BookText,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function NavbarImproved() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logout, isLoading } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation links
  const mainNavLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Tarot', path: '/tarot', icon: '🔮' },
    { name: 'Astrology', path: '/astrology', icon: '✨' },
    { name: 'Journal', path: '/journal', icon: '📓', requiresAuth: true },
    { name: 'Blog', path: '/blog', icon: '📚' },
  ];

  // Dropdown menus
  const tarotDropdown = [
    { name: 'Daily Card', path: '/tarot' },
    { name: 'Card Library', path: '/tarot-cards' },
    { name: 'Spreads', path: '/tarot?tab=readings' },
    { name: 'Reading History', path: '/readings', requiresAuth: true },
  ];

  const astrologyDropdown = [
    { name: 'Birth Chart', path: '/astrology' },
    { name: 'Compatibility', path: '/astrology/compatibility' },
    { name: 'Daily Horoscope', path: '/astrology/horoscope' },
    { name: 'Zodiac Signs', path: '/astrology/signs' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark/90 backdrop-blur-md shadow-lg border-b border-gold/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/30 border border-gold/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gold">
              Mystic Arcana
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNavLinks.map((link) => {
              // Skip auth-required links if user not logged in
              if (link.requiresAuth && !user) return null;

              // Determine if this is a dropdown link
              const isDropdown = link.name === 'Tarot' || link.name === 'Astrology';
              const dropdownItems = link.name === 'Tarot' ? tarotDropdown : astrologyDropdown;
              
              // Check if current location matches this link or any of its dropdown items
              const isActive = location === link.path || 
                (isDropdown && dropdownItems.some(item => location === item.path));

              if (isDropdown) {
                return (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? 'text-gold font-medium bg-primary/30'
                            : 'text-light hover:text-gold hover:bg-primary/20'
                        }`}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span>{link.name}</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="w-56 bg-dark/95 backdrop-blur-md border-gold/20 shadow-xl"
                    >
                      {dropdownItems.map((item) => {
                        // Skip auth-required items if user not logged in
                        if (item.requiresAuth && !user) return null;
                        
                        return (
                          <DropdownMenuItem asChild key={item.name}>
                            <Link
                              href={item.path}
                              className={`cursor-pointer flex items-center px-2 py-1.5 ${
                                location === item.path ? 'text-gold' : 'text-light hover:text-gold'
                              }`}
                            >
                              <span>{item.name}</span>
                              {location === item.path && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                              )}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                    location === link.path
                      ? 'text-gold font-medium bg-primary/30'
                      : 'text-light hover:text-gold hover:bg-primary/20'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span> {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side - Auth & Actions */}
          <div className="flex items-center gap-2">
            {/* Sign In/Up for non-authenticated users */}
            {!user && !isLoading && (
              <div className="hidden md:flex gap-2">
                <Link href="/auth?tab=login">
                  <Button 
                    variant="ghost" 
                    className="text-light hover:text-gold hover:bg-primary/20"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button 
                    className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Premium badge/button */}
            {user && (
              <Link href="/settings?tab=subscription">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:flex items-center gap-1 border-gold/50 text-gold hover:bg-gold/10 rounded-full"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Premium</span>
                </Button>
              </Link>
            )}

            {/* User menu for authenticated users */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 h-10 w-10 rounded-full overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/30 border border-gold/50 flex items-center justify-center overflow-hidden">
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
                  className="w-56 bg-dark/95 backdrop-blur-md border-gold/20 shadow-xl"
                >
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gold">
                        {user.username}
                      </p>
                      <p className="w-full truncate text-xs text-light/70">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gold/10" />
                  {[
                    { label: 'Profile', icon: <User />, href: '/profile' },
                    { label: 'Reading History', icon: <History />, href: '/readings' },
                    { label: 'Journal', icon: <BookOpen />, href: '/journal' },
                    { label: 'Blog & Rituals', icon: <BookText />, href: '/blog' },
                    { label: 'Settings', icon: <Settings />, href: '/settings' },
                    { label: 'Premium Upgrade', icon: <CreditCard />, href: '/upgrade' },
                  ].map(({ label, icon, href }) => (
                    <DropdownMenuItem asChild key={href}>
                      <Link
                        href={href}
                        className="cursor-pointer flex items-center text-light hover:text-gold"
                      >
                        {React.cloneElement(icon, { className: 'mr-2 h-4 w-4' })}
                        <span>{label}</span>
                        {location === href && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-gold/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gold hover:bg-primary/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-1">
                {/* Main navigation links */}
                {mainNavLinks.map((link) => {
                  // Skip auth-required links if user not logged in
                  if (link.requiresAuth && !user) return null;

                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-md ${
                        location === link.path
                          ? 'text-gold bg-primary/30 font-medium'
                          : 'text-light hover:text-gold hover:bg-primary/20'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xl">{link.icon}</span>
                      {link.name}
                    </Link>
                  );
                })}

                {/* Tarot submenu */}
                <div className="pl-4 mt-2 border-l border-gold/20">
                  <p className="text-xs uppercase text-light/50 font-medium tracking-wider mb-1 pl-2">
                    Tarot
                  </p>
                  {tarotDropdown.map((item) => {
                    // Skip auth-required items if user not logged in
                    if (item.requiresAuth && !user) return null;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                          location === item.path
                            ? 'text-gold bg-primary/30 font-medium'
                            : 'text-light hover:text-gold hover:bg-primary/20'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Astrology submenu */}
                <div className="pl-4 mt-2 border-l border-gold/20">
                  <p className="text-xs uppercase text-light/50 font-medium tracking-wider mb-1 pl-2">
                    Astrology
                  </p>
                  {astrologyDropdown.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                        location === item.path
                          ? 'text-gold bg-primary/30 font-medium'
                          : 'text-light hover:text-gold hover:bg-primary/20'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Auth links for mobile */}
                {!user && !isLoading && (
                  <div className="pt-4 mt-4 border-t border-gold/20 grid grid-cols-2 gap-2">
                    <Link
                      href="/auth?tab=login"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-primary/20 text-light hover:bg-primary/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 text-gold" />
                      Sign In
                    </Link>
                    <Link
                      href="/auth?tab=register"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-gold/20 text-gold hover:bg-gold/30 border border-gold/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* User actions for mobile */}
                {user && (
                  <div className="pt-4 mt-4 border-t border-gold/20 space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md text-light hover:text-gold hover:bg-primary/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md text-light hover:text-gold hover:bg-primary/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/upgrade"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-gold/20 text-gold hover:bg-gold/30 border border-gold/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Sparkles className="h-4 w-4" />
                      Premium Upgrade
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-red-400 hover:bg-red-500/10 text-left"
                      disabled={isLoading}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
