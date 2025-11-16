/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}",
     "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        secondary: "#151312",
        light100: "#d6c6ff",
        light200: "#a8b5db",
        light300: "#9ca4ab",
        dark100: "#221f3d",
        dark200: "#0f0d23",
        accent: "#ab8bff",
      },
    },
  },
  plugins: [],
}
