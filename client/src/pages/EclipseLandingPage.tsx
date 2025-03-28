import React, { useEffect, useState } from "react";
import { HoroscopePreview } from "../components/astrology/horoscope-preview";
import { BlogPreview } from "../components/blog/blog-preview";
import CardOfTheDay from "../components/tarot/card-of-the-day";
import { supabase } from "../lib/supabaseClient";

const EclipseLandingPage: React.FC = () => {
  const targetDate = new Date("2025-03-29T00:00:00");
  const [countdown, setCountdown] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("The Eclipse is happening now!");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase
      .from("subscriptions")
      .insert([{ email, location }]);
    if (error) {
      setFormStatus("Error saving subscription. Please try again.");
    } else {
      setFormStatus("Thanks for subscribing!");
      setEmail("");
      setLocation("");
    }
  };

  return (
    <div className="min-h-screen relative bg-[url('/assets/images/zodiac-bg.jpg')] bg-cover bg-fixed bg-gray-900 bg-blend-overlay">
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <div className="relative z-10 container mx-auto px-4 py-8 animate-fadeIn">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Mystic Arcana Eclipse Experience
          </h1>
          <p className="text-xl text-white">
            Countdown to the Solar Eclipse: {countdown}
          </p>
        </header>
        <section className="mb-12 max-w-md mx-auto bg-gray-800 bg-opacity-75 p-6 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Subscribe for Updates
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-white">Email:</label>
              <input
                type="email"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-white">Location:</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
            >
              Subscribe
            </button>
            {formStatus && (
              <p className="mt-2 text-center text-white">{formStatus}</p>
            )}
          </form>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Daily Tarot Draw
          </h2>
          <div className="flex justify-center">
            <CardOfTheDay />
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Daily Horoscope
          </h2>
          <div className="flex justify-center">
            <HoroscopePreview />
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Eclipse Zodiac Interpretations
          </h2>
          <div className="bg-gray-800 bg-opacity-75 p-6 rounded shadow">
            <p className="text-center text-white">
              Discover how the eclipse influences your zodiac sign.
              Detailedinterpretations coming soon.
            </p>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Mystic Arcana Blog
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <BlogPreview />
            {/* Additional blog previews can be added here */}
          </div>
        </section>
        <footer className="text-center mt-8">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Mystic Arcana. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EclipseLandingPage;
