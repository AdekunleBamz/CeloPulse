/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'celo-green': '#35D07F',
        'celo-gold': '#FBCC5C',
        'celo-dark': '#2E3338',
        border: 'rgba(20, 184, 166, 0.2)',
      },
      fontFamily: {
        'display': ['JetBrains Mono', 'monospace'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
