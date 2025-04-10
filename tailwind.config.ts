import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        heading: ["var(--font-heading)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Design system colors
        dark: "var(--color-dark)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          10: "var(--color-primary-10)",
          20: "var(--color-primary-20)",
          30: "var(--color-primary-30)",
          40: "var(--color-primary-40)",
          50: "var(--color-primary-50)",
          60: "var(--color-primary-60)",
          70: "var(--color-primary-70)",
          80: "var(--color-primary-80)",
          90: "var(--color-primary-90)",
        },
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        light: "var(--color-light)",
        gold: {
          DEFAULT: "var(--color-gold)",
          10: "var(--color-gold-10)",
          20: "var(--color-gold-20)",
          30: "var(--color-gold-30)",
          40: "var(--color-gold-40)",
          50: "var(--color-gold-50)",
          60: "var(--color-gold-60)",
          70: "var(--color-gold-70)",
          80: "var(--color-gold-80)",
          90: "var(--color-gold-90)",
        },
        purple: "var(--color-purple)",
        "deep-purple": "var(--color-deep-purple)",

        // Status colors
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",

        // Legacy colors for backward compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
      },
      spacing: {
        // Using design system spacing variables
        "0": "var(--spacing-0)",
        px: "var(--spacing-px)",
        "0.5": "var(--spacing-0-5)",
        "1": "var(--spacing-1)",
        "1.5": "var(--spacing-1-5)",
        "2": "var(--spacing-2)",
        "2.5": "var(--spacing-2-5)",
        "3": "var(--spacing-3)",
        "3.5": "var(--spacing-3-5)",
        "4": "var(--spacing-4)",
        "5": "var(--spacing-5)",
        "6": "var(--spacing-6)",
        "7": "var(--spacing-7)",
        "8": "var(--spacing-8)",
        "9": "var(--spacing-9)",
        "10": "var(--spacing-10)",
        "11": "var(--spacing-11)",
        "12": "var(--spacing-12)",
        "14": "var(--spacing-14)",
        "16": "var(--spacing-16)",
        "20": "var(--spacing-20)",
        "24": "var(--spacing-24)",
        "28": "var(--spacing-28)",
        "32": "var(--spacing-32)",
        "36": "var(--spacing-36)",
        "40": "var(--spacing-40)",
        "44": "var(--spacing-44)",
        "48": "var(--spacing-48)",
        "52": "var(--spacing-52)",
        "56": "var(--spacing-56)",
        "60": "var(--spacing-60)",
        "64": "var(--spacing-64)",
        "72": "var(--spacing-72)",
        "80": "var(--spacing-80)",
        "96": "var(--spacing-96)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
