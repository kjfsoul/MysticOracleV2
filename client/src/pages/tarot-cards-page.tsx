import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar-fixed";
import TarotGallery from "@/components/tarot/tarot-gallery";
import { PageHeader } from "@/components/ui/page-header";
import { Moon, Stars, Sparkles } from "lucide-react";

export default function TarotCardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated stars */}
        <div className="absolute inset-0 bg-[radial-gradient(white,_rgba(255,255,255,0)_2px)] bg-[length:50px_50px] opacity-[0.03] -z-10"></div>

        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/5 h-80 w-80 rounded-full bg-purple-600/5 filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-blue-600/5 filter blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute top-1/2 right-1/5 h-64 w-64 rounded-full bg-indigo-600/5 filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.15, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Navbar />

      <main className="container mx-auto pt-24 pb-20">
        <div className="flex flex-col items-center">
          <motion.div 
            className="mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center mb-3 mx-auto">
              <Sparkles className="h-6 w-6 text-purple-300" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 arcane-text">
              Tarot Card Gallery
            </h1>
            <p className="text-purple-300/80 max-w-2xl mx-auto mb-4">
              Explore the complete tarot deck of 78 cards, including all 22 Major Arcana cards and 
              56 Minor Arcana cards organized by suit - Wands, Cups, Swords, and Pentacles.
              Each card contains powerful cosmic wisdom and symbolic meaning.
            </p>
            <div className="flex justify-center items-center mt-6">
              <Link to="/tarot" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 rounded-full border border-purple-500/30 transition-all duration-300 mystic-glow">
                <Sparkles className="h-4 w-4" />
                <span>Get a Tarot Reading</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full"
          >
            <TarotGallery />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center max-w-2xl mx-auto p-6 bg-slate-800/30 border border-purple-500/20 rounded-xl mystic-glow mystic-sparkle"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Moon className="h-5 w-5 text-purple-300" />
              <Stars className="h-5 w-5 text-purple-300" />
              <Sparkles className="h-5 w-5 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold mb-3 arcane-text">The Wisdom of the Tarot</h3>
            <p className="text-purple-100/90 mb-4">
              The tarot is a mirror of the soul, reflecting both our conscious and unconscious selves.
              Through its rich symbolism and archetypes, it offers guidance, clarity, and insight into 
              life's mysteries and our personal journeys.
            </p>
            <p className="text-purple-200/80 text-sm">
              Click on any card to learn more about its symbolic meaning and spiritual significance.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}