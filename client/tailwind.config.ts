import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2563EB",
                    dark: "#1D4ED8",
                    light: "#60A5FA",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                surface: "hsl(var(--surface))",
                border: "hsl(var(--border))",
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "#60A5FA",
                    foreground: "#ffffff",
                    secondary: "#8B5CF6",
                }
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem",
                "4xl": "2rem",
                "5xl": "2.5rem",
                "2.5xl": "1.25rem",
            },
            boxShadow: {
                premium: "var(--shadow-premium)",
                "premium-xl": "var(--shadow-premium-xl)",
                glow: "var(--shadow-glow)",
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                "pulse-slow": "pulse-slow 8s ease-in-out infinite",
            },
            fontFamily: {
                inter: ["var(--font-inter)", "sans-serif"],
                outfit: ["var(--font-outfit)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
