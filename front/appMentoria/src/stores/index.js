import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: {},
    accessToken: '',
    refreshToken: '',
    language: '',
    themes: ['light', 'dark'],
    colors: ['purple', 'pink', 'yellow', 'green', 'blue'],
    selectedColor: localStorage.getItem('color') || 'purple',
    selectedTheme: localStorage.getItem('theme') || 'light',
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setAccessToken(accessToken) {
      this.accessToken = accessToken;
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken;
    },
    setLanguage(language) {
      this.language = language;
    },
    setThemes(themes) {
      this.themes = themes;
    },
    setColors(colors) {
      this.colors = colors;
    },
    setSelectedColor(color) {
      this.selectedColor = color;
      localStorage.setItem('color', color);
    },
    setSelectedTheme(theme) {
      this.selectedTheme = theme;
      localStorage.setItem('theme', theme);
    },
    getUser() {
      return this.user;
    },
    getTypeUser() {
      return this.user.type;
    },
    getAccessToken() {
      return this.accessToken;
    },
    getRefreshToken() {
      return this.refreshToken;
    },
    getLanguage() {
      return this.language;
    },
    getThemes() {
      return this.themes;
    },
    getColors() {
      return this.colors;
    },
    getSelectedColor() {
      return this.selectedColor;
    },
    getSelectedTheme() {
      return this.selectedTheme;
    },
  },
});