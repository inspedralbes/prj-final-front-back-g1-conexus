import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: {},
    accessToken: localStorage.getItem('accessToken') || '',
    unreadMessagesCount: 0,
    testMode: false // Desactivar el modo de prueba
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    getUnreadCount: (state) => state.unreadMessagesCount,
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
    // Methods for handling unread messages
    setUnreadCount(count) {
      this.unreadMessagesCount = count;
    },
    incrementUnreadCount() {
      this.unreadMessagesCount++;
    },
    decrementUnreadCount() {
      if (this.unreadMessagesCount > 0) {
        this.unreadMessagesCount--;
      }
    },
    updateUnreadMessagesCount() {
      // Skip actual count update when in test mode
      if (this.testMode) {
        console.log("In test mode, keeping unreadMessagesCount at:", this.unreadMessagesCount);
        return;
      }

      try {
        const userId = this.getUserId();
        if (!userId) {
          console.log("No user ID found, resetting unread count to 0");
          this.unreadMessagesCount = 0;
          return;
        }

        const storageKey = `chat_unread_${userId}`;
        const data = localStorage.getItem(storageKey);
        console.log(`Checking localStorage key: ${storageKey}, data:`, data);

        if (!data) {
          console.log("No unread messages data in localStorage, resetting count to 0");
          this.unreadMessagesCount = 0;
          return;
        }

        const unreadMessages = JSON.parse(data);
        console.log("Parsed unread messages:", unreadMessages);

        // Count properties that have value of true
        let count = 0;
        for (const key in unreadMessages) {
          if (unreadMessages[key] === true) {
            count++;
            console.log(`User ${key} has unread messages, incrementing count`);
          }
        }

        console.log(`Total unread count: ${count}, updating state`);
        this.unreadMessagesCount = count;
      } catch (e) {
        console.error("Error updating unread message count:", e);
        this.unreadMessagesCount = 0;
      }
    }
  }
});