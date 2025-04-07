import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Home, Sparkles, Stars, User } from "lucide-react";
import { Link } from "wouter";

export default function MobileNavigation() {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-gold/20 py-2 px-4 md:hidden z-50">
      <div className="flex justify-around items-center">
        <Link href="/">
          <div className="flex flex-col items-center">
            <Home className="h-5 w-5 text-gold" />
            <span className="text-xs text-light/80 mt-1">Home</span>
          </div>
        </Link>

        <Link href="/tarot">
          <div className="flex flex-col items-center">
            <Sparkles className="h-5 w-5 text-gold" />
            <span className="text-xs text-light/80 mt-1">Tarot</span>
          </div>
        </Link>

        <Link href="/astrology">
          <div className="flex flex-col items-center">
            <Stars className="h-5 w-5 text-gold" />
            <span className="text-xs text-light/80 mt-1">Astrology</span>
          </div>
        </Link>

        <Link href="/blog">
          <div className="flex flex-col items-center">
            <BookOpen className="h-5 w-5 text-gold" />
            <span className="text-xs text-light/80 mt-1">Blog</span>
          </div>
        </Link>

        <Link href={user ? "/profile" : "/auth"}>
          <div className="flex flex-col items-center">
            <User className="h-5 w-5 text-gold" />
            <span className="text-xs text-light/80 mt-1">
              {user ? "Profile" : "Sign In"}
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
