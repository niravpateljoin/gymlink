/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enables class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all React components
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#38e07b",
        "background-light": "#f6f8f7",
        "background-dark": "#122017",
        "text-light": "#111714",
        "text-dark": "#f6f8f7",
        "subtle-light": "#dce5df",
        "subtle-dark": "#2a3c32",
        "placeholder-light": "#648772",
        "placeholder-dark": "#9ab8a8",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
};
