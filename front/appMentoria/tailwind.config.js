/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        buttonLight: 'var(--button-light)',
        buttonDark: 'var(--button-dark)',
        containersLight: 'var(--containers-light)',
        containersDark: 'var(--containers-dark)',
        backgroundLight: 'var(--background-light)',
        backgroundDark: 'var(--background-dark)',
        bgPrimary: 'var(--bg-primary)',
        textPrimary: 'var(--text-primary)',
        buttonPrimary: 'var(--button-primary)',
        buttonHoverPrimary: 'var(--button-hover-primary)',
      },
      boxShadow: {
        custom: 'var(--box-shadow)',
    },
  },
  },
  plugins: [],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
  ]
}

