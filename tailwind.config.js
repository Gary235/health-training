/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutrals
        neutral: {
          50: 'rgb(250 250 250)',
          100: 'rgb(244 244 245)',
          200: 'rgb(228 228 231)',
          300: 'rgb(212 212 216)',
          400: 'rgb(161 161 170)',
          500: 'rgb(113 113 122)',
          600: 'rgb(82 82 91)',
          700: 'rgb(63 63 70)',
          800: 'rgb(39 39 42)',
          900: 'rgb(24 24 27)',
          950: 'rgb(9 9 11)',
        },
        // AI Accent
        ai: {
          DEFAULT: 'rgb(79 70 229)',
          light: 'rgb(238 235 255)',
          border: 'rgb(199 193 255)',
          hover: 'rgb(224 217 255)',
        },
        // Section accent colors (subtle, flat structure for Tailwind)
        'accent-meal': 'rgb(245 158 11)', // Amber - warm, food
        'accent-training': 'rgb(59 130 246)', // Blue - energy, activity
        'accent-daily': 'rgb(20 184 166)', // Teal - present, today
        'accent-metrics': 'rgb(168 85 247)', // Purple - data, analysis
        'accent-analysis': 'rgb(99 102 241)', // Indigo - insights
        // Semantics
        success: {
          DEFAULT: 'rgb(22 101 52)',
          bg: 'rgb(240 253 244)',
          border: 'rgb(187 247 208)',
        },
        warning: {
          DEFAULT: 'rgb(133 77 14)',
          bg: 'rgb(254 252 232)',
          border: 'rgb(253 230 138)',
        },
        error: {
          DEFAULT: 'rgb(153 27 27)',
          bg: 'rgb(254 242 242)',
          border: 'rgb(254 202 202)',
        },
        info: {
          DEFAULT: 'rgb(29 78 216)',
          bg: 'rgb(239 246 255)',
          border: 'rgb(191 219 254)',
        },
        // Legacy compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        md: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'metric-lg': ['2.25rem', { lineHeight: '1', fontWeight: '700' }],
        'metric-xl': ['3rem', { lineHeight: '1', fontWeight: '700' }],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
}
