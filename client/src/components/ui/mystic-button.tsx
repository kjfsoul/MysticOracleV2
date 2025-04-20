import React from 'react';

interface MysticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const MysticButton = ({ children, className, variant, size, ...props }: MysticButtonProps) => {
  return (
    <button
      {...props}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 blur-lg" />
    </button>
  );
};
