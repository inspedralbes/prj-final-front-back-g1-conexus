import { defineStore } from 'pinia'

export const useAppStore = defineStore( 'appStore', {  
  state: () => ({
    user: {},
    accessToken: '',
    refreshToken: '',
    language: '',
    selectedColor: ''
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    getUser() {
      return this.user
    },
    setAccessToken(accessToken) {
      this.accessToken = accessToken
    },
    getAccessToken() {
      return this.accessToken
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken
    },
    setSelectedColor(color) {
      this.selectedColor = color
    },
    getSelectedColor() {
       return this.selectedColor
    },        
    getRefreshToken() {
      return this.refreshToken
    },
    getTypeUser() {
      return this.user.typesUsers_id
    },
    setLanguage(language) {
      this.language = language
    },
    getLanguage() {
      return this.language
    }
  }
});