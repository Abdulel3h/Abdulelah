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
      colors: {
        midnight: "#050816",
        ink: "#0A0F1F",
        navy: "#0B1120",
        electric: "#00A3FF",
        "brand-cyan": "#38BDF8",
        "brand-violet": "#7C3AED",
        gold: "#C9A84C",
        silver: "#CBD5E1"
      },
      boxShadow: {
        glow: "0 0 40px rgba(56, 189, 248, 0.16)",
        "gold-glow": "0 0 34px rgba(201, 168, 76, 0.16)"
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
