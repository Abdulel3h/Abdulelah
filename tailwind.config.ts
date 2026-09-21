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
        display: ["var(--font-fraunces)", "Georgia", "Cambria", "serif"],
        arabic: ["var(--font-thmanyah)", "var(--font-inter)", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          DEFAULT: "#0A0A0B",
          900: "#0A0A0B",
          800: "#121214",
          700: "#1B1B1E",
          600: "#26262A"
        },
        // Single signature accent — a warm brass/gold, used with restraint.
        accent: {
          DEFAULT: "#C9A75C",
          soft: "#E6D2A0",
          deep: "#8A6E32"
        },
        // Warm "premium paper" text on deep ink. Every step clears WCAG AA for
        // normal text on the ink surfaces (#0A0A0B–#1B1B1E):
        //   paper ≈ 17:1 · dim ≈ 8:1 · faint ≈ 5.4:1
        // `faint` used to be #75716A (≈4.0:1), which failed for small labels.
        paper: {
          DEFAULT: "#F2EFE7",
          dim: "#ACA79B",
          faint: "#8E897F"
        },
        // Form-control and meaningful UI boundaries: ≥ 3:1 against ink.
        line: {
          control: "#6B675F"
        }
      },
      boxShadow: {
        glow: "0 28px 80px -32px rgba(0, 0, 0, 0.75)"
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
