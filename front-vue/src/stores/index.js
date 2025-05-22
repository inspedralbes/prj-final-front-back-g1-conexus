import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: {},
    accessToken: localStorage.getItem('accessToken') || '',
    unreadMessagesCount: 0,
    testMode: false, // Desactivar el modo de prueba
    cartCantinaItems: [],
    // Estado para gestionar los pedidos de la cantina
    canteenOrderStatus: JSON.parse(localStorage.getItem('canteenOrderStatus') || '{}'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    getUnreadCount: (state) => state.unreadMessagesCount,
    // Obtener chats por estado
    getCanteenOrdersByStatus: (state) => (status) => {
      return Object.entries(state.canteenOrderStatus)
        .filter(([_, orderStatus]) => orderStatus === status)
        .map(([chatId, _]) => chatId);
    }
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
    },    // Methods for handling unread messages
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
        return;
      }

      try {
        const userId = this.getUserId();
        if (!userId) {
          this.unreadMessagesCount = 0;
          return;
        }

        const storageKey = `chat_unread_${userId}`;
        const data = localStorage.getItem(storageKey);

        if (!data) {
          this.unreadMessagesCount = 0;
          return;
        }

        const unreadMessages = JSON.parse(data);

        // Count properties that have value of true
        let count = 0;
        for (const key in unreadMessages) {
          if (unreadMessages[key] === true) {
            count++;
          }
        }
        this.unreadMessagesCount = count;
      } catch (e) {
        console.error("Error updating unread message count:", e);
        this.unreadMessagesCount = 0;
      }
    },
    addToCartCantina(item) {
      this.cartCantinaItems.push(item);
    },
    removeFromCartCantina(item) {
      this.cartCantinaItems = this.cartCantinaItems.filter((i) => i !== item);
    },

    // Nuevos métodos para gestionar el estado de los pedidos de cantina
    updateOrderStatus(chatId, status) {
      // Actualizar el estado del pedido
      this.canteenOrderStatus[chatId] = status;

      // Persistir en localStorage
      localStorage.setItem('canteenOrderStatus', JSON.stringify(this.canteenOrderStatus));
    },

    getOrderStatus(chatId) {
      return this.canteenOrderStatus[chatId] || 'new';
    },

    // Estados posibles: 'new', 'preparing', 'ready'
    setOrderAsNew(chatId) {
      this.updateOrderStatus(chatId, 'new');
    },

    setOrderAsPreparing(chatId) {
      this.updateOrderStatus(chatId, 'preparing');
    },

    setOrderAsReady(chatId) {
      this.updateOrderStatus(chatId, 'ready');
    },

    // Reiniciar todos los estados de los pedidos - útil para debugging
    resetAllOrderStatuses() {
      this.canteenOrderStatus = {};
      localStorage.setItem('canteenOrderStatus', JSON.stringify(this.canteenOrderStatus));
    },

    // Verificar y corregir inconsistencias en los estados de pedidos
    checkOrderStatusConsistency() {
      // Si hay duplicados donde un chat aparece en múltiples estados, priorizar "new"
      const chatsByStatus = {
        new: this.getCanteenOrdersByStatus('new'),
        preparing: this.getCanteenOrdersByStatus('preparing'),
        ready: this.getCanteenOrdersByStatus('ready')
      };

      let fixedCount = 0;

      // Si un chat está en 'ready' y 'new', prevalece 'new'
      chatsByStatus.ready.forEach(chatId => {
        if (chatsByStatus.new.includes(chatId)) {
          this.setOrderAsNew(chatId);
          fixedCount++;
        }
      });

      // Si un chat está en 'preparing' y 'new', prevalece 'new'
      chatsByStatus.preparing.forEach(chatId => {
        if (chatsByStatus.new.includes(chatId)) {
          this.setOrderAsNew(chatId);
          fixedCount++;
        }
      });


      return fixedCount;
    }
  },
}); 