/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        highlight: {
          DEFAULT: "rgb(219, 253, 173)",
          dark: "rgb(46, 80, 115)",
        },
        background: "rgb(28, 30, 31)",
      },
    },
  },
  darkMode: "media",
  plugins: [require("@tailwindcss/typography")],
};
