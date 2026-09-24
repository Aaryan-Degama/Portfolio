/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#2997FF",
        gray: {
          DEFAULT: "#86868b",
          100: "#94928d",
          200: "#afafaf",
          300: "#42424570",
        },
        zinc: "#101010",
        void: "#0b0a09",
        carbon: {
          DEFAULT: "#151311",
          hi: "#1c1a17",
        },
        paper: "#fffce1",
        bone: "#b9af95",
        dust: "#8b8371",
        // Home page (inverted scheme): light surfaces/text on black.
        snow: "#f2f1ec",
        ash: "#a3a19b",
        umber: "#57524a",
      },

      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        display: ["Unbounded", "sans-serif"],
        code: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};