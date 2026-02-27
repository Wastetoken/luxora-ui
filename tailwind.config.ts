import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
        showcase: {
          surface: "hsl(var(--showcase-surface))",
          border: "hsl(var(--showcase-border))",
        },
        code: {
          bg: "hsl(var(--code-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        "meteor-effect": {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: "0" },
        },
        first: {
          "0%": { transform: "translateY(-50%) rotate(0deg) scale(1)" },
          "33%": { transform: "translateY(-50%) rotate(120deg) scale(1.2)" },
          "66%": { transform: "translateY(-50%) rotate(240deg) scale(0.8)" },
          "100%": { transform: "translateY(-50%) rotate(360deg) scale(1)" },
        },
        second: {
          "0%": { transform: "translateY(-50%) rotate(0deg) scale(1)" },
          "33%": { transform: "translateY(-50%) rotate(-120deg) scale(0.8)" },
          "66%": { transform: "translateY(-50%) rotate(-240deg) scale(1.2)" },
          "100%": { transform: "translateY(-50%) rotate(-360deg) scale(1)" },
        },
        third: {
          "0%": { transform: "translateY(-50%) rotate(0deg) scale(1)" },
          "33%": { transform: "translateY(-50%) rotate(60deg) scale(1.1)" },
          "66%": { transform: "translateY(-50%) rotate(180deg) scale(0.9)" },
          "100%": { transform: "translateY(-50%) rotate(360deg) scale(1)" },
        },
        fourth: {
          "0%": { transform: "translateY(-50%) rotate(0deg) scale(1)" },
          "33%": { transform: "translateY(-50%) rotate(-60deg) scale(0.9)" },
          "66%": { transform: "translateY(-50%) rotate(-180deg) scale(1.1)" },
          "100%": { transform: "translateY(-50%) rotate(-360deg) scale(1)" },
        },
        fifth: {
          "0%": { transform: "translateY(-50%) rotate(0deg) scale(1)" },
          "33%": { transform: "translateY(-50%) rotate(90deg) scale(1.15)" },
          "66%": { transform: "translateY(-50%) rotate(270deg) scale(0.85)" },
          "100%": { transform: "translateY(-50%) rotate(360deg) scale(1)" },
        },
        "cell-ripple": {
          "0%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.4" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: "aurora 60s linear infinite",
        "meteor-effect": "meteor-effect 5s linear infinite",
        first: "first 20s ease-in-out infinite",
        second: "second 18s ease-in-out infinite",
        third: "third 22s ease-in-out infinite",
        fourth: "fourth 16s ease-in-out infinite",
        fifth: "fifth 24s ease-in-out infinite",
        "cell-ripple": "cell-ripple var(--duration, 400ms) ease-out var(--delay, 0ms)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
