/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        github: {
          bg: {
            DEFAULT: 'rgb(var(--gh-bg) / <alpha-value>)',
            secondary: 'rgb(var(--gh-bg-secondary) / <alpha-value>)',
            tertiary: 'rgb(var(--gh-bg-tertiary) / <alpha-value>)'
          },
          border: {
            DEFAULT: 'rgb(var(--gh-border) / <alpha-value>)',
            muted: 'rgb(var(--gh-border-muted) / <alpha-value>)'
          },
          text: {
            DEFAULT: 'rgb(var(--gh-text) / <alpha-value>)',
            secondary: 'rgb(var(--gh-text-secondary) / <alpha-value>)',
            link: 'rgb(var(--gh-text-link) / <alpha-value>)'
          },
          accent: {
            DEFAULT: 'rgb(var(--gh-accent) / <alpha-value>)',
            success: 'rgb(var(--gh-accent-success) / <alpha-value>)',
            danger: 'rgb(var(--gh-accent-danger) / <alpha-value>)',
            purple: 'rgb(var(--gh-accent-purple) / <alpha-value>)'
          },
          status: {
            open: 'rgb(var(--gh-status-open) / <alpha-value>)',
            closed: 'rgb(var(--gh-status-closed) / <alpha-value>)',
            merged: 'rgb(var(--gh-status-merged) / <alpha-value>)',
            draft: 'rgb(var(--gh-status-draft) / <alpha-value>)'
          }
        },
        brand: {
          action: '#06B6D4',
          surface: 'rgb(var(--gh-bg-secondary) / <alpha-value>)',
          ai: '#8957e5'
        }
      }
    },
  },
  plugins: [],
}
