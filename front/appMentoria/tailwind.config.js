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
        textThemeColorInverse: 'var(--text-inverse)',
        bgColorPrimary: 'var(--bg-primary)',
        textColorPrimary: 'var(--text-primary)',
        buttonColorPrimary: 'var(--button-primary)',
        buttonColorSecondary: 'var(--button-secondary)',
        buttonColorTertiary: 'var(--button-tertiary)'
      },
      boxShadow: {
        custom: 'var(--box-shadow)',
      },
      scrollbar: {
        track: 'var(--background)',
        thumb: 'var(--bg-primary)',
        thumbHover: 'var(--bg-primary-hover)',
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