import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  className?: string;
}

export const FeatureCard = ({ 
  title, 
  icon, 
  description, 
  className 
}: FeatureCardProps) => {
  return (
    <div className={cn(
      "bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20",
      "hover:border-purple-300/30 transition-colors",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="p-2 bg-purple-900/20 rounded-lg text-purple-300">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-xl text-gold">{title}</h3>
          <p className="text-mystic-mist">{description}</p>
        </div>
      </div>
    </div>
  );
}
