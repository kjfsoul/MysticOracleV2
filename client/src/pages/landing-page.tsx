import MobileNavigation from "@/components/layout/mobile-navigation";
import Navbar from "@/components/layout/navbar";
import DailyCardLocal from "@/components/tarot/daily-card-local";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import "@/styles/cosmic-background.css";
import { BookOpen, Egg, ScrollText, Sparkles, Stars } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Spring & Easter themed content
const springFeaturedContent = {
  title: "The Fool's Journey: Spring Renewal",
  description:
    "Embrace new beginnings and spiritual growth with the energy of The Fool tarot card and the renewal of Spring.",
  image: null,
  category: "Seasonal Wisdom",
  slug: "fools-journey-spring-renewal",
};

const easterRitualContent = {
  title: "Sacred Egg Ritual for Rebirth",
  description:
    "A mystical Easter ritual using decorated eggs to symbolize rebirth, transformation, and new possibilities.",
  image: null,
  price: "Free Guide",
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* The cosmic background is now handled by the CosmicBackground component in App.tsx */}
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10"></div>

      <Navbar />

      <main className="container mx-auto px-4 pt-8 pb-20 md:pb-16 md:pt-12 max-w-7xl">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-green-500/20 text-green-300 border-green-500/30 py-1 px-3 text-xs">
              Spring 2025 Special
            </Badge>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-[#D4AF37] to-[#F5E1A4] bg-clip-text text-transparent font-serif tracking-wide">
              The Fool's Journey
            </h1>
            <p className="text-light/90 text-lg md:text-xl max-w-2xl mx-auto mb-6 font-serif leading-relaxed">
              Embrace the spirit of Spring renewal and new beginnings with our
              special Easter readings
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <Link href="/tarot">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/80 text-dark w-full sm:w-auto mb-2 sm:mb-0"
                >
                  Get Spring Reading
                </Button>
              </Link>
              <Link href="/journal">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-light/30 text-light hover:bg-light/10 w-full sm:w-auto mb-2 sm:mb-0"
                >
                  Start Spring Journal
                </Button>
              </Link>
              <Link href="/astrology">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-light/30 text-light hover:bg-light/10 w-full sm:w-auto"
                >
                  Spring Equinox Chart
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Card of the Day Section */}
        <section className="max-w-4xl mx-auto mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4 text-center text-light">
            The <span className="text-accent">Fool's Wisdom</span> Today
          </h2>
          <DailyCardLocal />
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-5 text-center text-light">
            Spring <span className="text-accent">Mystical Services</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light">
              <CardHeader className="pb-1 pt-3 px-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg text-accent">
                  Tarot Readings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-1">
                <p className="text-light/80 text-sm">
                  Special Spring spreads featuring The Fool's journey and new
                  beginnings.
                </p>
              </CardContent>
              <CardFooter className="px-3 pt-1 pb-3">
                <Link href="/tarot" className="w-full">
                  <Button
                    variant="link"
                    className="text-accent p-0 text-sm w-full text-left"
                  >
                    Try Free Reading →
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light">
              <CardHeader className="pb-1 pt-3 px-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Stars className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg text-accent">
                  Astrology Charts
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-1">
                <p className="text-light/80 text-sm">
                  Spring equinox charts and planetary alignments for personal
                  growth.
                </p>
              </CardContent>
              <CardFooter className="px-3 pt-1 pb-3">
                <Link href="/astrology" className="w-full">
                  <Button
                    variant="link"
                    className="text-accent p-0 text-sm w-full text-left"
                  >
                    View Spring Forecast →
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light">
              <CardHeader className="pb-1 pt-3 px-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg text-accent">Journal</CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-1">
                <p className="text-light/80 text-sm">
                  Document your spiritual journey with our guided Spring renewal
                  journal prompts.
                </p>
              </CardContent>
              <CardFooter className="px-3 pt-1 pb-3">
                <Link href="/journal" className="w-full">
                  <Button
                    variant="link"
                    className="text-accent p-0 text-sm w-full text-left"
                  >
                    Start Journaling →
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light">
              <CardHeader className="pb-1 pt-3 px-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Egg className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg text-accent">
                  Easter Rituals
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-1">
                <p className="text-light/80 text-sm">
                  Sacred egg rituals and Spring ceremonies to celebrate rebirth
                  and renewal.
                </p>
              </CardContent>
              <CardFooter className="px-3 pt-1 pb-3">
                <Link href="/blog/rituals/easter-rituals" className="w-full">
                  <Button
                    variant="link"
                    className="text-accent p-0 text-sm w-full text-left"
                  >
                    Explore Rituals →
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Featured Content Section */}
        <section className="max-w-6xl mx-auto mb-8 md:mb-10 px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-center text-light">
            Spring <span className="text-accent">Featured Content</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Featured Blog Post */}
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light overflow-hidden">
              <div className="h-40 relative bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <ScrollText className="h-12 w-12 text-accent/50" />
                <div className="absolute top-2 left-2 bg-accent/80 text-dark px-2 py-0.5 rounded text-xs font-medium">
                  {springFeaturedContent.category}
                </div>
              </div>
              <CardHeader className="pt-3 px-3 pb-1">
                <div className="flex items-center gap-1">
                  <ScrollText className="h-3 w-3 text-accent" />
                  <CardDescription className="text-light/70 text-xs">
                    Spring Special
                  </CardDescription>
                </div>
                <CardTitle className="text-lg text-light">
                  {springFeaturedContent.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-1">
                <p className="text-light/80 line-clamp-2 text-sm">
                  {springFeaturedContent.description}
                </p>
              </CardContent>
              <CardFooter className="px-3 pt-1 pb-3">
                <Link href={`/blog/seasonal/${springFeaturedContent.slug}`}>
                  <Button
                    variant="outline"
                    className="border-light/30 text-light hover:bg-light/10 text-sm px-3 py-1"
                  >
                    Read Article
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Featured Easter Ritual */}
            <Card className="bg-dark/40 backdrop-blur-sm border border-light/10 text-light overflow-hidden">
              <div className="h-40 relative bg-gradient-to-br from-green-500/20 to-yellow-500/20 flex items-center justify-center">
                <Egg className="h-12 w-12 text-green-500/50" />
                <div className="absolute top-2 right-2 bg-green-500/80 text-dark px-2 py-0.5 rounded text-xs font-medium">
                  {easterRitualContent.price}
                </div>
              </div>
              <CardHeader className="pt-3 px-3 pb-1">
                <div className="flex items-center gap-1">
                  <Egg className="h-3 w-3 text-accent" />
                  <CardDescription className="text-light/70 text-xs">
                    Easter Ritual
                  </CardDescription>
                </div>
                <CardTitle className="text-lg text-light">
                  {easterRitualContent.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-1">
                <p className="text-light/80 line-clamp-2 text-sm">
                  {easterRitualContent.description}
                </p>
              </CardContent>
              <CardFooter className="px-3 pt-1 pb-3">
                <Link href="/blog/rituals/easter-egg-ritual">
                  <Button
                    variant="outline"
                    className="border-light/30 text-light hover:bg-light/10 text-sm px-3 py-1"
                  >
                    View Ritual
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* The Fool's Journey Section */}
        <section className="max-w-4xl mx-auto mb-6 md:mb-8 bg-dark/60 backdrop-blur-sm border border-light/10 rounded-lg p-3 md:p-5 mx-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-1/3">
              <img
                src="/images/tarot/major/the-fool.jpg"
                alt="The Fool Tarot Card"
                className="rounded-lg shadow-lg border border-accent/30"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-3 text-light">
                The <span className="text-accent">Fool's Journey</span>
              </h2>
              <p className="text-light/80 mb-3 text-sm md:text-base">
                The Fool represents new beginnings, taking a leap of faith, and
                embracing the unknown. As Spring arrives, we're all invited to
                embark on our own Fool's journey - stepping forward with
                innocence, spontaneity, and trust in the universe.
              </p>
              <p className="text-light/80 mb-4 text-sm md:text-base">
                This Spring, let The Fool guide you toward fresh starts and new
                adventures. What seeds will you plant? What journeys will you
                begin?
              </p>
              <Link href="/tarot-cards/the-fool">
                <Button className="bg-accent hover:bg-accent/80 text-dark text-sm px-3 py-1">
                  Explore The Fool's Wisdom
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-3xl mx-auto text-center px-4 mb-12">
          <div className="bg-gradient-to-r from-green-500/30 to-yellow-500/30 backdrop-blur-sm rounded-xl border border-accent/20 p-5 md:p-8">
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-2 text-light">
              Begin Your Spring Renewal Journey
            </h2>
            <p className="text-light/80 mb-3 max-w-xl mx-auto text-sm">
              Sign up now to access our special Spring and Easter content,
              including The Fool's wisdom, sacred egg rituals, and personalized
              Spring equinox readings.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/80 text-dark px-6 py-2 mt-2"
              >
                Start Your Spring Journey
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  );
}
