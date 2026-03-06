/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        "gold-light": "#E8D5A3",
        "gold-dark": "#8B7535",
        dark: "#080808",
        "dark-card": "#161616",
        "dark-light": "#0e0e0e",
        cream: "#F2EDE3",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;

