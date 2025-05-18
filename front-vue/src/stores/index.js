import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: {},
    accessToken: localStorage.getItem('accessToken') || '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
  },
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
      return this.user.typeusers?.id || null;
    },
    getUserId() {
      return this.user.id;
    },
    getAccessToken() {
      return this.accessToken;
    },
    clearUser() {
      this.user = {};
      this.accessToken = '';
    },
    setUserDepartment(department) {
      this.user.department_id = department;
    },
  }
});