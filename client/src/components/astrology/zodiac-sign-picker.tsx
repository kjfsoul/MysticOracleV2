import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ZodiacSign = {
  sign: string;
  element: string;
  dates: string;
};

interface ZodiacSignPickerProps {
  signs: ZodiacSign[];
  onSelectSign: (sign: string) => void;
  selectedSign?: string;
  title?: string;
  description?: string;
}

export default function ZodiacSignPicker({
  signs,
  onSelectSign,
  selectedSign,
  title = "Select Your Zodiac Sign",
  description = "Choose your sign to view your personalized astrology insights."
}: ZodiacSignPickerProps) {
  const [activeTab, setActiveTab] = useState<string>("fire");
  
  const elementGroups = {
    fire: signs.filter(sign => sign.element === "Fire"),
    earth: signs.filter(sign => sign.element === "Earth"),
    air: signs.filter(sign => sign.element === "Air"),
    water: signs.filter(sign => sign.element === "Water")
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="font-heading text-2xl font-semibold mb-2 text-accent/90">{title}</h3>
        <p className="text-light/70 max-w-xl mx-auto">
          {description}
        </p>
      </div>
      
      <Tabs 
        defaultValue="fire" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-dark/50 border border-light/10 backdrop-blur-sm">
            <TabsTrigger 
              value="fire" 
              className={`${activeTab === "fire" ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400" : "text-light/60"}`}
            >
              Fire
            </TabsTrigger>
            <TabsTrigger 
              value="earth"
              className={`${activeTab === "earth" ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400" : "text-light/60"}`}
            >
              Earth
            </TabsTrigger>
            <TabsTrigger 
              value="air"
              className={`${activeTab === "air" ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400" : "text-light/60"}`}
            >
              Air
            </TabsTrigger>
            <TabsTrigger 
              value="water"
              className={`${activeTab === "water" ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400" : "text-light/60"}`}
            >
              Water
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="fire" className="mt-0">
          <ZodiacSignGrid signs={elementGroups.fire} onSelectSign={onSelectSign} selectedSign={selectedSign} />
        </TabsContent>
        
        <TabsContent value="earth" className="mt-0">
          <ZodiacSignGrid signs={elementGroups.earth} onSelectSign={onSelectSign} selectedSign={selectedSign} />
        </TabsContent>
        
        <TabsContent value="air" className="mt-0">
          <ZodiacSignGrid signs={elementGroups.air} onSelectSign={onSelectSign} selectedSign={selectedSign} />
        </TabsContent>
        
        <TabsContent value="water" className="mt-0">
          <ZodiacSignGrid signs={elementGroups.water} onSelectSign={onSelectSign} selectedSign={selectedSign} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ZodiacSignGridProps {
  signs: ZodiacSign[];
  onSelectSign: (sign: string) => void;
  selectedSign?: string;
}

function ZodiacSignGrid({ signs, onSelectSign, selectedSign }: ZodiacSignGridProps) {
  const getSignIcon = (sign: string) => {
    // Simple switch to return the appropriate zodiac symbol
    switch (sign.toLowerCase()) {
      case "aries": return "♈";
      case "taurus": return "♉";
      case "gemini": return "♊";
      case "cancer": return "♋";
      case "leo": return "♌";
      case "virgo": return "♍";
      case "libra": return "♎";
      case "scorpio": return "♏";
      case "sagittarius": return "♐";
      case "capricorn": return "♑";
      case "aquarius": return "♒";
      case "pisces": return "♓";
      default: return "★";
    }
  };
  
  const getSignColor = (sign: string, element: string): string => {
    // Color themes for each element
    switch (element.toLowerCase()) {
      case "fire": return "from-red-500/30 to-orange-500/30 border-red-500/40 hover:border-red-500/70";
      case "earth": return "from-green-500/30 to-emerald-500/30 border-green-500/40 hover:border-green-500/70";
      case "air": return "from-blue-500/30 to-indigo-500/30 border-blue-500/40 hover:border-blue-500/70";
      case "water": return "from-cyan-500/30 to-blue-500/30 border-cyan-500/40 hover:border-cyan-500/70";
      default: return "from-gray-500/30 to-slate-500/30 border-slate-500/40 hover:border-slate-500/70";
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {signs.map((sign) => (
        <Button
          key={sign.sign}
          variant="outline"
          className={`
            h-auto min-h-24 p-4 flex flex-col items-center justify-center gap-2 
            bg-gradient-to-br ${getSignColor(sign.sign, sign.element)}
            backdrop-blur-sm rounded-xl text-light
            ${selectedSign === sign.sign ? "ring-2 ring-accent" : ""}
            transition-all duration-300 ease-in-out
          `}
          onClick={() => onSelectSign(sign.sign)}
        >
          <span className="text-3xl mb-1">{getSignIcon(sign.sign)}</span>
          <span className="font-heading text-lg font-semibold">{sign.sign}</span>
          <span className="text-xs text-light/70">{sign.dates}</span>
        </Button>
      ))}
    </div>
  );
}