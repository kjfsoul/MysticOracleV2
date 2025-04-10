import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import {
  Home,
  Sparkles,
  Stars,
  BookOpen,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  History,
  CreditCard,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MobileNavigationImproved() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Tarot", path: "/tarot", icon: <Sparkles className="h-5 w-5" /> },
    {
      name: "Astrology",
      path: "/astrology",
      icon: <Stars className="h-5 w-5" />,
    },
    { name: "Blog", path: "/blog", icon: <BookOpen className="h-5 w-5" /> },
    { name: "CrewAI", path: "/crewai", icon: <Bot className="h-5 w-5" /> },
    {
      name: user ? "Profile" : "Sign In",
      path: user ? "/profile" : "/auth?tab=login",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark/95 backdrop-blur-md border-t border-gold/30 py-3 px-4 md:hidden z-50 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center relative">
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-3 w-1 h-1 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive
                      ? "bg-primary/30 text-gold"
                      : "text-light/70 hover:text-gold"
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    className: `h-5 w-5 ${
                      isActive ? "text-gold" : "text-light/70"
                    }`,
                  })}
                </div>

                {/* Label */}
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-gold" : "text-light/70"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}

        {/* More menu for authenticated users */}
        {user && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 flex flex-col items-center"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full text-light/70 hover:text-gold">
                  <Menu className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium text-light/70">
                  More
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="bg-dark/95 backdrop-blur-md border-gold/30 pt-6 pb-20"
            >
              <SheetHeader>
                <SheetTitle className="text-gold font-heading">Menu</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  {
                    name: "Journal",
                    path: "/journal",
                    icon: <BookOpen className="h-5 w-5" />,
                  },
                  {
                    name: "Readings",
                    path: "/readings",
                    icon: <History className="h-5 w-5" />,
                  },
                  {
                    name: "Settings",
                    path: "/settings",
                    icon: <Settings className="h-5 w-5" />,
                  },
                  {
                    name: "Premium",
                    path: "/upgrade",
                    icon: <CreditCard className="h-5 w-5" />,
                  },
                ].map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div className="flex flex-col items-center p-3 rounded-lg bg-primary/20 border border-primary/30">
                      <div className="text-gold mb-1">{item.icon}</div>
                      <span className="text-xs text-light">{item.name}</span>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center p-3 rounded-lg bg-red-900/20 border border-red-900/30"
                >
                  <LogOut className="h-5 w-5 text-red-400 mb-1" />
                  <span className="text-xs text-red-400">Log out</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}
