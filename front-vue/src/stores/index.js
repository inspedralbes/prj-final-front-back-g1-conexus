import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: {
      name: '',
      email: '',
      password: '',
      profile: '',
      department_id: null,
      description: '',
      typesUsers_id: null,
      id: null,
    },
    accessToken: '',
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setAccessToken(accessToken) {
      this.accessToken = accessToken;
    },
    getUser() {
      return this.user;
    },
    getTypeUser() {
      return this.user.typesUsers_id;
    },
    getUserId() {
      return this.user.id;
    },
    getAccessToken() {
      return this.accessToken;
    }
}});