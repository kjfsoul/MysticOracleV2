// client/src/pages/EclipseLandingPage.tsx
import React, { useEffect, useState } from "react";
import { animate, motion } from "framer-motion"; // For animations

// --- IMPORT YOUR ACTUAL COMPONENTS ---
// import { EclipseZodiacMeaning } from '@/components/astrology/eclipse-zodiac-meaning'; // Placeholder
import HoroscopePreview from "@/components/astrology/horoscope-preview";
import CardOfTheDay from "@/components/tarot/card-of-the-day";
import BlogPreview from "@/components/blog/blog-preview";

// --- IMPORT UI COMPONENTS (Assuming ShadCN or similar) ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Import Label if using ShadCN Label

// --- IMPORT SUPABASE CLIENT ---
import { supabase } from "@/lib/supabaseClient"; // Ensure casing matches your file
import { sign } from "crypto";
import { on } from "events";
import e from "express";
import { p } from "framer-motion/dist/types.d-B50aGbjN";
import { Eclipse, Unlock, Check } from "lucide-react";
import { type } from "os";
import { title } from "process";
import { jsx } from "react/jsx-runtime";

// --- CORRECT ECLIPSE DATE (UTC-4 for EDT) ---
const eclipseDate = new Date("2025-03-29T04:50:00-04:00");

