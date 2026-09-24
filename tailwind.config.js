/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: "#03070C",
        "background-deep": "#010409",
        "background-soft": "#070D14",

        // Surfaces
        surface: "#0A1119",
        "surface-soft": "#0D151F",

        // Text
        "text-primary": "#F4F7FA",
        "text-secondary": "#B8C1CC",
        "text-muted": "#7E8997",
        "text-faint": "#56616E",

        // Accent
        accent: "#DCEBFF",
        "accent-soft": "#AFC9E8",
        "accent-blue": "#8FB8E8",

        // Borders
        "border-subtle": "rgba(220, 235, 255, 0.08)",
        border: "rgba(220, 235, 255, 0.14)",
        "border-strong": "rgba(220, 235, 255, 0.24)",

        // Existing colors — temporary compatibility
        primary: "#030014",
        secondary: "#151312",
        light100: "#d6c6ff",
        light200: "#a8b5db",
        light300: "#9ca4ab",
        dark100: "#221f3d",
        dark200: "#0f0d23",
      },

      fontSize: {
        display: [
          "36px",
          {
            lineHeight: "42px",
            letterSpacing: "-0.8px",
          },
        ],

        title: [
          "28px",
          {
            lineHeight: "34px",
            letterSpacing: "-0.4px",
          },
        ],

        heading: [
          "22px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.2px",
          },
        ],

        body: [
          "16px",
          {
            lineHeight: "24px",
          },
        ],

        "body-sm": [
          "14px",
          {
            lineHeight: "20px",
          },
        ],

        caption: [
          "12px",
          {
            lineHeight: "16px",
          },
        ],

        label: [
          "11px",
          {
            lineHeight: "14px",
            letterSpacing: "0.5px",
          },
        ],
      },

      borderRadius: {
        card: "20px",
        "card-sm": "14px",
        "card-lg": "28px",
        pill: "999px",
      },

      boxShadow: {
        glow: "0 0 24px rgba(180, 215, 255, 0.12)",
        card: "0 8px 30px rgba(0, 0, 0, 0.35)",
      },
    },
  },

  plugins: [],
};