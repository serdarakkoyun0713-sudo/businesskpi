import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          main: "#0D0F14",
          surface: "#161920",
          surface2: "#1E2230",
        },
        // Borders
        border: {
          DEFAULT: "#2A2F3E",
          subtle: "#1E2230",
        },
        // Text
        text: {
          primary: "#F0F2F8",
          muted: "#7B8299",
          disabled: "#4A5068",
        },
        // Accent colors
        accent: {
          blue: "#4361EE",
          green: "#2DC653",
          red: "#E63946",
          amber: "#F59E0B",
          purple: "#7209B7",
          sky: "#0EA5E9",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        input: "10px",
        badge: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2)",
        "card-hover": "0 2px 8px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(67, 97, 238, 0.25)",
        "glow-green": "0 0 20px rgba(45, 198, 83, 0.2)",
      },
      backgroundImage: {
        "gradient-auth":
          "radial-gradient(ellipse at 20% 50%, rgba(67,97,238,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(114,9,183,0.05) 0%, transparent 50%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
