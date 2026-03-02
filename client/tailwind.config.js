/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--color-primary))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border-color))",
      },
      boxShadow: {
        premium: "var(--shadow-premium)",
        "premium-xl": "var(--shadow-premium-xl)",
        glow: "var(--shadow-glow)",
      },
      borderRadius: {
        "2.5xl": "1.5rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
}