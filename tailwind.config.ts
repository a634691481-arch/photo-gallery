import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'Noto Serif SC', 'STSong', 'SimSun', 'serif'],
        body: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Microsoft JhengHei',
          'sans-serif',
        ],
      },
      colors: {
        cream: {
          DEFAULT: 'rgb(var(--color-cream) / <alpha-value>)',
          dark: 'rgb(var(--color-cream-dark) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          soft: 'rgb(var(--color-ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
        },
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgb(43 37 32 / 0.03), 0 8px 24px rgb(43 37 32 / 0.05)',
        'soft-lg': '0 2px 4px rgb(43 37 32 / 0.04), 0 16px 48px rgb(43 37 32 / 0.09)',
      },
      transitionTimingFunction: {
        soft: 'var(--ease-soft)',
      },
    },
  },
  plugins: [],
} satisfies Config
