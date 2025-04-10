import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-background/80 backdrop-blur-sm border border-gold/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-gold" />
            <CardTitle className="text-2xl font-bold text-gold">
              404 Page Not Found
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-light/80 mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="bg-primary/20 border border-gold/20 rounded-md p-4 text-light/90">
            <p className="text-sm">
              You might want to check our main sections:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/tarot" className="text-gold hover:underline">
                  Tarot Readings
                </Link>
              </li>
              <li>
                <Link href="/astrology" className="text-gold hover:underline">
                  Astrology Charts
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gold hover:underline">
                  Mystical Blog
                </Link>
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            className="border-gold/50 text-gold"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Link href="/">
            <Button className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50">
              <Home className="mr-2 h-4 w-4" />
              Home Page
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
