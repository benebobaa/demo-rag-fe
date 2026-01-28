/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "rgb(var(--color-bg) / <alpha-value>)",
                surface: "rgb(var(--color-surface) / <alpha-value>)",
                ink: "rgb(var(--color-ink) / <alpha-value>)",
                muted: "rgb(var(--color-muted) / <alpha-value>)",
                border: "rgb(var(--color-border) / <alpha-value>)",
                accent: "rgb(var(--color-accent) / <alpha-value>)",
                "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
                "glow-1": "rgb(var(--color-glow-1) / <alpha-value>)",
                "glow-2": "rgb(var(--color-glow-2) / <alpha-value>)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                glow: "var(--shadow-glow)",
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
            },
            fontSize: {
                xs: ["0.75rem", { lineHeight: "1rem" }],
                sm: ["0.875rem", { lineHeight: "1.5rem" }],
                base: ["1rem", { lineHeight: "1.75rem" }],
                lg: ["1.125rem", { lineHeight: "1.75rem" }],
                xl: ["1.25rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.5rem", { lineHeight: "2rem" }],
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
                "5xl": ["3rem", { lineHeight: "1.1" }],
                "6xl": ["3.5rem", { lineHeight: "1.05" }],
                "7xl": ["4rem", { lineHeight: "1" }],
            },
        },
    },
    plugins: [],
}
