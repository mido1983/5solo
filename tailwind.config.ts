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
        graphite: {
          900: "#0d1017",
          800: "#141821",
          700: "#1c2230",
        },
        accent: {
          gold: "#f5b400",
          blue: "#3ab4f2",
        },
        surface: "#10141f",
        body: "#f5f7fa",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(58, 180, 242, 0.35)",
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
    },
  },
  plugins: [tailwindcssRtl],
};

export default config;

