/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#F59E0B",   // amber
        light:   "#FCD34D",
        dark:    "#D97706",
      },
      background: {
        DEFAULT: "#0F0E0C",   // obsidian black
        light:   "#1C1A16",
        lighter: "#292318",
      },
      surface: {
        DEFAULT: "#1C1A16",
        light:   "#292318",   // cards, inputs
      },
      text: {
        primary:   "#FEF3C7",
        secondary: "#A16207",
        tertiary:  "#78716C",
      },
      accent: {
        DEFAULT: "#F59E0B",
        gold:    "#FCD34D",   // prices
        green:   "#34D399",   // in stock
      },
    },
  },
},
  plugins: [],
}