import { defineStore } from 'pinia'

export const useAppStore = defineStore( 'appStore', {  
  state: () => ({
    user: {},
    accessToken: '',
    refreshToken: '',
    language: ''
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