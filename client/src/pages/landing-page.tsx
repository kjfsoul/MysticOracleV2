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

      <main className="container mx-auto px-4 pt-8 pb-20 md:pb-16 md:pt-12 max-w-7xl main-content">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-10">
            <Badge className="mb-4 badge-improved">Spring 2025 Special</Badge>
            <h1 className="heading-improved text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#D4AF37] to-[#F5E1A4] bg-clip-text text-transparent font-serif tracking-wide">
              The Fool's Journey
            </h1>
            <p className="subheading-improved text-lg md:text-xl max-w-2xl mx-auto mb-8 font-serif leading-relaxed">
              Embrace the spirit of Spring renewal and new beginnings with our
              special Easter readings
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Link href="/tarot">
                <Button
                  size="lg"
                  className="button-improved text-white w-full sm:w-auto mb-2 sm:mb-0"
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
        <section className="max-w-4xl mx-auto mb-12 section-improved">
          <h2 className="heading-improved text-2xl md:text-3xl font-semibold mb-6 text-center text-light">
            The <span className="text-accent">Fool's Wisdom</span> Today
          </h2>
          <div className="daily-card-improved">
            <DailyCardLocal />
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto mb-12 section-improved">
          <h2 className="heading-improved text-2xl md:text-3xl font-semibold mb-6 text-center text-light">
            Spring <span className="text-accent">Mystical Services</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card className="card-improved text-light">
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

            <Card className="card-improved text-light">
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

            <Card className="card-improved text-light">
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

            <Card className="card-improved text-light">
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
        <section className="max-w-6xl mx-auto mb-12 section-improved">
          <h2 className="heading-improved text-2xl md:text-3xl font-semibold mb-6 text-center text-light">
            Spring <span className="text-accent">Featured Content</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Featured Blog Post */}
            <Card className="card-improved text-light overflow-hidden">
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
            <Card className="card-improved text-light overflow-hidden">
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
        <section className="max-w-4xl mx-auto mb-12 card-improved p-4 md:p-6 section-improved">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-1/3">
              <img
                src="/images/tarot/major/the-fool.jpg"
                alt="The Fool Tarot Card"
                className="rounded-lg shadow-lg border border-accent/30"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="heading-improved text-2xl md:text-3xl font-semibold mb-4 text-light">
                The <span className="text-accent">Fool's Journey</span>
              </h2>
              <p className="text-improved mb-4">
                The Fool represents new beginnings, taking a leap of faith, and
                embracing the unknown. As Spring arrives, we're all invited to
                embark on our own Fool's journey - stepping forward with
                innocence, spontaneity, and trust in the universe.
              </p>
              <p className="text-improved mb-5">
                This Spring, let The Fool guide you toward fresh starts and new
                adventures. What seeds will you plant? What journeys will you
                begin?
              </p>
              <Link href="/tarot-cards/the-fool">
                <Button className="button-improved text-white text-sm px-4 py-2">
                  Explore The Fool's Wisdom
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-3xl mx-auto text-center mb-16 section-improved">
          <div className="bg-gradient-to-r from-green-500/30 to-yellow-500/30 backdrop-blur-sm rounded-xl border border-accent/20 p-6 md:p-10 card-improved">
            <h2 className="heading-improved text-xl md:text-2xl font-bold mb-4 text-light">
              Begin Your Spring Renewal Journey
            </h2>
            <p className="text-improved mb-5 max-w-xl mx-auto">
              Sign up now to access our special Spring and Easter content,
              including The Fool's wisdom, sacred egg rituals, and personalized
              Spring equinox readings.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="button-improved text-white px-8 py-3 mt-2"
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
