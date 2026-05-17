/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
// tailwind.config.js
theme: {
  extend: {
    // 🌐 Typography
    fontFamily: {
      sans: ["Sora", "sans-serif"],
    },

    // 🎨 Colors (kept your naming)
    colors: {
      primary: {
        DEFAULT: "#F59E0B",
        light: "#FCD34D",
        dark: "#D97706",
      },

      background: {
        DEFAULT: "#0F0E0C",
        light: "#1C1A16",
        lighter: "#292318",
      },

      surface: {
        DEFAULT: "#1C1A16",
        light: "#292318",

        // 🔥 NEW (glass layer without breaking old keys)
        glass: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        hover: "rgba(255,255,255,0.05)",
      },

      text: {
        primary: "#FEF3C7",
        secondary: "#A16207",
        tertiary: "#78716C",
      },

      accent: {
        DEFAULT: "#F59E0B",
        gold: "#FCD34D",
        green: "#34D399",
      },
    },

    // 🌈 Gradients (gold luxury style)
    backgroundImage: {
      "gradient-primary":
        "linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #D97706 100%)",

      "gradient-soft":
        "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(252,211,77,0.08))",

      "gradient-card":
        "linear-gradient(160deg, rgba(41,35,24,0.7), rgba(15,14,12,0.95))",

      "gradient-border":
        "linear-gradient(120deg, rgba(245,158,11,0.6), rgba(252,211,77,0.6))",
    },

    // 🧊 Blur (glass effect)
    backdropBlur: {
      sm: "6px",
      md: "12px",
      lg: "20px",
    },

    // 💡 Shadows (gold glow)
    boxShadow: {
      card: "0 20px 60px rgba(0,0,0,0.8)",
      soft: "0 10px 30px rgba(0,0,0,0.4)",

      // 🔥 premium glow (important)
      glow: "0 0 40px rgba(245,158,11,0.35)",

      btn: "0 6px 20px rgba(245,158,11,0.45)",
    },

    // 🧩 Radius
    borderRadius: {
      xl2: "1.25rem",
      xl3: "1.75rem",
    },

    // ⚡ Animations
    keyframes: {
      glowPulse: {
        "0%,100%": { opacity: 0.6 },
        "50%": { opacity: 1 },
      },
    },

    animation: {
      glow: "glowPulse 3s ease-in-out infinite",
    },

    // 🎯 Transitions
    transitionDuration: {
      300: "300ms",
      500: "500ms",
    },
  },
},
plugins: [],
}