/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/preset");

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        slate: {
          200: "#E5E7EB",
          400: "#94A3B8",
          500: "#6B7280",
          600: "#475569",
        },
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "System", "sans-serif"],
        sans: ["Inter", "System", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
        pill: "999px",
      },
    },
  },
  plugins: [],
};
