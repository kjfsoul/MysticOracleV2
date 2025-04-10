import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Home, Sparkles, Stars, User } from "lucide-react";
import { Link } from "wouter";

export default function MobileNavigation() {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-gold/30 py-3 px-4 md:hidden z-50 mobile-nav-improved shadow-lg">
      <div className="flex justify-around items-center">
        <Link href="/">
          <div className="flex flex-col items-center">
            <Home className="h-5 w-5 text-gold icon-improved" />
            <span className="text-xs text-white mt-1 font-medium">Home</span>
          </div>
        </Link>

        <Link href="/tarot">
          <div className="flex flex-col items-center">
            <Sparkles className="h-5 w-5 text-gold icon-improved" />
            <span className="text-xs text-white mt-1 font-medium">Tarot</span>
          </div>
        </Link>

        <Link href="/astrology">
          <div className="flex flex-col items-center">
            <Stars className="h-5 w-5 text-gold icon-improved" />
            <span className="text-xs text-white mt-1 font-medium">
              Astrology
            </span>
          </div>
        </Link>

        <Link href="/blog">
          <div className="flex flex-col items-center">
            <BookOpen className="h-5 w-5 text-gold icon-improved" />
            <span className="text-xs text-white mt-1 font-medium">Blog</span>
          </div>
        </Link>

        <Link href={user ? "/profile" : "/auth?tab=login"}>
          <div className="flex flex-col items-center">
            <User className="h-5 w-5 text-gold icon-improved" />
            <span className="text-xs text-white mt-1 font-medium">
              {user ? "Profile" : "Sign In"}
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
