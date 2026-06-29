import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "Cambria", "serif"]
      },
      colors: {
        midnight: "#050816",
        ink: {
          DEFAULT: "#0A0A0B",
          900: "#0A0A0B",
          800: "#121214",
          700: "#1B1B1E",
          600: "#26262A"
        },
        navy: "#0B1120",
        electric: "#00A3FF",
        "brand-cyan": "#38BDF8",
        "brand-violet": "#7C3AED",
        // Single signature accent — a warm brass/gold, used with restraint.
        accent: {
          DEFAULT: "#C9A75C",
          soft: "#E6D2A0",
          deep: "#8A6E32"
        },
        // Warm "premium paper" text on deep ink.
        paper: {
          DEFAULT: "#F2EFE7",
          dim: "#ACA79B",
          faint: "#75716A"
        },
        gold: "#C9A84C",
        silver: "#CBD5E1"
      },
      boxShadow: {
        glow: "0 28px 80px -32px rgba(0, 0, 0, 0.75)",
        "gold-glow": "0 0 0 1px rgba(201, 168, 76, 0.16)"
      },
      letterSpacing: {
        eyebrow: "0.2em"
      },
      backgroundImage: {
        "soft-grid":
          "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
