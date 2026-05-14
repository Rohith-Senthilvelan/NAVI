import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#05060F",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#6E56FF",
          secondary: "#9B7BFF",
          tertiary: "#4F46FF",
          foreground: "#FFFFFF",
        },
        gold: {
          DEFAULT: "#F5C453",
          deep: "#C9952B",
          foreground: "#05060F",
        },
        surface: {
          DEFAULT: "#0B0D1F",
          elevated: "#11142B",
          foreground: "#FFFFFF",
        },
        cyan: {
          DEFAULT: "#4FD1FF",
        },
        pink: {
          DEFAULT: "#FF6FB5",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        "text-high": "#FFFFFF",
        "text-mid": "#B4B8D4",
        "text-low": "#6B7099",
        brand: {
          primary: "#6E56FF",
          secondary: "#9B7BFF",
          tertiary: "#4F46FF",
          glow: "#8B6FFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-hero":
          "radial-gradient(1200px 600px at 20% 0%, #2A1F6E 0%, transparent 60%), radial-gradient(900px 500px at 80% 30%, #4F46FF22 0%, transparent 55%), #05060F",
        "gradient-button": "linear-gradient(135deg, #6E56FF 0%, #9B7BFF 100%)",
        "gradient-premium": "linear-gradient(135deg, #F5C453 0%, #FF8E3C 100%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "btn-primary": "0 8px 32px rgba(110,86,255,0.35)",
        "btn-primary-hover": "0 12px 48px rgba(110,86,255,0.45)",
        "card-hover":
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 64px -12px rgba(110,86,255,0.25)",
      },
      backdropBlur: {
        glass: "24px",
      },
      backgroundColor: {
        glass: "rgba(255, 255, 255, 0.04)",
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
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shine: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "coin-drop": {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { transform: "translateY(40px) rotate(180deg)", opacity: "1" },
          "100%": { transform: "translateY(50px) rotate(200deg)", opacity: "0" },
        },
        "blob-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 15px) scale(0.95)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 40s linear infinite",
        shine: "shine 0.8s ease-in-out",
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "coin-drop": "coin-drop 2s ease-in infinite",
        "blob-drift": "blob-drift 60s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
