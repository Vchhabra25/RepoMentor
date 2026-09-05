import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0C11",
          soft: "#0D1017",
        },
        surface: {
          DEFAULT: "#12151D",
          elevated: "#171B26",
          hover: "#1C2130",
        },
        border: {
          DEFAULT: "#212636",
          soft: "#1A1E2B",
        },
        ink: {
          DEFAULT: "#E8EAF0",
          muted: "#8C93A8",
          faint: "#565D72",
        },
        accent: {
          indigo: "#7C6CF0",
          cyan: "#2CD9E8",
          amber: "#F5B85C",
          rose: "#F0729A",
        },
        state: {
          success: "#3FCF8E",
          danger: "#F1685E",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "signal-gradient": "linear-gradient(135deg, #7C6CF0 0%, #2CD9E8 100%)",
        "signal-gradient-soft":
          "linear-gradient(135deg, rgba(124,108,240,0.15) 0%, rgba(44,217,232,0.15) 100%)",
      },
      backgroundSize: {
        grid: "42px 42px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,108,240,0.15), 0 8px 30px rgba(124,108,240,0.12)",
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        scanline: "scanline 2.4s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        dash: "dash 1.6s ease-out forwards",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
