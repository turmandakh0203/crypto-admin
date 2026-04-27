import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        ttNormsPro: ['var(--font-tt-norms-pro)', 'Inter', 'sans-serif'],
      },
      colors: {
        bg:      'var(--bg)',
        surface: 'var(--surface)',
        border:  'var(--border)',
        ink:     'var(--ink)',
        muted:   'var(--muted)',
        faint:   'var(--faint)',
        accent:  'var(--accent)',
        success: 'var(--success)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
