import type { Config } from "tailwindcss";
import tailwindcssRtl from "tailwindcss-rtl";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: "#050a1a",
          surface: "#0f1a30",
          overlay: "#18254a",
          line: "#233159",
          muted: "#a2adc6",
          foreground: "#f5f6ff",
        },
        accent: {
          primary: "#3dd6ff",
          secondary: "#ff9f43",
          success: "#34d399",
          danger: "#f87171",
        },
        paletteA: {
          base: "#050a1a",
          surface: "#0f1a30",
          overlay: "#18254a",
          line: "#233159",
          foreground: "#f5f6ff",
          accentPrimary: "#3dd6ff",
          accentSecondary: "#ff9f43",
        },
        paletteB: {
          base: "#1b140d",
          surface: "#2a2017",
          overlay: "#3b2c1f",
          line: "#453629",
          foreground: "#f6f1ea",
          accentPrimary: "#1ea7ff",
          accentSecondary: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(61, 214, 255, 0.35)",
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          "2xl": "1280px",
        },
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-in-out both",
      },
      ringColor: {
        accent: "#3dd6ff",
      },
    },
  },
  plugins: [tailwindcssRtl],
};

export default config;
