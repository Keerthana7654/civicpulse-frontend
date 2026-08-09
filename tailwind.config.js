/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        civic: {
          DEFAULT: "#1E3A5F",
          light: "#2F5789",
          dark: "#122840",
        },
        signal: {
          DEFAULT: "#F0A73B",
          light: "#FBC873",
        },
        resolved: {
          DEFAULT: "#2F9E68",
          light: "#7FD6A6",
        },
        paper: "#F4F6F3",
        ink: "#16212E",
        slate: {
          soft: "#64748B",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,33,46,0.06), 0 4px 16px rgba(22,33,46,0.06)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
