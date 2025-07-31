/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            primary: 'var(--primary)',
            'primary-hover': 'var(--primary-hover)',
            'primary-light': 'var(--primary-light)',
            background: 'var(--background)',
            card: 'var(--card)',
            'text-primary': 'var(--text-primary)',
            'text-muted': 'var(--text-muted)',
            border: 'var(--border)',
            input: 'var(--input)',
        }
    },
  },
  plugins: [],
}