const EclipseLandingPage: React.FC = () => {
  // --- State Variables ---
  const [timeLeft, setTimeLeft] = useState("Calculating...");
  const [firstName, setFirstName] = useState(""); // Optional First Name
  const [lastName, setLastName] = useState(""); // Optional Last Name
  const [location, setLocation] = useState(""); // Required Location
  const [email, setEmail] = useState(""); // Required Email
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Assuming CardOfTheDay and HoroscopePreview fetch their own data
  // const [tarotCardData, setTarotCardData] = useState<any>(null); // Remove if CardOfTheDay handles fetch

  // --- Countdown Timer Effect ---
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = eclipseDate.getTime() - now.getTime();
      if (difference <= 0) {
        setTimeLeft("🌒 The Eclipse is Here!");
        clearInterval(timer);
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(
        `${days}d ${hours}h ${minutes}m ${seconds}s until the cosmic alignment!`
      );
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Removed tarot fetch useEffect - assuming CardOfTheDay handles it

  // --- Form Submission Handler ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const signupData = {
        email: email.trim(),
        location: location.trim(),
        first_name: firstName.trim() || null, // Send null if empty
        last_name: lastName.trim() || null, // Send null if empty
        submitted_at: new Date(),
      };

      // Insert into 'eclipse_signups' table
      const { error } = await supabase
        .from("eclipse_signups")
        .insert([signupData]);

      if (error) {
        throw error;
      }

      setSubmitSuccess(true);
      // Optionally clear form on success
      // setFirstName("");
      // setLastName("");
      // setEmail("");
      // setLocation("");
    } catch (error: any) {
      console.error("Signup failed:", error);
      setSubmitError(
        error.message || "Failed to save your details. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Framer Motion Variants ---
  const containerVariants = {
    /* ... as before ... */
  };
  const itemVariants = {
    /* ... as before ... */
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body relative overflow-hidden">
      <div className="absolute inset-0 mystic-sparkle z-0 opacity-5"></div>
      <motion.div
        className="relative z-10 container mx-auto max-w-5xl px-4 py-16 space-y-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- Hero Section --- */}
        <motion.header variants={itemVariants} className="text-center">
          {/* Eclipse Icon/Animation Placeholder */}
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-900 shadow-lg relative overflow-hidden mystic-glow">
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-900 animate-eclipse-cover origin-right"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading mb-4 arcane-text">
            Mystic Arcana Eclipse Experience
          </h1>
          <p className="text-lg md:text-xl font-body mb-4">
            Prepare for the cosmic shift on{" "}
            <strong className="text-primary">
              March 29, 2025 at 4:50 AM EDT
            </strong>
            .
          </p>
          <p className="text-2xl text-accent font-semibold mb-8">{timeLeft}</p>
        </motion.header>

        {/* --- Subscription Form Section (Updated) --- */}
        <motion.section
          variants={itemVariants}
          className="max-w-lg mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-xl border border-border mystic-glow"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold font-heading mb-5 text-center text-card-foreground">
            Unlock Personalized Eclipse Guidance
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Optional First Name */}
            <div>
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-muted-foreground"
              >
                First Name (Optional)
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full mt-1"
              />
            </div>
            {/* Optional Last Name */}
            <div>
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-muted-foreground"
              >
                Last Name (Optional)
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full mt-1"
              />
            </div>
            {/* Required Location */}
            <div>
              <Label
                htmlFor="location"
                className="text-sm font-medium text-muted-foreground"
              >
                Your Location (City or ZIP) *
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., New York, NY or 10001"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full mt-1"
              />
            </div>
            {/* Required Email */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground"
              >
                Your Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  Subscribing...
                </>
              ) : (
                "Get Eclipse Updates & Viewing Info"
              )}
            </Button>
            {submitSuccess && (
              <p className="mt-3 text-center text-green-400 text-sm">
                Success! Check your email soon for eclipse details.
              </p>
            )}
            {submitError && (
              <p className="mt-3 text-center text-red-400 text-sm">
                {submitError}
              </p>
            )}
          </form>
        </motion.section>

        {/* --- Daily Insights Grid --- */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl font-semibold font-heading mb-4 text-center md:text-left">
              🔮 Daily Tarot Guidance
            </h2>
            <CardOfTheDay /> {/* Assumes this component handles its data */}
          </motion.section>
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl font-semibold font-heading mb-4 text-center md:text-left">
              🌠 Daily Horoscope Preview
            </h2>
            <HoroscopePreview defaultSign="Aries" />{" "}
            {/* Assumes this component handles its data */}
          </motion.section>
        </div>

        {/* --- Eclipse Zodiac Interpretations Section --- */}
        <motion.section variants={itemVariants}>
          <h2 className="text-3xl font-semibold font-heading mb-4 text-center">
            🌌 What This Eclipse Means For You
          </h2>
          <Card className="bg-card p-6 text-card-foreground">
            <p className="text-center text-muted-foreground">
              Discover how the powerful energy of the solar eclipse influences
              your specific zodiac sign. Deeper, personalized interpretations
              coming soon!
            </p>
            {/* <EclipseZodiacMeaning /> */} {/* Placeholder */}
          </Card>
        </motion.section>

        {/* --- Mystic Arcana Blog Section --- */}
        <motion.section variants={itemVariants}>
          <h2 className="text-3xl font-semibold font-heading mb-6 text-center">
            From the Mystic Blog
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogPreview postId="1" title="Saturn-Uranus Square Insights" />
            <BlogPreview postId="2" title="AI Enhanced Tarot Explained" />
            <BlogPreview postId="3" title="Interpreting the Lunar Eclipse" />
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Explore All Articles
            </Button>
          </div>
        </motion.section>

        {/* --- Footer --- */}
        <motion.footer
          variants={itemVariants}
          className="text-center mt-16 text-xs text-muted-foreground border-t border-border pt-8"
        >
          {/* ... footer content ... */}
        </motion.footer>
      </motion.div>

      {/* Make sure your index.css includes the keyframes */}
      <style jsx global>{`
        @keyframes eclipse-cover-anim {
          0% {
            transform: translateX(110%);
          }
          40% {
            transform: translateX(0%);
          }
          60% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-110%);
          }
        }
        .animate-eclipse-cover {
          animation: eclipse-cover-anim 5s ease-in-out infinite;
        }
        /* Include other global styles or keyframes if needed */
      `}</style>
    </div>
  );
};

export default EclipseLandingPage;
