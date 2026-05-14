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
          DEFAULT: "#0A0E1A",
          foreground: "#F5F7FA",
        },
        accent: {
          DEFAULT: "#00E0B8",
          secondary: "#5BFFCC",
          foreground: "#0A0E1A",
        },
        gold: {
          DEFAULT: "#D4AF37",
          foreground: "#0A0E1A",
        },
        surface: {
          DEFAULT: "#11162A",
          foreground: "#F5F7FA",
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
        "text-high": "#F5F7FA",
        "text-mid": "#A0AEC0",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #0A0E1A 0%, #1B2349 50%, #00E0B8 140%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 40s linear infinite",
        shine: "shine 0.8s ease-in-out",
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "coin-drop": "coin-drop 2s ease-in infinite",
      },
    },
  },
  plugins: [],
};

export default config;
