/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#c9d1d9',
            maxWidth: 'none',
            hr: { borderColor: '#30363d' },
            'h1, h2, h3, h4': {
              color: '#c9d1d9',
              fontWeight: '600',
              lineHeight: '1.25',
            },
            h1: { fontSize: '2.25rem', marginBottom: '1rem' },
            h2: { fontSize: '1.5rem', borderBottom: '1px solid #30363d', paddingBottom: '0.3rem', marginTop: '1.5rem' },
            h3: { fontSize: '1.35rem', marginTop: '1.5rem' },
            a: {
              color: '#58a6ff',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            code: {
              color: '#c9d1d9',
              backgroundColor: '#161b22',
              padding: '2px 4px',
              borderRadius: '4px',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            blockquote: {
              color: '#8b949e',
              borderLeftColor: '#30363d',
            },
            ul: {
              listStyleType: 'disc',
            },
            'ul > li::marker': {
              color: '#8b949e',
            },
            li: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
            },
            img: {
              borderRadius: '6px',
            },
          },
        },
      },
      colors: {
        github: {
          bg: {
            DEFAULT: '#0d1117',
            secondary: '#161b22',
            tertiary: '#010409'
          },
          border: {
            DEFAULT: '#30363d',
            muted: '#21262d'
          },
          text: {
            DEFAULT: '#c9d1d9',
            secondary: '#8b949e',
            link: '#58a6ff'
          },
          accent: {
            DEFAULT: '#1f6feb',
            success: '#238636',
            danger: '#da3633',
            purple: '#8957e5'
          },
          status: {
            open: '#3fb950',
            closed: '#f85149',
            merged: '#a371f7',
            draft: '#8b949e'
          }
        },
        brand: {
          action: '#06B6D4',
          surface: '#161b22',
          ai: '#8957e5'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
