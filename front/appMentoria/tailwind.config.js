/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        buttomLight: 'var(--buttom-light)',
        buttomDark: 'var(--buttom-dark)',
        containersLight: 'var(--containers-light)',
        containersDark: 'var(--containers-dark)',
        backgroundLight: 'var(--background-light)',
        backgroundDark: 'var(--background-dark)',    
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

