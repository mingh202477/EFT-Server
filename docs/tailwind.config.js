/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./guides/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4D4D",
        secondary: "#3D5A80",
        dark: "#293241",
        light: "#EEF5FF",
        accent: "#F2CC8F",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
