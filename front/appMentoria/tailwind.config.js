/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        buttonTheme: 'var(--button)',
        containersTheme: 'var(--containers)',
        bgTheme: 'var(--background)',
        textThemeColor: 'var(--text-color)',
        bgColorPrimary: 'var(--bg-primary)',
        textColorPrimary: 'var(--text-primary)',
        buttonColorPrimary: 'var(--button-primary)',
        buttonColorHoverPrimary: 'var(--button-hover-primary)',
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

