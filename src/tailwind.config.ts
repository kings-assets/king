
import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        headline: ['var(--font-belleza)', 'sans-serif'],
        body: ['var(--font-alegreya)', 'serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-pattern': '40px 40px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'preloader-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'preloader-typing': {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'preloader-blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'hsl(var(--primary))' },
        },
        'preloader-star-move': {
          from: { transform: 'translateY(0px)' },
          to: { transform: 'translateY(-2000px)' },
        },
        'preloader-grid-pulse': {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.3' },
        },
        'preloader-logo-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'drop-shadow(0 0 15px hsl(var(--primary)/0.7)) drop-shadow(0 0 30px hsl(var(--accent)/0.5))',
          },
          '50%': { 
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 0 25px hsl(var(--primary)/0.9)) drop-shadow(0 0 45px hsl(var(--accent)/0.7))',
          },
        },
        'aurora-pulse': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 10px hsl(var(--primary)/0.9)) drop-shadow(0 0 25px hsl(var(--accent)/0.7))'
          },
          '50%': {
            filter: 'drop-shadow(0 0 15px hsl(var(--primary)/1)) drop-shadow(0 0 40px hsl(var(--accent)/0.8))'
          }
        },
        'logo-aurora-glow': {
            '0%, 100%': {
              filter: 'drop-shadow(0 0 10px hsl(var(--primary)/0.7)) drop-shadow(0 0 15px hsl(var(--accent)/0.5))'
            },
            '50%': {
              filter: 'drop-shadow(0 0 15px hsl(var(--primary)/0.9)) drop-shadow(0 0 25px hsl(var(--accent)/0.7))'
            }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'aurora-pulse': 'aurora-pulse 4s infinite ease-in-out',
        'logo-aurora-glow': 'logo-aurora-glow 3s infinite ease-in-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
