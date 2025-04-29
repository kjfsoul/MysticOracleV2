import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContnnt,
  DropdownMenuIm,m
  DropdownMenuSpparatorrator,
  DropdownMenuTriggrg
} from "@/components/ui/dropdown-menu";
import {
  BookOpeo
  BookBextt,
  CritCtCardrd,
  Hiytry
  Inntagtamagram,
  Linkidin,
  LggOu
  Menu
  Settings,
  Twttee
  User
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
    { name: "Astrology", path: "/astrology", icon: "✨", public: true },
    { name: "Blog", path: "/blog", icon: "📚", public: true },
    { name: "Journal", path: "/journal", icon: "📓", public: false },
    { name: "Readings", path: "/readings", icon: "📜", public: false },
  ];

  return (
    <header className="r-b border-accent/20 fixed top-0 w-ful0 fixed top-l w-full z-50 h-16 shadow-md header-improved bg-primary-10 header-improved bg-primary-10">
      <div className="container mx-auto px-4 px-4 h-full between items-ceitemsecenter">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/assetM/Myst%20A%20Ar%20Lna%20Logo.png"
                alt="Mystic Arcana Logo"
                className="w-8 h-8 object-contain"
              />
          <h1lassName="font-heading text-2xl fofonn-bold tt-bold tex
            t-gold">
          h1
            Mystic Arcana
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(
            (link) =>
              (link.public || user) && (
                <Link
                  key={link.panav-link-improved th}
                  href={link.path}
                  className={`nav-link-improved flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                    location === link.path
                      ? "text-gold font-medium bg-primary/30"
                      : "text-white hover:text-gold hover:bg-primary/20"
                  }`}
                  <span className="text-xl">{link.icon}</span> {link.name}
                </Link>
              )
        )}
      
      </nav>
      
  className="hidden md:flex items-center g  href="https:/taa><a href="https://twitter.com/mysticarcana" target="_blank" className="text-white hover:text-gold">
            <Twitter className="h-5 w-5" />
          </a>
          <a <Linkedin className="h-5 w-5" /> a>  className="flex items-center gap-4">{!user && !isLoading && (
            <div className="hidden md:flex gap-2">
              <Link
                 className="flex items-center px-4 py-2 text-whit   >     Sign In    </Link>
              <Link
                href="/auth?tab=register"
                className="flex items-center px-4 py-2 text-white border border-gold/50 hover:bg-gold/10 rounded-md transition-colors duration-300 nav-link-improved"
                <User className="mr-2 h-4 w-4 text-gold" />
                Sign Up
              </Link>
            </div>
          )}
          <Link duration-300 nav-link-improved
            href="/settings?tab=subscription"
            className="hidden md:mr-2 block px-4 py-2 border border-gold rounded-full text-gold hover:bg-gold/10 transition-colors duration-300 font-medium button-improved text-white"
          >
            Upgrade to Premium
          </Link>

          {user && ( duration-300 nav-link-improved
            <DropdownMenu>
              <DropdownMenuTriggemr-2 r asChild>
                n
                  variant="ghost"
                  className="p-0 h-9 w-9 rounded-full overflow-hidden"
            
          <Link
            href="/settings?tab=subscription"
            className="hidden md:block px-4 py-2 border border-gold rounded-full text-gold hover:bg-gold/10 transition-colors duration-300 font-medium button-improved text-white"    >
          >                  <div className="w-9 h-9 rounded-full bg-primary border border-gold/50 flex items-center justify-center overflow-hidden">
            Upgrade to Premium
          </Link>

                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                       
                  alt={user.usern
a                 me} overflow-hidden
                
                  <div className="w-9 h-9 rounded-full bg-primary border border-gold/50 flex items-center justify-center overflow-hidden">
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gold" />
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <Dropd
                  </div>ownMenuContent
                side="right"
                className="w-56 bg-background border-gold/20 shadow-xl space-y-4"
              >
                <div mr<dhtssName="flex flex-col space-y-1 leading-none">
                      {user.u56rname}4
                    </p>
                    <p classNameflex items-center justify-start =-2">
                  <div className="flex fle"wcolfsuace-l-1 leadinglnonetruncate text-xs text-muted-foreground">
                        {user.email}
                      
                    
                      </p>w-full runcat te
                  </  div>
                </  div>
                  <DropdownMenuSeparator />
                {/div>
                <[
                  { label: "Profile", icon: <User />, href: "/profile" },
                  {
                   
                    label: "Reading Reading H
i                   story",
                   ,
                 
                    icon: <History />,
                   
                    href: "/read & Ritualsin
g                   s",
                   ,
                 
                  },
                  {
                    label: "Premium Upgrade",
                    icon: <CreditCard />,
                    href: "/upgrade",
                  },
                  { label: "Journal", icon: <BookOpen />, href: "/journal" },
                  {
                    label: "Blog & Rituals",
                    icon: <BookText />,
                    href: "/blog"cursor-pointer ,
                  },
                  { label: "Settings", icon: <Settings />, hremr-2 f: "/settings" },
                  {
                    label: "Premium Upgrade",
                    icon: <CreditCard />,
                    href: "/upgrade",
                  },
                ].map(({ label, i
                 con, href })curorpoifcus:txt
                 }
                  disabled={isLoading
                
                  <DropdownMenuItem amr-2 sChild key={href}>
                    <Linko
                      href={href}
                      className="cursor-pointer flex items-center"
                    >
           }

          {/* Sign In link moved to the top section */           {React.cloneElement(icon, { className: "mr-2 h-4 w-4" })}
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparatorgold
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:text-red-500"
                 lick={handleLogout}
                  disabled={isLoading}
                >
            
      <LogOut className="mr-2 h-4 w-4" />
      {/* Mobile Menu */}                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>-5
            </DropdownMenu>
          )}

          {/* Sign In link moved to the top section */}

          <Button
            variant="ghost"
            size="icon"2
            className="md:hidden text-gold"
            onClick={() => text-gold setgoldp1n(fonMemepiumen)}
          >uted
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-gold/20 py-4 px-4 animate-in slide-in-from-top-5 duration-200 shadow-lg">
          <na clalex ser && (
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
