import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: {},
    accessToken: '',
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setAccessToken(accessToken) {
      this.accessToken = accessToken;
    },
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

  },
);