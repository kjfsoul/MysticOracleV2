
import { useState } from "react";
import { motion } from "framer-motion";
import { zodiacSigns } from "@/data/zodiac-data";

interface ZodiacSignSelectorProps {
  onSelectSign: (sign: string) => void;
  selectedSign?: string;
}

export default function ZodiacSignSelector({ onSelectSign, selectedSign = "aries" }: ZodiacSignSelectorProps) {
  const getElementColorClass = (element: string) => {
    switch (element) {
      case "fire":
        return "border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10";
      case "earth":
        return "border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/10";
      case "air":
        return "border-sky-500/50 hover:border-sky-500 hover:bg-sky-500/10";
      case "water":
        return "border-indigo-500/50 hover:border-indigo-500 hover:bg-indigo-500/10";
      default:
        return "border-accent/50 hover:border-accent hover:bg-accent/10";
    }
  };

  const getSelectedElementClass = (element: string) => {
    switch (element) {
      case "fire":
        return "border-amber-500 bg-amber-500/20 shadow-md shadow-amber-500/20";
      case "earth":
        return "border-emerald-500 bg-emerald-500/20 shadow-md shadow-emerald-500/20";
      case "air":
        return "border-sky-500 bg-sky-500/20 shadow-md shadow-sky-500/20";
      case "water":
        return "border-indigo-500 bg-indigo-500/20 shadow-md shadow-indigo-500/20";
      default:
        return "border-accent bg-accent/20 shadow-md shadow-accent/20";
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {zodiacSigns.map((sign) => {
        const isSelected = selectedSign?.toLowerCase() === sign.sign.toLowerCase();
        const elementClass = getElementColorClass(sign.element);
        const selectedClass = isSelected ? getSelectedElementClass(sign.element) : "";

        return (
          <motion.button
            key={sign.sign}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectSign(sign.sign)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${elementClass} ${selectedClass}`}
          >
            <span className="text-xl mb-1">{sign.emoji}</span>
            <span className={`text-sm font-medium ${isSelected ? "text-light" : "text-light/70"}`}>
              {sign.sign}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
