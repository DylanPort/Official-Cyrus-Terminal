import { type Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: "hsl(var(--neon-green) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--background) / 0.6)",
          foreground: "hsl(var(--foreground) / 0.6)",
        },
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "text-gradient": "text-gradient 8s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "top center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "bottom center",
          },
        },
        "text-gradient": {
          "0%, 100%": {
            "background-size": "200% auto",
            "background-position": "0% center",
          },
          "50%": {
            "background-size": "200% auto",
            "background-position": "100% center",
          },
        },
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
      },
    },
  },
} satisfies Config;