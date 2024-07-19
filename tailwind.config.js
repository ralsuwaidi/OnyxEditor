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
        dracula: {
          "50": "#f9f5ff",
          "100": "#f1e9fe",
          "200": "#e5d6fe",
          "300": "#d2b6fc",
          "400": "#bd93f9",
          "500": "#9b5af2",
          "600": "#8439e4",
          "700": "#7027c9",
          "800": "#6025a4",
          "900": "#4f1f84",
          "950": "#330a61",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#202124",
        },
        "text-color": {
          DEFAULT: "#000000",
          dark: "#f4f4f5",
        },
      },
    },
  },
  darkMode: "media",
  plugins: [require("@tailwindcss/typography")],
};
